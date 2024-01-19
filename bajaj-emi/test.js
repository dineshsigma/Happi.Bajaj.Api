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
const { Parser } = require('json2csv');
var OTP_SECRET = process.env.OTP_SECRET || 'ETTRTFGFCFSCGJLKLLUIOYUITTFFGCFZXEAWRRTTIUIGHFERHAPPI2022IIPL';

app.get('/download/thirdPartyCodes',downloadThirdpartyCodes);


async function downloadThirdpartyCodes(req,res){
    try{
        var dataBase = await mongo.connect();
        var collectionclient = await dataBase.collection('product');
        let data=await collectionclient.find({}, {
            projection: { "id": 1, "name": 1, "thirdPartyCodes.apxItemCode": 1,"thirdPartyCodes.bajajModelCode":1,"thirdPartyCodes.asinCode":1,"thirdPartyCodes.pinelabsProductCode":1,"thirdPartyCodes.ingramPartNumber":1, }
        }).toArray();
        data = data.map(function (e) {

            return {
                id: e.id,
                name: e.name,
              
                apx: e.thirdPartyCodes.apxItemCode || "",
                bajajModelCode: e.thirdPartyCodes.bajajModelCode ||"",
                asinCode: e.thirdPartyCodes.asinCode || "",
                pinelabsProductCode: e.thirdPartyCodes.pinelabsProductCode || "",
                ingramPartNumber: e.thirdPartyCodes.ingramPartNumber || ""
 
            }

            
        })

        if (data.length > 0) {
            const fields = data[0].keys;
            const opts = { fields };
            try {
                const parser = new Parser(opts);
                const csv = parser.parse(data);


                res.setHeader('Content-disposition', 'attachment; filename=data.csv');
                res.set('Content-Type', 'text/csv');
                res.status(200).send(csv);


            }
            catch (error) {
                console.log(error);
                res.json({
                    status: false,
                    message: error.message
                });
            }
        }
        else {
            res.send('no data found')
        }
    }
    catch(error){
        return res.json({
            status:false,
            message:error
        })
    }
}

module.exports=app;


