const express = require('express');
var cors = require("cors");
var mongo = require("../db");
const app = express();
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/bajajorders',bajajOrders);
async function bajajOrders(req,res){
    try{
        var dataBase = await mongo.connect();
        var orderv3Tb = await dataBase.collection('orders-v3');
        let bajajOrdersResponse;
        let query={}
        console.log("req",req.query);
        if(req.query.bajajstatus!='null' && req.query.bajajstatus!=undefined && req.query.bajajstatus!=""){
            query={
                "type":"bajaj",
                "bajajstatus":req.query.bajajstatus
            }
        }
        else{
            query={
                "type":"bajaj"
            }

        }
         bajajOrdersResponse = await orderv3Tb.find(query,
        {projection:{
            "cartId":1,
            "type":1,
            "datecreated":1,
            "order_id":1,
            "downpayment":1,
            "processingFee":1,
            "userInfo.name":1,
            "userInfo.phone":1,
            "DEALID":1,
            "payment_info.cart.items":1,
            "AuthId":1,
            "bajajstatus":1
        }}).toArray();
        bajajOrdersResponse = bajajOrdersResponse.map(function (e) {
            return {
                order_id: e.order_id,
                type:e.type,
                createdDate:e.datecreated,
                cartId:e.cartId,
                downpayment:e.downpayment,
                processingFee:e.processingFee,
                customerName:e.userInfo.name,
                Mobile:e.userInfo.phone,
                DEALID:e.DEALID,
                AUTHID:e.AuthId,
                bajajstatus:e.bajajstatus || "open",
                ProductName:e.payment_info?.cart?.items[0]?.name,
                ProductImage:e.payment_info?.cart?.items[0]?.image_url
            }
        })
        return res.json({
            status:true,
            data:bajajOrdersResponse
        })
    }
    catch(error){
        console.log("error--",error);
        return res.json({
            status:false,
            message:error
        })
    }
}
module.exports =app;



