var axios = require('axios');
var md5 = require("md5");
const crypto = require('crypto');
const express = require('express');
var cors = require("cors");
const app = express();
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let requestdate = require('./requestTime.js');
var mongo = require("../db");
let encDecCode = require('./encReqres.js');


app.post('/api/billingotp', billingOtp);
async function billingOtp(req, res) {
    try {
        let body = req.body.data;
        console.log("body---", body);
        let request_date = await requestdate.generatedate();
        let db = await mongo.connect();
        let cartCollection = db.collection("cart");
        let decbilling = encDecCode.requestDecrypt(body);
        console.log("decbilling----", decbilling);
        console.log(decbilling.Delivery_PINCODE , decbilling.CARD_PINCODE,decbilling.Delivery_PINCODE != decbilling.CARD_PINCODE)

        if (decbilling.intercityDeliveryFlag == 'N') {
            if (decbilling.Delivery_PINCODE != decbilling.CARD_PINCODE) {
                return res.json({
                    status: false,
                    message: "Invalid Delivery Address, Please enter the delivery pin-code as registered with your Bajaj EMI Card"
                })
            }
        }
        else if (decbilling.intercityDeliveryFlag == 'Y') {
            if (decbilling.Delivery_PINCODE != decbilling.CARD_PINCODE) {
                return res.json({
                    status: false,
                    message: "Invalid Delivery Address, Please enter the delivery pin-code as registered with your Bajaj EMI Card"
                })
            }
        }
        let cartResponse = await cartCollection.findOne({ "cartId": decbilling.cartId });
        console.log("cartResponse----", cartResponse);
        if (cartResponse == null) {
            return res.json({
                status: false,
                message: 'Invalid CartId'
            })
        }


        let plaintext = {}

        plaintext.TXNTYPE = "OTPREQ",
            plaintext.RequestID = "OTP" + request_date,
            plaintext.Dealer_Validation_Key = "3796722280332777",
            plaintext.Dealer_Code = "858421",
            plaintext.Card_Number = decbilling.Card_Number,
            plaintext.ORDERNO = "ORD" + request_date,
            plaintext.Product = cartResponse.schema.productCode,
            plaintext.Advance_EMI_AMT = cartResponse.schema.advEmiAmt,
            plaintext.Advance_EMI_Tenure = cartResponse.schema.advEmi,
            plaintext.GROSS_LOAN_AMT = decbilling.payPrice,//based product price
            plaintext.Gross_LOAN_Tenure = cartResponse.schema.tenor,
            plaintext.Delivery_PINCODE = decbilling.Delivery_PINCODE,
            plaintext.ACQCHANNEL = "22",
            plaintext.Request_Date_Time = request_date
        console.log("plaintext==================", plaintext);
        const ENCRYPTION_KEY = 'AUE7N2BPS3150323112711QV7W6DNPAZ';
        const IV_LENGTH = 16;
        let iv = '1234567887654321';
        iv = new Buffer(iv, "binary");
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(JSON.stringify(plaintext));
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        var enc = encrypted.toString('base64');
        var seal = md5(enc + ENCRYPTION_KEY);
        console.log("seal----", seal);
        console.log("encrypted----", enc);
        var billingcustomer_config = {
            'method': 'POST',
            'url': 'https://bfl2.in.worldline.com/worldlineinterfaceexperia/WorldlineInterfaceExperia.svc/BILINTRequest',
            'headers': {
                'SealValue': seal,
                "SUPPLIERID": "858421",
                'Content-Type': 'application/json',
                "disabled": true
            },
            data: JSON.stringify(enc)
        };
        console.log(billingcustomer_config);
        let billingdata = await axios(billingcustomer_config);
        console.log("================================== Response ================================== ")
        console.log(billingdata.data);
        let dataarr = billingdata.data.split('|')
        let billingResponse = billingDecrypt(billingdata.data);
        billingResponse.ORDERNO = plaintext.ORDERNO
        console.log("billingResponse--", billingResponse);
        billingResponse = encDecCode.requestEncrypt(billingResponse)
        return res.json({
            status: true,
            data: billingResponse
        })
    }
    catch (error) {
        console.log(error);
        return res.json({
            status: false,
            message: error
        })
    }

}


function billingDecrypt(key) {

    console.log("----------------", key);

    const ENCRYPTION_KEY = 'AUE7N2BPS3150323112711QV7W6DNPAZ';
    let iv = '1234567887654321';
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    var receivedPlaintext = decipher.update(key, 'base64', null, 'utf8');
    console.log("receivedPlaintext", receivedPlaintext);

    try {
        receivedPlaintext += decipher.final();
        let decrypt_response = JSON.parse(receivedPlaintext)
        return decrypt_response;
    } catch (err) {
        console.log(err);
        //    console.error('Authentication failed!', err);
        return 'Authentication failed!';
    }

}

//billingOtp();
module.exports = app;