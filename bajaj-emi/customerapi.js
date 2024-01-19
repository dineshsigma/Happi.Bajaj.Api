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

let encDecCode = require('./encReqres.js');
let requestdate = require('./requestTime.js');
app.post('/api/customer', customerSearchApi);
async function customerSearchApi(req, res) {
    // console.log("req.body---",req);
    try {
        let request_date = await requestdate.generatedate();
        let customerdata=req.body.Card_number;
        let decCodeCardnumber=encDecCode.requestDecrypt(customerdata);
        let plaintext = {}
            plaintext.TXNTYPE = "BILSRCH",
            plaintext.Request_ID = "CUST" + request_date,
            plaintext.Dealer_Code = "858421",
            plaintext.Request_Date_Time = request_date,
            plaintext.Dealer_Validation_Key = "3796722280332777",
            plaintext.Card_number = decCodeCardnumber
            plaintext.ACQCHANNEL = 22

        console.log(plaintext)
        const ENCRYPTION_KEY = 'AUE7N2BPS3150323112711QV7W6DNPAZ';
        const IV_LENGTH = 16;
        let iv = '1234567887654321';
        iv = new Buffer(iv, "binary");
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(JSON.stringify(plaintext));
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        var enc = encrypted.toString('base64');
        var seal = md5(enc + ENCRYPTION_KEY);
        console.log("seal", seal);
        console.log("encrypted", enc);
        var data = JSON.stringify(enc);
        var customer_config = {
            method: 'post',
            // url: 'https://bfluat.in.worldline-solutions.com/worldlineinterfaceexperia/WorldlineInterfaceExperia.svc/BILINTRequest',
            // url: 'https://bfl2.in.worldline.com/worldlineinterfaceexperia/WorldlineInterfaceExperia.svc/BILINTRequest',
            url: 'https://bfl2.in.worldline.com/worldlineinterfaceexperia/WorldlineInterfaceExperia.svc/BILINTRequest',
            headers: {
                'SealValue': seal,
                'SUPPLIERID': '858421',
                'disabled': 'true',
                'Content-Type': 'application/json',

            },
            data: data
        };
        let customerresponse = await axios(customer_config);
        let customerdecrypt = decrypt(customerresponse.data);
         console.log("customerdecrypt----", customerdecrypt);
         customerdecrypt= encDecCode.requestEncrypt(customerdecrypt)
         return res.json({
            status: true,
            response: customerdecrypt
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

function decrypt(key) {

    const ENCRYPTION_KEY = 'AUE7N2BPS3150323112711QV7W6DNPAZ';
    let iv = '1234567887654321';
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    var receivedPlaintext = decipher.update(key, 'base64', null, 'utf8');

    try {
        receivedPlaintext += decipher.final();
        let decrypt_response = JSON.parse(receivedPlaintext)
        return decrypt_response;
    } catch (err) {
        //    console.error('Authentication failed!', err);
        return 'Authentication failed!';
    }

}

module.exports = app;