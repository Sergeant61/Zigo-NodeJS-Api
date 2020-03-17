module.exports = class Weather {
  constructor(
    il_name,
    son_guncelleme,
    ruzgar,
    ruzgar_yonu,
    nem_orani,
    gorus_mesafesi,
    basinc,
    gunlerList
  ) {
    this.il_name = il_name;
    this.son_guncelleme = son_guncelleme;
    this.ruzgar = ruzgar;
    this.ruzgar_yonu = ruzgar_yonu;
    this.nem_orani = nem_orani;
    this.gorus_mesafesi = gorus_mesafesi;
    this.basinc = basinc;
    this.gunlerList = gunlerList;
  }
};
