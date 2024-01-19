var axios = require('axios');
var md5 = require("md5");
const crypto = require('crypto');
const express = require('express');
var cors = require("cors");
const res = require('express/lib/response');
const app = express();
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let requestdate = require('./requestTime.js');
var mongo = require("../db");
var OTP_SECRET = process.env.OTP_SECRET || 'ETTRTFGFCFSCGJLKLLUIOYUITTFFGCFZXEAWRRTTIUIGHFERHAPPI2022IIPL';

let encDecCode = require('./encReqres.js');



app.post('/api/authapi', authApi);

async function authApi(req, res) {
    let body = req.body.data;
    console.log("req.body----", req.body.data);
    try {
        let request_date = await requestdate.generatedate();
        let decauthRes = encDecCode.requestDecrypt(body);
        let plaintextbody = decauthRes;
        if (plaintextbody.cartId == null) {
            return res.json({
                status: false,
                message: 'no cartId'
            });
        }
        var dataBase = await mongo.connect();
        var collectionclient = await dataBase.collection('cart');
        let cartresponse = await collectionclient.findOne({ "cartId": plaintextbody.cartId });
        if (cartresponse == null) {
            return res.json({
                status: false,
                message: "Invalid CartID"
            })
        }

        let plaintext = {}
        plaintext.TXNTYPE = "AUTREQ",
            plaintext.REQUESTID = "AUTH" + request_date,
            plaintext.Request_Date_Time = request_date,
            plaintext.DLRVKEY = "3796722280332777",
            plaintext.DEALER_CODE = "858421",
            plaintext.CARD_NUMBER = plaintextbody.CARD_NUMBER,
            plaintext.ORDERNO = plaintextbody.ORDERNO,
            plaintext.MOBILE_NUMBER = ""
        plaintext.ADVANCE_EMI_AMT = cartresponse.schema.advEmiAmt,
            plaintext.ADVANCE_EMI_TENURE = cartresponse.schema.advEmi,
            plaintext.GROSS_LOAN_AMT = plaintextbody.payPrice,
            plaintext.GROSS_LOAN_TENURE = cartresponse.schema.tenor,
            plaintext.INVOICEAMOUNT = plaintextbody.payPrice,
            plaintext.MODELID = plaintextbody.modelId,
            plaintext.OTP = plaintextbody.OTP,
            plaintext.ACQCHANNEL = "22",
            plaintext.MANUFACTURERID = cartresponse.schema.manufactureId,
            plaintext.ASSETID = "30",
            plaintext.SCHEMID = cartresponse.schema.schemeType,
            plaintext.PROCESSINGFEE = cartresponse.schema.processingFee,
            plaintext.PRODUCT = cartresponse.schema.productCode,
            plaintext.MAC_ID = "",
            plaintext.IP_ADDRESS = "10.10.10.10",
            plaintext.LATITUDE = "23.34535",
            plaintext.LONGITUDE = "23.34535",
            plaintext.DELIVERY_ADDRESS = plaintextbody.DELIVERY_ADDRESS,
            plaintext.DELIVERY_PINCODE = plaintextbody.DELIVERY_PINCODE



        console.log("AUTH REQUEST--------------", plaintext);





        const ENCRYPTION_KEY = 'AUE7N2BPS3150323112711QV7W6DNPAZ';
        const IV_LENGTH = 16;
        let iv = '1234567887654321';
        iv = new Buffer(iv, "binary");
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(JSON.stringify(plaintext));
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        var enc = encrypted.toString('base64');
        var seal = md5(enc + ENCRYPTION_KEY);
        // console.log("seal----",seal);
        // console.log("encrypted----",enc);
        var auth_customer_config = {
            'method': 'POST',
            //url:'https://bfluat.in.worldline-solutions.com/worldlineinterfaceexperia/WorldlineInterfaceExperia.svc/BILINTRequest',
            'url': 'https://bfl2.in.worldline.com/worldlineinterfaceexperia/WorldlineInterfaceExperia.svc/BILINTRequest',
            'headers': {
                'SealValue': seal,
                "SUPPLIERID": "858421",
                'Content-Type': 'application/json',
                "disabled": true
            },
            data: JSON.stringify(enc)

        };


        try {
            let authresData = await axios(auth_customer_config);

            console.log("================================== Response ================================== ")
            // console.log(authresData.data);
            let data = authresData.data.split('|');
            // console.log("AUTH ENCRYPTED RESPONSE PACKET------------",data);
            let billingResponse = await billingDecrypt(data[0]);
            console.log("AUTH SUCCESS RESPONSE--------------", billingResponse);
            if (billingResponse.RESPONSE_DESCRIPTION == 'Success') {
                console.log("88888", billingResponse.REQUEST_ID);
                let requeryApi = await RequeryApi(plaintext.REQUESTID);
                console.log("finalresult---", requeryApi);
                var setObj = {};
                if (requeryApi.ERRDESC == 'SUCCESS') {
                    let downpayment = parseInt(requeryApi.ENQINFO[0].DOWNPAYMENT);
                    let processingFee = parseInt(requeryApi.ENQINFO[0].PROCESSINGFEE);
                    let LOANAMT_GROSS = parseInt(requeryApi.ENQINFO[0].LOANAMT_GROSS);
                    if ((parseInt(cartresponse.schema.advEmiAmt) + processingFee + parseInt(cartresponse?.schema?.charges?.split(";")[3]?.split(':')[1])) > 0) {
                        setObj.bajajLoanCreated = true;
                        setObj.amountPending =(parseInt(cartresponse.schema.advEmiAmt) + processingFee + parseInt(cartresponse?.schema?.charges?.split(";")[3]?.split(':')[1]))
                        setObj.type = "bajaj";
                        setObj.downpayment =downpayment;
                        setObj.processingFee=processingFee;
                        setObj.DEALID=requeryApi.ENQINFO[0].DEALID;
                        setObj.LOANAMT_GROSS=LOANAMT_GROSS;
                        setObj.AuthId=requeryApi.ENQINFO[0].REQUEST_ID;
                        setObj.BajajCustomerName= requeryApi.ENQINFO[0].CUSTOMER_NAME;
                        setObj.bajajstatus="open";
                        setObj.advEmiAmt=parseInt(cartresponse.schema.advEmiAmt);
                        setObj.additionalCharges= parseInt(cartresponse?.schema?.charges?.split(";")[3]?.split(':')[1])
                    }
                    else{
                        setObj.type = "bajaj";
                        setObj.downpayment =downpayment;
                        setObj.processingFee=processingFee;
                        setObj.DEALID=requeryApi.ENQINFO[0].DEALID;
                        setObj.LOANAMT_GROSS=LOANAMT_GROSS;
                        setObj.AuthId=requeryApi.ENQINFO[0].REQUEST_ID;
                        setObj.BajajCustomerName= requeryApi.ENQINFO[0].CUSTOMER_NAME;
                        setObj.bajajstatus="open";
                        setObj.advEmiAmt=parseInt(cartresponse.schema.advEmiAmt);
                        setObj.additionalCharges= parseInt(cartresponse?.schema?.charges?.split(";")[3]?.split(':')[1])

                    }
                    await collectionclient.findOneAndUpdate({ "cartId": plaintextbody.cartId },
                        {
                            $set: setObj
                        })

                    let latestcartResponse = await collectionclient.findOne({ "cartId": plaintextbody.cartId });
                    console.log("latestcartResponse--", latestcartResponse);
                    //    requeryApi= encDecCode.requestEncrypt(requeryApi)

                    return res.json({
                        status: true,
                        message: "Auth Api is working.....",
                        // finalresult:requeryApi
                    })

                }
                else {
                    return res.json({
                        status: false,
                        message: 'Please Contact Bajaj Customer Care'
                    })
                }

            }
            else {
                return res.json({
                    status: false,
                    message: 'Transaction not allowed, Kindly contact Bajaj customer service'
                })
            }
        }
        catch (error) {
            console.log(error);
            return res.json({
                status: false,
                message: error
            })
        }


    }
    catch (error) {
        console.log(error);
        return res.json({
            message: error
        })
    }

}

async function billingDecrypt(key) {

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



//requery api--



async function RequeryApi(AUTHREQUERYID) {

    let request_date = await requestdate.generatedate();
    let requiryplaintext = {
        DEALERID: '858421',
        REQID: 'Req' + request_date,
        VALKEY: '3796722280332777',
        REQUERYID: AUTHREQUERYID,
        ACQCHNLID: '22'
    }


    console.log("plaintext---------", requiryplaintext);
    const ENCRYPTION_KEY = 'sOnfGB3atf4UYZggYGQQjzCrZ9XeUgNn';

    const IV_LENGTH = 16;
    let iv = '1234567887654321';
    iv = new Buffer(iv, "binary");
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(JSON.stringify(requiryplaintext));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    var enc = encrypted.toString('base64');
    var seal = md5(enc + ENCRYPTION_KEY);
    console.log("seal----", seal);
    console.log("encrypted----", enc);

    let requeryReqdata = JSON.stringify(enc)


    var requeryconfig = {
        method: 'POST',
        url: 'https://bfl2.in.worldline.com/WorldlineInterfaceEnqRequery/WorldlineInterfaceEnhanceRequery.svc/ENQRequest',
        headers: {
            'SealValue': seal,
            'Content-Type': 'application/json'
        },
        data: requeryReqdata
    };


    let requeryResponse = await axios(requeryconfig);
    let data2 = requeryResponse.data.split('|');
    console.log("data--------------", data2);
    let requeryDecryptresponse = requeryDecrypt(data2[0]);
    console.log("requeryDecrypt", requeryDecryptresponse);
    return requeryDecryptresponse;




}
function requeryDecrypt(key) {

    console.log("----------------", key);

    const ENCRYPTION_KEY = 'sOnfGB3atf4UYZggYGQQjzCrZ9XeUgNn';
    let iv = '1234567887654321';
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    var receivedPlaintext = decipher.update(key, 'base64', null, 'utf8');
    console.log("receivedPlaintext", receivedPlaintext);

    try {
        receivedPlaintext += decipher.final();
        let requerydecrypt_response = JSON.parse(receivedPlaintext)
        return requerydecrypt_response;
    } catch (err) {
        console.log(err);
        //    console.error('Authentication failed!', err);
        return 'Authentication failed!';
    }

}

module.exports = app;


