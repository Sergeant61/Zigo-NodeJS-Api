# Zigo-NodeJS-Api

# Index

| Route     | HTTP Verb | POST body                                      | Description   | Response Data       |
| --------- | --------- | ---------------------------------------------- | ------------- | ------------------- |
| /login    | `POST`    | {usernmae:"...@gmail.com",password:"\*\*\*\*"} | User Login    | ApiResponse<.Token> |
| /register | `POST`    | User.js                                        | User Register | ApiResponse<.Void>  |

# Users

Token is required as a key under the headers(`x-access-token`).

| Route              | HTTP Verb | POST body | Description | Response Data      |
| ------------------ | --------- | --------- | ----------- | ------------------ |
| api/users          | `GET`     | --------- | User Login  | ApiResponse<.User> |
| api/users/:user_id | `PUT`     | User.js   | User Update | ApiResponse<.User> |
| api/users/:user_id | `DELETE`  | --------- | User Delete | ApiResponse<.Void> |

# Files

Token is required as a key under the headers(`x-access-token`).

| Route              | HTTP Verb | POST body | Description | Response Data                |
| ------------------ | --------- | --------- | ----------- | ---------------------------- |
| api/files          | `POST`    | Body-Form | File Save   | ApiResponse<.File>           |
| api/files/:file_id | `GET`     | ------´-- | File Get    | res.render(new Buffer(file)) |
| api/files/:file_id | `DELETE`  | --------- | File Delete | ApiResponse<.Void>           |

# Weather

Token is required as a key under the headers(`x-access-token`).

| Route                               | HTTP Verb | POST body                             | Description                        | Response Data                |
| ----------------------------------- | --------- | ------------------------------------- | ---------------------------------- | ---------------------------- |
| api/weathers/countries              | `GET`     | ---------                             | All country.                       | ApiResponse<.Country>        |
| api/weathers/province/:country_name | `GET`     | ---------                             | Provinces of the selected country. | ApiResponse<.List<.Country>> |
| api/weathers/weather                | `POST`    | {province_url:"", is_celcius:"false"} | Weather of the selected province.  | ApiResponse<.Weather>        |

# ApiResponse Message and Status Code

| message                              | success | statusCode |
| ------------------------------------ | ------- | ---------- |
| Login failed, user not found.        | false   | 10         |
| Login failed, wrong password.        | false   | 11         |
| Login success.                       | true    | 12         |
| The user has been created.           | true    | 13         |
| errorParser(err)                     | false   | 14         |
| Authenticate failed, user not found. | false   | 15         |
| Authenticate success.                | true    | 16         |
| User update success.                 | true    | 17         |
| User update fail.                    | false   | 18         |
| User delete success.                 | true    | 19         |
| User delete fail.                    | false   | 20         |
| All country.                         | true    | 21         |
| Provinces of the selected country.   | true    | 22         |
| Weather of the selected province.    | true    | 23         |
| Check your mailbox.                  | true    | 24         |
| File save.                           | true    | 25         |
| File not save.                       | false   | 26         |
| Access not found.                    | false   | 27         |
| File delete.                         | true    | 28         |
| File not delete.                     | false   | 29         |
