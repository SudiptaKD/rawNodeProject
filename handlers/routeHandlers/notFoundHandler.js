/*
* Title: Not Found handler
* Description : 404 Not Found Handler

*/

// module scaffolding
const handler = {};

handler.NotFoundHandler = (requestProperties, callback) => {
    console.log('404 Not Found')
    callback(404, {
        message : ' Your requested url was not found'
    })
}

module.exports = handler;