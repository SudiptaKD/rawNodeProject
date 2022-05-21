/*
* Title: Uptime Monitor App
* Description : A REST API to  monitor up/down of Links given by users

*/

//dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes')

//App object - Module scuffolding
const app ={};

// app configuration
app.config= {
    port: 3000
};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, ()=>{
        console.log(`listening to port ${app.config.port}`)
    })
}

// handle request , response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();