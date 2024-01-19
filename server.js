let express=require('express');
let cors=require('cors');
let app=express();
let port=8001;
let bajajcustomer=require('./bajaj-emi/customerapi');
let bajajschema=require('./bajaj-emi/schemafetch.js');
let billingotp=require('./bajaj-emi/billingotp');
let authapi=require('./bajaj-emi/auth');
let download = require('./bajaj-emi/test.js');
let cart = require('./bajaj-emi/cart.js');
let RCUCheck = require('./bajaj-admin/RCUCheck.js');
let generateDo = require('./bajaj-admin/generateDo.js');
let submitQc = require('./bajaj-admin/submitQc.js');
let uploadQc = require('./bajaj-admin/uploadQc.js');
let bajajOrders = require('./bajaj-admin/bajajorder.js');
let assestvalidation = require('./bajaj-admin/assestvalidation.js');
app.options('*', cors()); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.get('/test',(req, res)=>{
    res.send("OK--")
})
app.use('/',bajajcustomer);
app.use('/',billingotp);
app.use('/',authapi);
app.use('/',bajajschema);
app.use('/',download);
app.use('/',cart);

//admin

app.use('/api/admin',RCUCheck);
app.use('/api/admin',generateDo);
app.use('/api/admin',submitQc);
app.use('/api/admin',uploadQc);
app.use('/api/admin',bajajOrders);
app.use('/api/admin',assestvalidation);


app.listen(port,function(err){
    console.log(`server is running on ${port}`);
})