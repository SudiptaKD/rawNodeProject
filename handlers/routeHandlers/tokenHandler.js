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
    // check the id is valid
    const id = typeof(requestProperties.queryStringObject.id) === 'string' 
    && requestProperties.queryStringObject.id.trim().length === 20
    ? requestProperties.queryStringObject.id : false;

    if(id){
        //look up for token
        data.read('tokens', id, (err, tokenData)=> {
            // parse the tokenData string from db then deep copy
            const responseToken = {...parseJSON(tokenData)};
            if(!err && responseToken) {
                callback(200, responseToken);
                
                }   else {
                    callback(404,{
                        'error' : "Requested token was not found"
                })
            }
        })

    }   else {
        callback(404,{
        'error' : "Requested token not found"
        })
    }
   
};

handler._token.put = (requestProperties, callback) => {
    const id = typeof(requestProperties.body.id) === 'string' 
            && requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id : false;

    const extend = typeof(requestProperties.body.extend) === 'boolean' 
                && requestProperties.body.extend === true
                ? true : false;
    
    if (id && extend) {
        data.read('tokens', id, (err, tokenData)=>{
            let tokenObject = parseJSON(tokenData);
            if(tokenObject.expires > Date.now() ) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;

                //store the updated tokenObject
                data.update('tokens', id, tokenObject, (err1)=> {
                    if(!err1) {
                        callback(200, {
                            "message" : " Token extended successfully!"
                        })

                    }   else {
                        callback(500,{
                            error : "There was an error in server side!"
                            })
                    }
                })

            } else {
                callback(400,{
                    error : "Token already expired!"
                    })
            }
        })

    } else {
        callback(400, {
            error : "There was a problem in your request"
            })
    }

};

handler._token.delete = (requestProperties, callback) => {
    // check the  token is valid
    const id = typeof(requestProperties.queryStringObject.id) === 'string' 
                && requestProperties.queryStringObject.id.trim().length === 20
                ? requestProperties.queryStringObject.id : false;

    if(id) {
        // look up the token
        data.read('tokens', id, (err, tokenData)=> {
            if(!err && tokenData){
            // delete file
            data.delete('tokens', id , (err1)=> {
                if(!err1) {
                    callback(200, {
                        "message": 'Token was successffully deleted!'
                    })

                } else {
                    callback(500, {
                        error: 'There was a server side error'
                    })
                }
            })
        
        }   else {
            callback(500, {
                error: 'There was a server side error'
            })
        }
    })

    }   else {
        callback(400, {
        error: 'You have a problem in your request!'
        })
    }

};

module.exports = handler;