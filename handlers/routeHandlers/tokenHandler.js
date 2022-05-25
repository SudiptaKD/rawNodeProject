/*
* Title: Token handler
* Description : Handler for Token related routes
*/

// dependencies
const data = require('../../lib/data');
const {hash} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities');
const {createRandomString} = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
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
    const phone =   typeof(requestProperties.body.phone) === 'string' 
                    && requestProperties.body.phone.trim().length === 11
                    ? requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password) === 'string' 
                    && requestProperties.body.password.trim().length > 0
                    ? requestProperties.body.password : false;

    if(phone && password) {
        data.read('users',phone , (err, userData)=> {
            let hashedPassword = hash(password);
            if(hashedPassword === parseJSON(userData).password) {
                let tokenId = createRandomString(20);
                let expires = Date.now() + 60 * 60 * 1000;
                let tokenObject ={
                    phone,
                    'id' : tokenId,
                    expires
                }

                // store the token to database
                data.create('tokens', tokenId, tokenObject, (err2) =>{
                    if(!err2) {
                        callback(200, tokenObject);

                    } else {
                        callback(500, {
                            error: 'There was problem in the server side!'
                        })
                    }
                } )

            } else {
                callback(400, {
                    error: 'Password is not valid!'
                })
            }
        })

    }   else {
        callback(400, {
            error: 'You have a problem in your request'
        })
    }
};

handler._token.get = (requestProperties, callback) => {
   
};

handler._token.put = (requestProperties, callback) => {
     
};

handler._token.delete = (requestProperties, callback) => {
  

};

module.exports = handler;