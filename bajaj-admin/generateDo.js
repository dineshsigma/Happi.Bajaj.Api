var axios = require('axios');
var md5 = require("md5");
const crypto = require('crypto');
const express = require('express');
var cors = require("cors");
var mongo = require("../db");
let tokenApi=require('../bajaj-emi/tokengenerationapi');
const app = express();
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/generateDo',generateDo);
async function generateDo(req,res){
    let access_token = await tokenApi.tokenApi();
    console.log("access_token---",access_token);
    if(req.body.order_id == null){
        return res.json({
            status:false,
            message:"No order_id"
        })
    }
    var dataBase = await mongo.connect();
    var collectionclient = await dataBase.collection('orders-v3');
    let orderresponse = await collectionclient.findOne({ "order_id": req.body.order_id });
    if (orderresponse == null) {
        return res.json({
            status: false,
            message: "Invalid order_id"
        })
    }

    let generateDoReq= {
            "IMEI_Serial_Number": orderresponse.IMEI_Serial_Number,
            "ATOS_Deal_Id": orderresponse.DEALID,
            "Extended_Warranty": "",
            "Manufacturer_Warranty": "",
            "Product_Type": "DIGITAL",
            "Voucher_cashback": ""
    };

    generateDoReq=JSON.stringify(generateDoReq)

    try{
        let generateDoconfig = {
            method: 'POST',
            url: 'https://prodapitm.bajajfinserv.in/POSGenerateDOWS/GenerateDO',
            headers: { 
              'Content-Type': 'application/json', 
              'Ocp-Apim-Subscription-Key': '2677f743397f4fa6be903bd81a18bfbc', 
              'Authorization': `Bearer ${access_token}`
            },
            data :generateDoReq
          };

          let generateDoResponse = await axios(generateDoconfig);
          console.log("generateDoResponse---",generateDoResponse.data);
          await ordercollectionclient.findOneAndUpdate({"order_id":req.body.order_id},{$set:{"OpportunityId":generateDoResponse?.data?.OpportunityId}})
          return res.json({
              status:true,
              message:"Generate Do api Success",
              data:generateDoResponse.data
             
          })
          

    }
    catch(error){
        console.log("error---",error);
        return res.json({
            status:false,
            message:error
        })
    }
}
module.exports = app;

