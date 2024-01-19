var axios = require('axios');
var md5 = require("md5");
const crypto = require('crypto');
const express = require('express');
var cors = require("cors");
let multer = require('multer');
var mongo = require("../db");
let tokenApi=require('../bajaj-emi/tokengenerationapi');
const pdf2base64 = require('pdf-to-base64');
let fs= require('fs')
const app = express();
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/uploadQc',uploadQc);
async function uploadQc(req,res){
  let body= req.body;
   let access_token = await tokenApi.tokenApi();
    try{
      if(req.body.order_id == null){
        return res.json({
            status:false,
            message:"No order_id"
        })
    }
    var dataBase = await mongo.connect();
    var ordercollectionclient = await dataBase.collection('orders-v3');
    let orderresponse = await ordercollectionclient.findOne({ "order_id": req.body.order_id });
    if (orderresponse == null) {
        return res.json({
            status: false,
            message: "Invalid order_id"
        })
    }
      let pdfBase64Response =  await pdf2base64(body.pdfurl);
      
      let data = JSON.stringify([
        {
          "id": "string",
          "files": [
            {
              "name": req.body.name,
              "fileType": "files.pdf",
              "body": pdfBase64Response,
              "docType": "Invoice"
            }
          ],
          "opportunityName":orderresponse.IMEI_Serial_Number,
          "invoiceNumber": req.body.invoiceNumber,
          "invoiceDate": req.body.invoiceDate
        }
      ]);
      let uploadDocumentconfig = {
        method: 'POST',
        url: 'https://prodapitm.bajajfinserv.in/POSISDDocsUploadWS/SubmitDocument',
        headers: { 
          'Content-Type': 'application/json', 
          'Ocp-Apim-Subscription-Key': '2677f743397f4fa6be903bd81a18bfbc', 
          'Authorization': `Bearer ${access_token}`
        },
        data : data
      };
      let uploadDocumentResponse = await axios(uploadDocumentconfig);
      console.log("RCUCkeckResponse---",uploadDocumentResponse.data);
      return res.json({
        status:true,
        message:"Upload document successfully",
        data:uploadDocumentResponse.data
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

