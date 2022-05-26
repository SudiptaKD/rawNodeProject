/*
* Title: Check handler
* Description : Handler for user defined checks
*/

// dependencies
const data = require('../../lib/data');
const {hash, createRandomString} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const {maxChecks} = require('../../helpers/environments')

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

    let method = typeof(requestProperties.body.method)==='string'
                && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
                ? requestProperties.body.method : false;        

    let successCodes = typeof(requestProperties.body.successCodes)==='object'
                    && requestProperties.body.successCodes instanceof Array
                    ? requestProperties.body.successCodes : false;

    let timeoutSeconds = typeof(requestProperties.body.timeoutSeconds)==='number'
                    && requestProperties.body.timeoutSeconds % 1 === 0
                    && requestProperties.body.timeoutSeconds >= 1
                    && requestProperties.body.timeoutSeconds <= 5
                    ? requestProperties.body.timeoutSeconds : false;

    if(protocol && url && method && successCodes && timeoutSeconds) {
        let token = typeof(requestProperties.headersObject.token)==='string' 
                    ? requestProperties.headersObject.token : false;
                 
        //look up the user phone by token
        data.read('tokens', token, (err1, tokenData)=> {
            if(!err1 && tokenData) {
                let userPhone = parseJSON(tokenData).phone;

                //look up the user data
                data.read('users', userPhone, (err2, userData)=> {
                    if(!err2 && userData) {
                        //verify the token
                        tokenHandler._token.verify(token, userPhone, (tokenIsValid)=>{
                            if(tokenIsValid) {
                                let userObject = parseJSON(userData);

                                // if userobject has a checks array get them or get a blank array []
                                let userChecks = typeof(userObject.checks)=== 'object'
                                                && userObject.checks instanceof Array 
                                                ? userObject.checks : [];

                                if(userChecks.length < maxChecks) {
                                    let checkId = createRandomString(20);
                                    let checkObject ={
                                        'id' :checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeoutSeconds
                                    }

                                    //save the object to checks
                                    data.create('checks', checkId, checkObject, (err3)=>{
                                        if(!err3) {
                                            // add check id to the users object , as many id as many checks
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);

                                            // save the new user data
                                            data.update('users', userPhone, userObject, (err4)=>{
                                                if(!err4) {
                                                    // return the about the new check
                                                    callback(200, checkObject);

                                                }   else {
                                                        callback(500, {
                                                            error : "There was a problem in the server side!"
                                                        })
                                                }
                                            })

                                        }   else{
                                                callback(500, {
                                                    error : "There was a problem in the server side!"
                                                })
                                        }
                                    })

                                } else {
                                    callback(401, {
                                        error : "User has already reached max checks limit!"
                                    })
                                }

                            }   else {
                                    callback(403, {
                                        error : "Authentication Problem!"
                                    })
                            }
                        })

                    } else {
                        callback(403, {
                            error : "User not found!"
                        })
                    }
                });

            } else {
                callback(403, {
                    error : "Authentication Problem!"
                })
            }

        });            

    }   else {
            callback(400, {
                error : "You have a problem in your request"
            })
    }             

};

handler._check.get = (requestProperties, callback) => {
    // check the id is valid
    const id = typeof(requestProperties.queryStringObject.id) === 'string' 
            && requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id : false;

    if(id) {
        //look up the checks
        data.read('checks', id, (err, checkData)=>{
            let userPhone = parseJSON(checkData).userPhone;
            if(!err && checkData) {
                let token = typeof(requestProperties.headersObject.token)==='string' 
                            ? requestProperties.headersObject.token : false;
                 
                //verify the token
                tokenHandler._token.verify(token, userPhone, (tokenIsValid)=> {
                    if(tokenIsValid){
                        callback(200, parseJSON(checkData));

                    } else {
                        callback(403, {
                            error : "Authentication Problem!"
                        })
                    }
                })

            }   else {
                    callback(500, {
                        error : "There was a problem in the server side!"
                    })
            }
        })

    }   else {
            callback(400, {
                error : "You have a problem in your request"
            })
    }     
    

};

handler._check.put = (requestProperties, callback) => {
    // check the id is valid
    const id = typeof(requestProperties.body.id) === 'string' 
            && requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id : false;
    
    //validate inputs
    let protocol = typeof(requestProperties.body.protocol)==='string'
                && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
                ? requestProperties.body.protocol : false;

    let url = typeof(requestProperties.body.url)==='string'
            && requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url : false;

    let method = typeof(requestProperties.body.method)==='string'
                && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
                ? requestProperties.body.method : false;        

    let successCodes = typeof(requestProperties.body.successCodes)==='object'
                    && requestProperties.body.successCodes instanceof Array
                    ? requestProperties.body.successCodes : false;

    let timeoutSeconds = typeof(requestProperties.body.timeoutSeconds)==='number'
                        && requestProperties.body.timeoutSeconds % 1 === 0
                        && requestProperties.body.timeoutSeconds >= 1
                        && requestProperties.body.timeoutSeconds <= 5
                        ? requestProperties.body.timeoutSeconds : false;
    
    if(id){
        if(protocol || url || method || successCodes || timeoutSeconds) {
            //check database and get phone number to verify token
            data.read('checks', id, (err1, checkData)=> {
                if(!err1 && checkData) {
                    let checkObject = parseJSON(checkData);
                    let token = typeof(requestProperties.headersObject.token)==='string' 
                                ? requestProperties.headersObject.token : false;
                    
                    //verify the token
                    tokenHandler._token.verify(token,checkObject.userPhone, (tokenIsValid)=> {
                        if(tokenIsValid) {
                            if(protocol) {
                                checkObject.protocol =protocol;
                            }
                            if(url) {
                                checkObject.url =url;
                            }
                            if(method) {
                                checkObject.method =method;
                            }
                            if(successCodes) {
                                checkObject.successCodes =successCodes;
                            }
                            if(timeoutSeconds) {
                                checkObject.timeoutSeconds =timeoutSeconds;
                            }

                            // store  the checkObject
                            data.update('checks', id, checkObject, (err2)=> {
                                if(!err2) {
                                    callback(200)

                                }   else {
                                        callback(500, {
                                            error : "There was a problem in the server side!"
                                        })
                                }
                            })

                        }   else {
                                callback(403, {
                                    error : "Authentication Problem!"
                                })
                        }
                    })

                }   else {
                        callback(500, {
                            error : "There was a problem in the server side!"
                        })
                }

            })

        }   else {
                callback(400, {
                    error : "You must provide at least one field to update"
                })
            }

    }   else {
            callback(400, {
                error : "You have a problem in your request"
            })
    }                 

};

handler._check.delete = (requestProperties, callback) => {
};

module.exports = handler;