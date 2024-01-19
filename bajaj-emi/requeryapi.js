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
let requestdate=require('./requestTime.js');
var mongo = require("../db");
var OTP_SECRET = process.env.OTP_SECRET || 'ETTRTFGFCFSCGJLKLLUIOYUITTFFGCFZXEAWRRTTIUIGHFERHAPPI2022IIPL';


let reqres = require('./encReqres');


async function RequeryApi() {

    let request_date = await requestdate.generatedate();
    // let requiryplaintext = {
    //     DEALERID: '858421',
    //     REQID: 'REQ'+request_date,
    //     VALKEY: '3796722280332777',
    //     REQUERYID: AUTHREQUERYID,
    //     ACQCHNLID: '22'
    // }

    let requiryplaintext= {
        DEALERID: '858421',
        REQID: 'REQ05042023160645',
        VALKEY: '3796722280332777',
        REQUERYID: 'AUTH05042023160644',
        ACQCHANNEL: '22'
      }

  

    console.log("plaintext---------", requiryplaintext);


   
    const ENCRYPTION_KEY = 'AUE7N2BPS3150323112711QV7W6DNPAZ';
    
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

    let requeryReqdata=JSON.stringify(enc)

    
    var config = {
      method: 'post',
      url: 'https://bfl2.in.worldline.com/WorldlineInterfaceEnqRequery/WorldlineInterfaceEnhanceRequery.svc/ENQRequest',
      headers: { 
        'SealValue': seal, 
        'Content-Type': 'application/json'
        
      },
      data : requeryReqdata
    };
    

    let requeryResponse= await axios(config);
   
    let data2 = requeryResponse.data.split('|');
    console.log("data--------------",data2);
    let requeryDecryptresponse = requeryDecrypt(data2[0]);
    console.log("requeryDecrypt", requeryDecryptresponse);
    return requeryDecryptresponse;
   
    
    

}




function requeryDecrypt(key) {

    console.log("----------------", key);

    const ENCRYPTION_KEY = 'AUE7N2BPS3150323112711QV7W6DNPAZ';
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

RequeryApi()