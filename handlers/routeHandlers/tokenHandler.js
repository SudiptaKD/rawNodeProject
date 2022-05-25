/*
* Title: Token handler
* Description : Handler for Token related routes
*/

// dependencies
const data = require('../../lib/data');
//const {hash} = require('../../helpers/utilities');
//const {parseJSON} = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.tokenzHandler = (requestProperties, callback) => {
    const accepetedMethods =['get','post', 'put','delete'];

    if(accepetedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    }   else {
        callback(405, {
            message : "Unaccepted method"
        })
    }
}

// service scaffolding 
handler._token = {};

handler._token.post = (requestProperties, callback) => {
    
};

handler._token.get = (requestProperties, callback) => {
   
};

handler._token.put = (requestProperties, callback) => {
     
};

handler._token.delete = (requestProperties, callback) => {
  

};

module.exports = handler;