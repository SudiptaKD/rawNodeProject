/*
* Title: User handler
* Description : Handler for user related routes
*/

// dependencies
const data = require('../../lib/data');
const {hash} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const accepetedMethods =['get','post', 'put','delete'];

    if(accepetedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    }   else {
        callback(405, {
            message : "Unaccepted method"
        })
    }
}

// service scaffolding 
handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const firstName = typeof(requestProperties.body.firstName) === 'string' 
                    && requestProperties.body.firstName.trim().length > 0
                    ? requestProperties.body.firstName : false;
                    
    const lastName = typeof(requestProperties.body.lastName) === 'string' 
                    && requestProperties.body.lastName.trim().length > 0
                    ? requestProperties.body.lastName : false;

    const phone = typeof(requestProperties.body.phone) === 'string' 
                    && requestProperties.body.phone.trim().length === 11
                    ? requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password) === 'string' 
                    && requestProperties.body.password.trim().length > 0
                    ? requestProperties.body.password : false;

    const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'boolean'
                     && requestProperties.body.password.trim().length > 0
                    ? requestProperties.body.tosAgreement : false;

    if( firstName && lastName && phone && password && tosAgreement) {
        // make sure the user doesn't exists already!
        data.read( 'users', phone, (err)=> {
            if(err) { // err meaing file is not there, so we can write a new file
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password : hash(password),
                    tosAgreement
                };

                // store the user to db
                data.create('users', phone, userObject, (err1)=> {
                    if(!err1) {
                        callback(200,{
                            'message' : 'User was created successffully'
                        })

                    }   else {
                        callback(500, {
                            error: 'Could not create user!'
                        })
                    }
                })

            }   else {
                callback(500, {
                    error : "There was a problem in server side"
                })
            }
        })

    }   else {
        callback(400, {
            error : "You have a problem in your request"
        })
    }
    
};

handler._users.get = (requestProperties, callback) => {
    // check the phone number is valid
    const phone = typeof(requestProperties.queryStringObject.phone) === 'string' 
                    && requestProperties.queryStringObject.phone.trim().length === 11
                    ? requestProperties.queryStringObject.phone : false;
    if(phone){
        // verify token
        let token = typeof(requestProperties.headersObject.token)==='string' 
                    ? requestProperties.headersObject.token : false;
        
        tokenHandler._token.verify(token, phone, (tokenId)=>{
            if(tokenId) {
                //look up for user
                data.read('users', phone, (err, user)=> {
                    // parse the user string from db then deep copy
                    const responseUser = {...parseJSON(user)};
                    if(!err && responseUser) {
                        delete responseUser.password;
                        callback(200, responseUser);
                        
                    }   else {
                            callback(404,{
                                'error' : "Requested user was not found"
                            })
                    }
                })

            } else {
                callback(403,{
                    'error' : "Authentication failure!"
                })
            }
        })

    }   else {
        callback(404,{
            'error' : "Requested user was not found!"
        })
    }
};

handler._users.put = (requestProperties, callback) => {
     // check the phone number is valid
    const phone = typeof(requestProperties.body.phone) === 'string' 
                && requestProperties.body.phone.trim().length === 11
                ? requestProperties.body.phone : false;

    const firstName = typeof(requestProperties.body.firstName) === 'string' 
                && requestProperties.body.firstName.trim().length > 0
                ? requestProperties.body.firstName : false;
                
    const lastName = typeof(requestProperties.body.lastName) === 'string' 
                && requestProperties.body.lastName.trim().length > 0
                ? requestProperties.body.lastName : false;

    const password = typeof(requestProperties.body.password) === 'string' 
                && requestProperties.body.password.trim().length > 0
                ? requestProperties.body.password : false;

    if(phone) {
        //check if any update field was given
        if(firstName || lastName || password) {
            // verify token
            let token = typeof(requestProperties.headersObject.token)==='string' 
                        ? requestProperties.headersObject.token : false;

            tokenHandler._token.verify(token, phone, (tokenId)=>{
                if(tokenId) {
                    //look up the user
                    data.read('users', phone,  (err, userDataDb)=> {
                        const userData = {...parseJSON(userDataDb)}
                        if(!err && userData) {
                            if(firstName) {
                                userData.firstName =firstName;
                            }
                            if(lastName) {
                                userData.lastName =lastName;
                            }
                            if(password) {
                                userData.password =hash(password);
                            }

                            //store to db
                            data.update('users', phone, userData, (err2)=> {
                                if(!err2){
                                    callback(200, {
                                        "message": 'User was updated successfully!'
                                    })

                                }   else {
                                    callback(500, {
                                        error: 'There was a problem in the server side!'
                                    })
                                }
                            })

                        }   else {
                            callback(400, {
                                error: 'You have a problem in your request!'
                            })
                        }
                    })

                } else {
                    callback(403,{
                        'error' : "Authentication failure!"
                    })
                }
            })

        }   else {
            callback(400, {
                error: 'You have a problem in your request!'
            })
        }

    }   else {
        callback(400, {
            error: 'Invalid phone number, Please try again!'
        })
    }

};

handler._users.delete = (requestProperties, callback) => {
   // check the phone number is valid
    const phone = typeof(requestProperties.queryStringObject.phone) === 'string' 
                && requestProperties.queryStringObject.phone.trim().length === 11
                ? requestProperties.queryStringObject.phone : false;
    
    if(phone) {
        // verify token
        let token = typeof(requestProperties.headersObject.token)==='string' 
                    ? requestProperties.headersObject.token : false;

        tokenHandler._token.verify(token, phone, (tokenId)=>{
            if(tokenId) {
                // look up the user
                data.read('users', phone, (err, userData)=> {
                    if(!err && userData){
                        // delete file
                        data.delete('users', phone , (err1)=> {
                            if(!err1) {
                                callback(200, {
                                    "message": 'User was successffully deleted!'
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

            } else {
                callback(403,{
                    'error' : "Authentication failure!"
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