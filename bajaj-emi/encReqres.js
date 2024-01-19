const crypto = require('crypto');


function requestDecrypt(reqDecrypt){

    var algorithm = 'aes256'; 
    var reqkey = 'happibajajreqkey';
    let reqencrypted=reqDecrypt

   var decipher = crypto.createDecipher(algorithm, reqkey);
   var decrypted = decipher.update(reqencrypted, 'hex', 'utf8') + decipher.final('utf8');
   var body=JSON.parse(decrypted);

   return body

}



function requestEncrypt(reqEncData){


   let  customerResponse=JSON.stringify(reqEncData)  //strigfy data
        var algorithm = 'aes256'; //const value
        var key = 'happibajajreqkey'; //response key
        var cipher = crypto.createCipher(algorithm, key);  
       var resencrypted = cipher.update(customerResponse, 'utf8', 'hex') + cipher.final('hex');

       return resencrypted

}


module.exports.requestDecrypt = requestDecrypt
module.exports.requestEncrypt = requestEncrypt