var axios = require('axios');
var md5 = require("md5");
const crypto = require('crypto');
const express = require('express');
var cors = require("cors");
var mongo = require("../db");
let tokenApi = require('../bajaj-emi/tokengenerationapi');
const app = express();
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/RCUcheck', RCUCheck);
async function RCUCheck(req, res) {
    let access_token = await tokenApi.tokenApi();
    console.log("access_token---", access_token);
    if (req.body.order_id == null) {
        return res.json({
            status: false,
            message: "No order_id"
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
    let RCUCHECKreq = {
        "Mobile_Number": orderresponse.userInfo.phone,
        "ATOS_Deal_Id": orderresponse.DEALID,
        "Type": "ISD_ETB"
    }
    let RCUBody = JSON.stringify(RCUCHECKreq);

    console.log("RCUBody", RCUBody);
    console.log("access_token", access_token);
    try {
        let RCUCheckconfig = {
            method: 'POST',
            //https://prodapitm.bajajfinserv.in/POSGetAssetValidationDetailsWS/GetAssetvallidationDetails
            url: 'https://prodapitm.bajajfinserv.in/POSGetAssetValidationDetailsWS/GetAssetvallidationDetails',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': '2677f743397f4fa6be903bd81a18bfbc',
                'Authorization': `Bearer ${access_token}`
            },
            data: RCUBody
        };

        // console.log("RCUCheckconfig----", RCUCheckconfig);

        let RCUCkeckResponse = await axios(RCUCheckconfig);
        console.log("RCUCkeckResponse---", RCUCkeckResponse.data);
        await ordercollectionclient.findOneAndUpdate({ "order_id": req.body.order_id }, { $set: { "Opp_Name": RCUCkeckResponse?.data?.Opp_Name } })
        return res.json({
            status: true,
            message: 'RCU CHECK API TRIGGER SUCCESSFULLY',
            data: RCUCkeckResponse.data
        })

    }
    catch (error) {
        console.log("error---", error);
        return res.json({
            status: false,
            message: error
        })
    }

}

module.exports = app;





