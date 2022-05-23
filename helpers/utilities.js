/*
* Title: Utilities
* Description : making all usefull utilities 

*/

//dependencise
const crypto = require('crypto');
const environments = require('./environments')

// Module scaffolding
const utilities = {};

//parse json string to object
utilities.parseJSON =(jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString);
    } catch{
        output ={};
    }
    return output;
}
//hash string
utilities.hash =(str) => {
   if(typeof(str)==='string' && str.length > 0) {
       let hash = crypto.createHmac('sha256', environments.secretKey)
       .update(str)
       .digest('hex');
       return hash
   } else {
       return false;
   }
}

// export
module.exports = utilities;        