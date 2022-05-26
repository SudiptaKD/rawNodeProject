/*
* Title: Check handler
* Description : Handler for user defined checks
*/

// dependencies
const data = require('../../lib/data');
const {hash} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

// module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const accepetedMethods =['get','post', 'put','delete'];

    if(accepetedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    }   else {
        callback(405, {
            message : "Unaccepted method"
        })
    }
}

// service scaffolding 
handler._check = {};

handler._check.post = (requestProperties, callback) => {
    //validate inputs
    let protocol = typeof(requestProperties.body.protocol)==='string'
                    && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
                    ? requestProperties.body.protocol : false;

    let url = typeof(requestProperties.body.url)==='string'
            && requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url : false;

    let method = typeof(requestProperties.body.methdo)==='string'
                && ['get', 'post', 'put', 'delete'].indexOf(requestProperties.body.method) > -1
                ? requestProperties.body.method : false;        

    let successCodes = typeof(requestProperties.body.successCodes)==='object'
                    && requestProperties.body.successCodes instanceof Array
                    ? requestProperties.body.successCodes : false;

    let timeoutSeconds = typeof(requestProperties.body.timeoutSeconds)==='number'
                    && requestProperties.body.timeoutSeconds % 1 === 0
                    && requestProperties.body.timeoutSeconds >= 1
                    && requestProperties.body.timeoutSeconds <= 5
                    ? requestProperties.body.timeoutSeconds : false;

    if(protocol && url & method && successCodes && timeoutSeconds) {

    }   else {
        callback(400, {
            error : "You have a problem in your request"
        })
    }             

};

handler._check.get = (requestProperties, callback) => {

};

handler._check.put = (requestProperties, callback) => {

};

handler._check.delete = (requestProperties, callback) => {
};

module.exports = handler;