var axios = require('axios');
var md5 = require("md5");
const crypto = require('crypto');
const express = require('express');
var cors = require("cors");
let fs = require('fs');
var mongo = require("../db");
let tokenApi = require('../bajaj-emi/tokengenerationapi');
var email = require("../modules/email.js");
const app = express();
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/assestvalidation', AssestValidation);
async function AssestValidation(req, res) {
    try {
        if (req.body.order_id == null) {
            return res.json({
                status: false,
                message: "No order_id"
            })
        }
        var dataBase = await mongo.connect();
        var ordercollectionclient = await dataBase.collection('orders-v3');
        let orderresponse = await ordercollectionclient.findOne({ "order_id": req.body.order_id });

        let AssestValidationReq = {
            "uniqueID": orderresponse?.Opp_Name,
            "manufacturerID": orderresponse?.schema?.manufactureId,
            "modelCode": orderresponse?.payment_info?.cart.items[0].thirdPartyCodes.bajajModelCode,
            "imeiNo": req.body.imeiNo,
            "dealerCode": "858421",
            "financeAmount": orderresponse?.LOANAMT_GROSS
        }

        console.log("AssestValidationReq--", AssestValidationReq);
        // let Assestconfig = {
        //     method: 'POST',
        //     url: 'https://prodapitm.bajajfinserv.in/AssetValidation/api/Serial_Validation/DigitalValidation',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Ocp-Apim-Subscription-Key': '2677f743397f4fa6be903bd81a18bfbc',
        //         'Authorization': `Bearer ${access_token}`
        //     },
        //     data: JSON.stringify(AssestValidationReq)
        // };
        // let AssetValidationResponse = await axios(Assestconfig);
        // console.log("AssetValidationResponse",AssetValidationResponse);
        await ordercollectionclient.findOneAndUpdate({"order_id":req.body.order_id},{$set:{"IMEI_Serial_Number":req.body.imeiNo}});
        await email.send_mail(
           // ["nidhi.pandit@bajajfinserv.in","sonam.soni@bajajfinserv.in","sharan@happimobiles.com","help@happimobiles.com","online@happimobiles.com","mahendra.rathore@bajajfinserv.in","jfm@happimobiles.com"],
           ["nidhi.pandit@bajajfinserv.in","help@happimobiles.com","online@happimobiles.com"],
            
            "Assest Validation " + new Date().toISOString(),
            `Assest validation " + ${new Date().toISOString()}
             order_id : ${req.body.order_id}
             imeiNo : ${req.body.imeiNo}
             Opp_Name:${orderresponse?.Opp_Name}
             LOANAMT_GROSS:${orderresponse?.LOANAMT_GROSS}
             AuthId:${orderresponse?.AuthId}
             DEALID:${orderresponse?.DEALID}
             downpayment:${orderresponse?.downpayment}
             processingFee:${orderresponse?.processingFee}
             ProductName:${orderresponse?.payment_info?.cart.items[0].name}
             BajajCustomerName:${orderresponse?.BajajCustomerName}
            `,
            []
          );
        return res.json({
            status:true,
            message:'Assest validation Api trigger successfully',
            "NonDigitalValidationResult":"Success"
        })

    }
    catch (error) {
        console.log("error--", error);
        return res.json({
            status: false,
            message: "Assest Validation Api"
        })
    }

}

module.exports = app