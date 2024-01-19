var axios = require('axios');
var md5 = require("md5");
const crypto = require('crypto');
const express = require('express');
var cors = require("cors");
const res = require('express/lib/response');
var qs = require('qs');
const app = express();
app.options("*", cors());
//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



async function tokenApi() {

  try {


    var data = qs.stringify({
      'grant_type': 'client_credentials',
      'client_id': '3a02ba11-1585-4737-8577-2c9fe194f219',
      'client_secret': 'mKq8Q~_3j6hjfr5oNcE~Hyn~Hdwg54fKaLoHOc5y',
      'resource': 'https://management.azure.com'
    });
    var config = {
      method: 'post',
      url: 'https://login.microsoftonline.com/bajajfinance.in/oauth2/token',
      headers: {
        'Cookie': 'fpc=AhpM-DymtyZDtA6AsEx_xXmNYUY5AQAAAGukn9oOAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd; fpc=AhpM-DymtyZDtA6AsEx_xXngskI-AQAAAO-F-toOAAAAoB533AEAAAB9ifraDgAAAA; x-ms-gateway-slice=estsfd',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };




    let access_token = await axios(config);
    //console.log(access_token)
    return access_token.data.access_token
  }
  catch (error) {
    return 'invaild token'
  }
}



//tokenApi();
module.exports.tokenApi = tokenApi;