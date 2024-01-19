

// // //docker build -t srk4393/happi-bajaj-api .

// // //docker build -t srk4393/happi-bajaj-api .




var axios = require('axios');
var md5 = require("md5");
const crypto = require('crypto');
const express = require('express');
var cors = require("cors");
var mongo = require("./db.js");
const app = express();
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));






let data =[
  {
    "APEX-ModelCode": "OP11 8/128 Green",
    "APEX-MODELNAME": "OnePlus 11 5G (8/128) - Eternal Green",
    "SKUNAME": "ONEPLUS115G128GBSTORAGEETERNALGREEN8GBRAM",
    "MODELID": 329046,
    "Bajaj-MRP": 56999,
    "Bajaj-MOP": 56999,
    "HappiMOP": 56999,
    "FinalMOP": 56999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "11R 5G 8/128 Silver",
    "APEX-MODELNAME": "Oneplus 11R 5G (8/128) - Galactic Silver",
    "SKUNAME": "ONEPLUS11R5G128GBSTORAGEGALACTICSILVER8GBRAM",
    "MODELID": 333845,
    "Bajaj-MRP": 39999,
    "Bajaj-MOP": 39999,
    "HappiMOP": 39999,
    "FinalMOP": 39999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "V27 8/128 Blue",
    "APEX-MODELNAME": "V27 5G Vivo 8/128 - Magic Blue",
    "SKUNAME": "VIVOV275G128GBSTORAGEMAGICBLUE8GBRAM",
    "MODELID": 356965,
    "Bajaj-MRP": 32999,
    "Bajaj-MOP": 32999,
    "HappiMOP": 32999,
    "FinalMOP": 32999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "V27 8/128 Black",
    "APEX-MODELNAME": "V27 5G Vivo 8/128 - Noble Black",
    "SKUNAME": "VIVOV275G128GBSTORAGENOBLEBLACK8GBRAM",
    "MODELID": 356965,
    "Bajaj-MRP": 32999,
    "Bajaj-MOP": 32999,
    "HappiMOP": 32999,
    "FinalMOP": 32999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "V27 12/256 Blue",
    "APEX-MODELNAME": "V27 5G Vivo 12/256 - Magic Blue",
    "SKUNAME": "VIVOV275G256GBSTORAGEMAGICBLUE12GBRAM",
    "MODELID": 356964,
    "Bajaj-MRP": 36999,
    "Bajaj-MOP": 36999,
    "HappiMOP": 37099,
    "FinalMOP": 36999,
    "sd": -100
  },
  {
    "APEX-ModelCode": "V27 12/256 Black",
    "APEX-MODELNAME": "V27 5G Vivo 12/256 - Noble Black",
    "SKUNAME": "VIVOV275G256GBSTORAGENOBLEBLACK12GBRAM",
    "MODELID": 356964,
    "Bajaj-MRP": 36999,
    "Bajaj-MOP": 36999,
    "HappiMOP": 37099,
    "FinalMOP": 36999,
    "sd": -100
  },
  {
    "APEX-ModelCode": "11Prime 5G 6/128 Gre",
    "APEX-MODELNAME": "Redmi 11 Prime 5G (6G+128G ) - Meadow Green",
    "SKUNAME": "REDMI11PRIME5G128GBSTORAGEMEADOWGREEN6GBRAM",
    "MODELID": 360256,
    "Bajaj-MRP": 15999,
    "Bajaj-MOP": 15999,
    "HappiMOP": 15999,
    "FinalMOP": 15999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "11Prime 5G 6/128 BLK",
    "APEX-MODELNAME": "Redmi 11 Prime 5G (6G+128G ) - Black",
    "SKUNAME": "REDMI11PRIME5G128GBSTORAGETHANDERBLACK6GBRAM",
    "MODELID": 360255,
    "Bajaj-MRP": 15999,
    "Bajaj-MOP": 15999,
    "HappiMOP": 15999,
    "FinalMOP": 15999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "11Prime5G 4/64 Silvr",
    "APEX-MODELNAME": "Redmi 11 Prime 5G (4G+64G) - Silver",
    "SKUNAME": "REDMI11PRIME5G64GBSTORAGECHROMESILVER4GBRAM",
    "MODELID": 360254,
    "Bajaj-MRP": 13999,
    "Bajaj-MOP": 13999,
    "HappiMOP": 13999,
    "FinalMOP": 13999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "11Prime5G 4/64 Green",
    "APEX-MODELNAME": "Redmi 11 Prime 5G (4G+64G) - Green",
    "SKUNAME": "REDMI11PRIME5G64GBSTORAGEMEADOWGREEN4GBRAM",
    "MODELID": 360253,
    "Bajaj-MRP": 13999,
    "Bajaj-MOP": 13999,
    "HappiMOP": 13999,
    "FinalMOP": 13999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "11Prime5G 4/64 Black",
    "APEX-MODELNAME": "Redmi 11 Prime 5G (4G+64G ) Flashy black",
    "SKUNAME": "REDMI11PRIME5G64GBSTORAGETHANDERBLACK4GBRAM",
    "MODELID": 360252,
    "Bajaj-MRP": 13999,
    "Bajaj-MOP": 13999,
    "HappiMOP": 13999,
    "FinalMOP": 13999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "13Pro 12/256 Ceramic",
    "APEX-MODELNAME": "Xiaomi 13 Pro 5G (12/256GB) - Ceramic Black",
    "SKUNAME": "XIAOMI13PRO256GBSTORAGECERAMICBLACK12GBRAM",
    "MODELID": 348596,
    "Bajaj-MRP": 79999,
    "Bajaj-MOP": 79999,
    "HappiMOP": 79999,
    "FinalMOP": 79999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "13Pro 12/256 White",
    "APEX-MODELNAME": "Xiaomi 13 Pro 5G (12/256GB) - White",
    "SKUNAME": "XIAOMI13PRO256GBSTORAGECERAMICWHITE12GBRAM",
    "MODELID": 348597,
    "Bajaj-MRP": 79999,
    "Bajaj-MOP": 79999,
    "HappiMOP": 79999,
    "FinalMOP": 79999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "RM10Pro+ 6/128 Dark",
    "APEX-MODELNAME": "Realme 10 Pro+ 5G 6/128 - Dark Matter",
    "SKUNAME": "REALME10PROPLUS5G128GBSTORAGEDARKMATTER6GBRAM",
    "MODELID": 313570,
    "Bajaj-MRP": 24999,
    "Bajaj-MOP": 24999,
    "HappiMOP": 24999,
    "FinalMOP": 24999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "Note12 4/128 Green",
    "APEX-MODELNAME": "Redmi Note 12 5G (4G+128G) - Green",
    "SKUNAME": "REDMINOTE125G128GBSTORAGEFROSTEDGREEN4GBRAM",
    "MODELID": 320882,
    "Bajaj-MRP": 18499,
    "Bajaj-MOP": 18499,
    "HappiMOP": 16999,
    "FinalMOP": 18499,
    "sd": 1500
  },
  {
    "APEX-ModelCode": "10R 8/128 Green",
    "APEX-MODELNAME": "Oneplus 10R 5G 8/128�- Forest Green",
    "SKUNAME": "ONEPLUS10R5G128GBSTORAGEFORESTGREEN8GBRAM",
    "MODELID": 285255,
    "Bajaj-MRP": 34999,
    "Bajaj-MOP": 34999,
    "HappiMOP": 34999,
    "FinalMOP": 34999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "10R 80W 12/256�Green",
    "APEX-MODELNAME": "Oneplus 10R 5G 80W�12/256�- Forest Green",
    "SKUNAME": "ONEPLUS10R5G256GBSTORAGEFORESTGREEN12GBRAM",
    "MODELID": 285257,
    "Bajaj-MRP": 38999,
    "Bajaj-MOP": 38999,
    "HappiMOP": 38999,
    "FinalMOP": 38999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "10R 8/128 Black",
    "APEX-MODELNAME": "Oneplus 10R 5G 8/128�- Seirra Black",
    "SKUNAME": "ONEPLUS10R5G128GBSTORAGESIERRABLACK8GBRAM",
    "MODELID": 285256,
    "Bajaj-MRP": 34999,
    "Bajaj-MOP": 34999,
    "HappiMOP": 34999,
    "FinalMOP": 34999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "X90 12/256 Black",
    "APEX-MODELNAME": "X90 5G Vivo 12/256 - Asteroid Black",
    "SKUNAME": "VIVOX90256GBSTORAGEASTEROIDBLACK12GBRAM",
    "MODELID": 362516,
    "Bajaj-MRP": 63999,
    "Bajaj-MOP": 63999,
    "HappiMOP": 64099,
    "FinalMOP": 63999,
    "sd": -100
  },
  {
    "APEX-ModelCode": "X90 12/256 Blue",
    "APEX-MODELNAME": "X90 5G Vivo 12/256 - Breeze Blue",
    "SKUNAME": "VIVOX90256GBSTORAGEBREEZEBLUE12GBRAM",
    "MODELID": 362513,
    "Bajaj-MRP": 63999,
    "Bajaj-MOP": 63999,
    "HappiMOP": 64099,
    "FinalMOP": 63999,
    "sd": -100
  },
  {
    "APEX-ModelCode": "X90 8/256 Black",
    "APEX-MODELNAME": "X90 5G Vivo 8/256 - Asteroid Black",
    "SKUNAME": "VIVOX90256GBSTORAGEASTEROIDBLACK8GBRAM",
    "MODELID": 362514,
    "Bajaj-MRP": 59999,
    "Bajaj-MOP": 59999,
    "HappiMOP": 60099,
    "FinalMOP": 59999,
    "sd": -100
  },
  {
    "APEX-ModelCode": "X90 8/256 Blue",
    "APEX-MODELNAME": "X90 5G Vivo 8/256 - Breeze Blue",
    "SKUNAME": "VIVOX90256GBSTORAGEBREEZEBLUE8GBRAM",
    "MODELID": 362514,
    "Bajaj-MRP": 59999,
    "Bajaj-MOP": 59999,
    "HappiMOP": 60099,
    "FinalMOP": 59999,
    "sd": -100
  },
  {
    "APEX-ModelCode": "CE2Lite 8/128 Black",
    "APEX-MODELNAME": "OnePlus Nord CE 2 Lite 5G 8/128�- Black Dusk",
    "SKUNAME": "ONEPLUSNORDCE2LITE5G128GBSTORAGEBLACKDUSK8GBRAM",
    "MODELID": 373299,
    "Bajaj-MRP": 20999,
    "Bajaj-MOP": 20999,
    "HappiMOP": 20999,
    "FinalMOP": 20999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "CE2Lite 8/128 Blue",
    "APEX-MODELNAME": "OnePlus Nord CE 2 Lite 5G 8/128�- Blue Tide",
    "SKUNAME": "ONEPLUSNORDCE2LITE5G128GBSTORAGEBLUETIDE8GBRAM",
    "MODELID": 373298,
    "Bajaj-MRP": 20999,
    "Bajaj-MOP": 20999,
    "HappiMOP": 20999,
    "FinalMOP": 20999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "CE2Lite 6/128 Blue",
    "APEX-MODELNAME": "OnePlus Nord CE 2 Lite 5G 6/128�-�Blue Tide",
    "SKUNAME": "ONEPLUSNORDCE2LITE5G128GBSTORAGEBLUETIDE6GBRAM",
    "MODELID": 373296,
    "Bajaj-MRP": 18999,
    "Bajaj-MOP": 18999,
    "HappiMOP": 18999,
    "FinalMOP": 18999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "CE2Lite 6/128 Black",
    "APEX-MODELNAME": "OnePlus Nord CE 2 Lite 5G 6/128�- Black Dusk",
    "SKUNAME": "ONEPLUSNORDCE2LITE5G128GBSTORAGEBLACKDUSK6GBRAM",
    "MODELID": 373297,
    "Bajaj-MRP": 18999,
    "Bajaj-MOP": 18999,
    "HappiMOP": 18999,
    "FinalMOP": 18999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "A546ED Voilet",
    "APEX-MODELNAME": "A546ED Galaxy A54 5G (8/256) - Voilet",
    "SKUNAME": "SAMSUNGGALAXYA545G256GBSTORAGEAWESOMEVIOLET8GBRAM",
    "MODELID": 357271,
    "Bajaj-MRP": 42229,
    "Bajaj-MOP": 42229,
    "HappiMOP": 41099,
    "FinalMOP": 42229,
    "sd": 1130
  },
  {
    "APEX-ModelCode": "S916BB Cream",
    "APEX-MODELNAME": "S916BB S23+ (8/256GB) - Cream",
    "SKUNAME": "SAMSUNGGALAXYS23PLUS256GBSTORAGECREAM8GBRAM",
    "MODELID": 332552,
    "Bajaj-MRP": 97849,
    "Bajaj-MOP": 97849,
    "HappiMOP": 94999,
    "FinalMOP": 97849,
    "sd": 2850
  },
  {
    "APEX-ModelCode": "T1Pro 5G 6/128 Black",
    "APEX-MODELNAME": "T1 Pro 5G Vivo 6/128 - Turbo Black",
    "SKUNAME": "VIVOT1PRO5G128GBSTORAGETURBOBLACK6GBRAM",
    "MODELID": 273528,
    "Bajaj-MRP": 23999,
    "Bajaj-MOP": 23999,
    "HappiMOP": 23999,
    "FinalMOP": 23999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "T1Pro 5G 8/128 Black",
    "APEX-MODELNAME": "T1 Pro 5G Vivo 8/128 - Turbo Black",
    "SKUNAME": "VIVOT1PRO5G128GBSTORAGETURBOBLACK8GBRAM",
    "MODELID": 273527,
    "Bajaj-MRP": 24999,
    "Bajaj-MOP": 24999,
    "HappiMOP": 25099,
    "FinalMOP": 24999,
    "sd": -100
  },
  {
    "APEX-ModelCode": "Y56 8/128 Black",
    "APEX-MODELNAME": "Y56 5G Vivo 8/128 - Black",
    "SKUNAME": "VIVOY565G128GBSTORAGEBLACKENGINE8GBRAM",
    "MODELID": 328759,
    "Bajaj-MRP": 19999,
    "Bajaj-MOP": 19999,
    "HappiMOP": 19999,
    "FinalMOP": 19999,
    "sd": 0
  },
  {
    "APEX-ModelCode": "Y22 4/128 Green",
    "APEX-MODELNAME": "Y22 Vivo 4/128 - Metaverse Green",
    "SKUNAME": "VIVOY22128GBSTORAGEMETAVERSEGREEN4GBRAM",
    "MODELID": 361299,
    "Bajaj-MRP": 14999,
    "Bajaj-MOP": 14999,
    "HappiMOP": 15099,
    "FinalMOP": 14999,
    "sd": -100
  },
  {
    "APEX-ModelCode": "Y22 4/128 Blue",
    "APEX-MODELNAME": "Y22 Vivo 4/128 - Starlit blue",
    "SKUNAME": "VIVOY22128GBSTORAGESTARLITBLUE4GBRAM",
    "MODELID": 361299,
    "Bajaj-MRP": 14999,
    "Bajaj-MOP": 14999,
    "HappiMOP": 15099,
    "FinalMOP": 14999,
    "sd": -100
  },
  {
    "APEX-ModelCode": "Y100A 8/256 Black",
    "APEX-MODELNAME": "Y100A 5G Vivo 8/256 - Metal Black",
    "SKUNAME": "VIVOY100A256GBSTORAGEMETALBLACK8GBRAM",
    "MODELID": 361036,
    "Bajaj-MRP": 25999,
    "Bajaj-MOP": 25999,
    "HappiMOP": 26099,
    "FinalMOP": 25999,
    "sd": -100
  },
  {
    "APEX-ModelCode": "Y100A 8/256 Gold",
    "APEX-MODELNAME": "Y100A 5G Vivo 8/256 - Twilight Gold",
    "SKUNAME": "VIVOY100A256GBSTORAGETWILIGHTGOLD8GBRAM",
    "MODELID": 361036,
    "Bajaj-MRP": 25999,
    "Bajaj-MOP": 25999,
    "HappiMOP": 26099,
    "FinalMOP": 25999,
    "sd": -100
  },
  {
    "APEX-ModelCode": "Y100A 8/256 Blue",
    "APEX-MODELNAME": "Y100A 5G Vivo 8/256 - Pacific Blue",
    "SKUNAME": "VIVOY100A256GBSTORAGEPACIFICBLUE8GBRAM",
    "MODELID": 361036,
    "Bajaj-MRP": 25999,
    "Bajaj-MOP": 25999,
    "HappiMOP": 26099,
    "FinalMOP": 25999,
    "sd": -100
  },
  {
    "APEX-ModelCode": "X90Pro 12/256 Black",
    "APEX-MODELNAME": "X90Pro 5G Vivo 12/256 - Legendary Black",
    "SKUNAME": "VIVOX90PRO256GBSTORAGELEGENDARYBLACK12GBRAM",
    "MODELID": 362512,
    "Bajaj-MRP": 84999,
    "Bajaj-MOP": 84999,
    "HappiMOP": 85099,
    "FinalMOP": 84999,
    "sd": -100
  },
  {
    "APEX-ModelCode": "Y100A 8/128 Gold",
    "APEX-MODELNAME": "Y100A 5G Vivo 8/128 - Twilight Gold",
    "SKUNAME": "VIVOY100A5G128GBSTORAGETWILIGHTGOLD8GBRAM",
    "MODELID": 365452,
    "Bajaj-MRP": 23999,
    "Bajaj-MOP": 23999,
    "HappiMOP": 24099,
    "FinalMOP": 23999,
    "sd": -100
  },
  {
    "APEX-ModelCode": "Y100A 8/128 Black",
    "APEX-MODELNAME": "Y100A 5G Vivo 8/128 - Metal Black",
    "SKUNAME": "VIVOY100A5G128GBSTORAGEMETALBLACK8GBRAM",
    "MODELID": 365452,
    "Bajaj-MRP": 23999,
    "Bajaj-MOP": 23999,
    "HappiMOP": 24099,
    "FinalMOP": 23999,
    "sd": -100
  },
  {
    "APEX-ModelCode": "Y100A 8/128 Blue",
    "APEX-MODELNAME": "Y100A 5G Vivo 8/128 - Pacific Blue",
    "SKUNAME": "VIVOY100A5G128GBSTORAGEPACIFICBLUE8GBRAM",
    "MODELID": 365452,
    "Bajaj-MRP": 23999,
    "Bajaj-MOP": 23999,
    "HappiMOP": 24099,
    "FinalMOP": 23999,
    "sd": -100
  },
  {
    "APEX-ModelCode": "11Pro+ 12/256 Beige",
    "APEX-MODELNAME": "Realme 11 Pro+ 5G 12/256 - Sunrise Beige",
    "SKUNAME": "REALME11PROPLUS5G256GBSTORAGESUNRISEBEIGE12GBRAM",
    "MODELID": 376904,
    "Bajaj-MRP": 29999,
    "Bajaj-MOP": 29999,
    "HappiMOP": 30099,
    "FinalMOP": 29999,
    "sd": -100
  },
  {
    "APEX-ModelCode": "11Pro+ 12/256 Green",
    "APEX-MODELNAME": "Realme 11 Pro+ 5G 12/256 - Oasis Green",
    "SKUNAME": "REALME11PROPLUS5G256GBSTORAGEOASISGREEN12GBRAM",
    "MODELID": 376903,
    "Bajaj-MRP": 29999,
    "Bajaj-MOP": 29999,
    "HappiMOP": 30099,
    "FinalMOP": 29999,
    "sd": ""
  },
  {
    "APEX-ModelCode": "A346EC Sliver",
    "APEX-MODELNAME": "A346EC Galaxy A34 5G (8/128) - Sliver",
    "SKUNAME": "SAMSUNGGALAXYA345G128GBSTORAGESILVER8GBRAM",
    "MODELID": 357263,
    "Bajaj-MRP": 31929,
    "Bajaj-MOP": 30999,
    "HappiMOP": 31099,
    "FinalMOP": 31929,
    "sd": ""
  },
  {
    "APEX-ModelCode": "A346EE Black",
    "APEX-MODELNAME": "A346EE Galaxy A34 5G (8/256) - Black",
    "SKUNAME": "SAMSUNGGALAXYA345G256GBSTORAGEBLACK8GBRAM",
    "MODELID": 357266,
    "Bajaj-MRP": 33989,
    "Bajaj-MOP": 32999,
    "HappiMOP": 33099,
    "FinalMOP": 33989,
    "sd": ""
  },
  {
    "APEX-ModelCode": "A546ED Graphite",
    "APEX-MODELNAME": "A546ED Galaxy A54 5G (8/256) - Graphite",
    "SKUNAME": "SAMSUNGGALAXYA545G256GBSTORAGEAWESOMEGRAPHITE8GBRAM",
    "MODELID": 357272,
    "Bajaj-MRP": 42229,
    "Bajaj-MOP": 40999,
    "HappiMOP": 41099,
    "FinalMOP": 42229,
    "sd": ""
  },
  {
    "APEX-ModelCode": "10R 80W 12/256�Black",
    "APEX-MODELNAME": "Oneplus 10R 5G 80W�12/256�- Seirra Black",
    "SKUNAME": "ONEPLUS10R5GCPH2423IN256GBSTORAGESIERRABLACK12GBRAM",
    "MODELID": 285258,
    "Bajaj-MRP": 35999,
    "Bajaj-MOP": 35999,
    "HappiMOP": 38999,
    "FinalMOP": 35999,
    "sd": ""
  }
]

async function testing() {
  var dataBase = await mongo.connect();
  var collectionclient = await dataBase.collection('Bajaj_Emi_ModelCodes');
  var productclient = await dataBase.collection('product');
  for (var i = 0; i < data.length; i++) {
    let response = await collectionclient.findOne({ "modelId": parseInt(data[i].MODELID) });
    if (response == null) {
    //   console.log("no data found", data[i].MODELID);
    }
    else {
      //console.log(data[i].apxItemCode);
      let productresponse = await productclient.findOne({"thirdPartyCodes.apxItemCode": data[i]['APEX-ModelCode'] });

      if(productresponse ==null){
        console.log("no  data found for this Apex code",data[i]['APEX-ModelCode'])

      }
      else{
        // console.log("productresponse---",productresponse.id);
        await productclient.findOneAndUpdate({"thirdPartyCodes.apxItemCode": data[i]['APEX-ModelCode'] },{$set:{"thirdPartyCodes.bajajModelCode":""}});
      }
    }
  }

}


testing();





