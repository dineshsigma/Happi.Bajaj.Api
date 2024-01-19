

var axios = require('axios');
var md5 = require("md5");
const crypto = require('crypto');
const express = require('express');
var cors = require("cors");
var mongo = require("../db");
const app = express();
app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/cart/bajajcart', bajajproductcart);



async function bajajproductcart(req, res) {
    console.log("response.................", req.body.cartId)
    try {
        let db = await mongo.connect();
        let cartCollection = db.collection("cart");
        let cartId = req.body.cartId;
        if (cartId == null) {
            return;
        }
        let cartresponse = await cartCollection.findOne({ "cartId": cartId });
        console.log("cartresponse",cartresponse)
        if (cartresponse == null) {
            return;
        }
        console.log(cartresponse);
        let cart_items = []

        await cartCollection.updateOne({ cartId: cartId }, { $set: { items: cart_items } });
        return res.json({
            message: 'product removed success please check the products'
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

module.exports=app;