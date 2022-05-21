/*
* Title: Uptime Monitor App
* Description : A REST API to  monitor up/down of Links given by users

*/

//dependencies
const http = require('http');
const url = require('url');
const {StringDecoder} = require('string_decoder')

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
app.handleReqRes = (req, res) => {
    // request handle
    // get url and parse
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '')
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;

    //get body with straem
    const decoder = new StringDecoder('utf-8');
    let realData = '';
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    })

    req.on('end', ()=> {
        realData += decoder.end(); 
        console.log(realData)

        //resposne handle
        res.end(realData);
    })   
}

// start the server
app.createServer();