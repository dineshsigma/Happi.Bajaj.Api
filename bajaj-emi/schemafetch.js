var axios = require('axios');
var md5 = require("md5");
const crypto = require('crypto');
const express = require('express');
var cors = require("cors");
var mongo = require("../db.js");
const app = express();
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let tokenApi=require('./tokengenerationapi.js');
let encDecCode = require('./encReqres.js');
app.post('/api/schema',schemafetchApi);

async function schemafetchApi(req,res) {
    console.log("req.body----",req.body.data);
    let db = await mongo.connect();
    let bajajModelTbl = db.collection("Bajaj_Emi_ModelCodes");
    let schemaData=encDecCode.requestDecrypt(req.body.data);
    console.log("decCodeschemaRes--",schemaData);
    let bajajModelResponse = await bajajModelTbl.findOne({"modelId":parseInt(schemaData.bajaj_model_code)});
    console.log("bajajModelResponse----",bajajModelResponse);
    let MaxRetailprice =parseInt(bajajModelResponse.MaxRetailPrice);
    let MinRetailprice =parseInt(bajajModelResponse.MinRetailPrice);
    let payPrice =schemaData.payPrice
    console.log(payPrice >= MinRetailprice) //need to discess max and min
    // if(payPrice <= MinRetailprice){
    //     return res.json({
    //         status:false,
    //         message:'Product price is not between MaxRetail and MinRetail '
    //     })

    // }
   
    let schemaReq={
            "dealerId": "0011t00001KSyujAAD",
            "modelId": bajajModelResponse.MasterUniqueKey,
            "loanAmt": schemaData.payPrice,
            "invoiceAmt": schemaData.payPrice,
            "schemeType": null,
            "dealerCode": "",
            "model": "",
            "cdLtv": schemaData.CD_PROMO.split('%')[0],
            "digitalLtv": schemaData.DIGITAL_PROMO.split('%')[0],
            "lsfLtv": "100",
            "mshLtv": "100",
            "lcfLtv": "100",
            "channel": "Website"
          
    }

    console.log("schemaReq",schemaReq);
    
    try {
        let access_token = await tokenApi.tokenApi();
        console.log("access_token---",access_token);
        var schema_config = {
            method: 'POST',
            url: 'https://prodapitm.bajajfinserv.in/POSReinventDealerWS/TopSchemeLogic',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': '2677f743397f4fa6be903bd81a18bfbc',
                'Authorization': `Bearer ${access_token}`


            },
            data: JSON.stringify(schemaReq)
        };

        let schemaresponse = await axios(schema_config);
       // console.log("schemaresponse---",schemaresponse.data.result);
        let sortSchemaResponse = schemaresponse.data.result.records.sort((a,b)=>{ return a.downPayment - b.downPayment })
        console.log("sortSchemaResponse",sortSchemaResponse);
        schemaresponse= encDecCode.requestEncrypt(sortSchemaResponse)
        return res.json({
            status:true,
            data:schemaresponse
        })
    }
    catch (error) {
        console.log("error",error);
        return res.json({
            status:false,
            message: error
        })
    }

}

module.exports=app;