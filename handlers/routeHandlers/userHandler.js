/*
* Title: User handler
* Description : Handler for user related routes
*/

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

};

handler._users.get = (requestProperties, callback) => {
    callback(200)
};

handler._users.put = (requestProperties, callback) => {

};

handler._users.delete = (requestProperties, callback) => {

};

module.exports = handler;