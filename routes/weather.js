const express = require("express");
const fs = require("fs");
const BeautifulDom = require("beautiful-dom");
const request = require("request");
const router = express.Router();

//Models
const ApiResponse = require("../models/ApiResponse");
const Country = require("../models/Country");
const Province = require("../models/Province");
const Weather = require("../models/Weather");
const WeatherDay = require("../models/WeatherDay");
const WeatherEvents = require("../models/WeatherEvents");

//AllCountry
router.get("/countries", (req, res) => {
  fs.readFile("./res/ulkeler.json", "utf8", (err, data) => {
    if (err) throw err;
    let countryList = JSON.parse(data);

    let apiResponse = new ApiResponse("All country.", true, 21, countryList);
    res.json(apiResponse);
  });
});

module.exports = router;

//provinces of the selected country
router.get("/province/:country_name", (req, res) => {
  let getUlke = req.params.country_name;

  fs.readFile("./res/ulkeler.json", "utf8", (err, data) => {
    if (err) throw err;
    let countryList = JSON.parse(data);
    let provinceList = new Array();

    for (let i = 0; i < countryList.length; i = i + 1) {
      if (getUlke === countryList[i].name) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        request(
          "https://www.havadurumu15gunluk.net" + countryList[i].url,
          (error, res1, body) => {
            let dom = new BeautifulDom(body);

            console.log(getUlke, countryList[i].name, countryList[i].url);

            let tableList = dom.getElementsByTagName("table");
            let optionsList = tableList[4].getElementsByTagName("option");

            for (let k = 145; k < optionsList.length; k = k + 1) {
              let outerHTML = optionsList[k].outerHTML;

              let indexB = outerHTML.indexOf('"');
              let indexL = outerHTML.lastIndexOf('"');

              let url = outerHTML.substring(indexB + 1, indexL);

              const province = new Province(optionsList[k].innerText, url);
              provinceList.push(province);
            }

            let apiResponse = new ApiResponse(
              "Provinces of the selected country.",
              true,
              22,
              provinceList
            );
            res.json(apiResponse);
          }
        );
        break;
      }
    }
  });
});

//weather of the selected province
router.post("/weather", function(req, res) {
  let { province_url, is_celcius } = req.body;

  console.log(province_url, is_celcius);

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  request(
    "https://www.havadurumu15gunluk.net" + province_url,
    (error, res1, body) => {
      let dom = new BeautifulDom(body);
      let tableList = dom.getElementsByTagName("table");
      let trList = tableList[5].getElementsByTagName("tr");

      let tdList = trList[9].getElementsByTagName("td");

      let sonGuncelleme = getOnlyValue(tdList[2].innerText);
      let ruzgar,
        ruzgarYonu,
        nemOrani,
        gorusMesafesi,
        basinc,
        hissedilenSicaklik,
        ciyNoktasi,
        ilName;
      let iltdList = trList[4].getElementsByTagName("td");

      if (getTurkiye(province_url)) {
        ilName = getIlName(iltdList[0].getAttribute("title"), true);
        //türkiye
        ruzgar = getOnlyValue(tdList[4].innerText);
        ruzgarYonu = getOnlyValue(tdList[6].innerText);
        nemOrani = getOnlyValue(tdList[8].innerText);
        gorusMesafesi = getOnlyValue(tdList[10].innerText);
        basinc = getOnlyValue(tdList[12].innerText);
      } else {
        ilName = getIlName(iltdList[0].getAttribute("title"), false);
        //abd
        hissedilenSicaklik = getOnlyValue(tdList[4].innerText);
        nemOrani = getOnlyValue(tdList[6].innerText);
        gorusMesafesi = getOnlyValue(tdList[8].innerText);
        basinc = getOnlyValue(tdList[10].innerText);
        ciyNoktasi = getOnlyValue(tdList[12].innerText);
      }
      let weatherDayList = new Array();

      for (let i = 15; i < 120; i = i + 7) {
        let date = tdList[i].innerText;
        let day = tdList[i + 1].innerText;
        let aciklama = getAciklamalar(tdList[i + 3].innerText);
        let gunduzSic, geceSic;

        if (is_celcius == true) {
          gunduzSic = getOnlyValue(tdList[i + 4].innerText);
          geceSic = getOnlyValue(tdList[i + 5].innerText);
        } else {
          gunduzSic = getFahrenheit(getOnlyValue(tdList[i + 4].innerText));
          geceSic = getFahrenheit(getOnlyValue(tdList[i + 5].innerText));
        }

        let weatherDay = new WeatherDay(
          date,
          day,
          aciklama,
          gunduzSic,
          geceSic
        );
        weatherDayList.push(weatherDay);
      }

      let weather = new Weather(
        ilName,
        sonGuncelleme,
        ruzgar,
        ruzgarYonu,
        nemOrani,
        gorusMesafesi,
        basinc,
        weatherDayList
      );

      let apiResponse = new ApiResponse(
        "Weather of the selected province.",
        true,
        23,
        weather
      );
      res.json(apiResponse);
    }
  );
});

//---------Functions--------------

function getOnlyValue(value) {
  let indexL = value.lastIndexOf(";");
  return value.substring(indexL + 1, value.length);
}

function getAciklamalar(value) {
  let indexB = value.lastIndexOf("/>");
  let indexL = value.lastIndexOf("</");

  fs.readFile("./res/havaOlaylari.json", "utf8", function(err, data) {
    if (err) throw err;

    let weatherEvents = JSON.parse(data);

    for (let index = 0; index < weatherEvents.length; index++) {
      if (weatherEvents[index].name === value.substring(indexB + 2, indexL)) {
        return index + "";
      }
    }
    return value.substring(indexB + 2, indexL);
  });
}

function getIlName(value, isTurk) {
  let indexB;
  if (isTurk) {
    indexB = value.indexOf(" ");
    return value.substring(0, indexB);
  } else {
    indexB = value.lastIndexOf(" ");
    return value.substring(indexB + 1, value.length);
  }
}

function getFahrenheit(value) {
  value = value.substring(0, value.indexOf("°C"));
  let fahrenheit = ((9 / 5) * parseInt(value) + 32).toFixed(2);
  return fahrenheit + "°F";
}

function getTurkiye(value) {
  value = value.substring(value.indexOf("/") + 1, value.length);
  value = value.substring(0, value.indexOf("/"));

  if (value === "havadurumu") {
    return true;
  } else {
    return false;
  }
}
