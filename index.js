/*
* Title: Uptime Monitor App
* Description : A REST API to  monitor up/down of Links given by users

*/

//dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes')
const environment = require('./helpers/environments')
const data = require('./lib/data')

//App object - Module scuffolding
const app ={};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, ()=>{
        console.log(`listening to port ${environment.port}`)
    })
}

// handle request , response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();