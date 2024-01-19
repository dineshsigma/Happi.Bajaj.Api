var axios = require('axios');
var md5 = require("md5");
const crypto = require('crypto');
const express = require('express');
var cors = require("cors");
let tokenApi=require('../bajaj-emi/tokengenerationapi');
const app = express();
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/submitQc',submitQc);
async function submitQc(req,res){
    let access_token = await tokenApi.tokenApi();
    console.log("access_token---",access_token);
    let  submitQCReq= req.body;
    try{
        let submitConfig = {
            method: 'patch',
            url: 'https://prodapitm.bajajfinserv.in/POSSubmitForQCWS/SubmitForQC',
            headers: { 
              'Content-Type': 'application/json', 
              'Ocp-Apim-Subscription-Key': '2677f743397f4fa6be903bd81a18bfbc', 
              'Authorization': `Bearer ${access_token}`
            },
            data : JSON.stringify(submitQCReq)
          };

          let submitQCResponse = await axios(submitConfig);
          return res.json({
              status:true,
              message:"Submit Qc is trigger is successfully",
              data:submitQCResponse
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

