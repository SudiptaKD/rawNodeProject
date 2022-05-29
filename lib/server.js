/*
* Title: Server library
* Description : server related files and functions

*/

//dependencies
const http = require('http');
const {handleReqRes} = require('../helpers/handleReqRes')
const environment = require('../helpers/environments')


//Server object - Module scuffolding
const server ={};

// create server
server.createServer = () => {
    const createServerVariable = http.createServer(server.handleReqRes);
    createServerVariable.listen(environment.port, ()=>{
        console.log(`listening to port ${environment.port}`)
    })
}

// handle request , response
server.handleReqRes = handleReqRes;

// start the server
server.init = ()=> {
    server.createServer();
}

// export the server
module.exports = server;