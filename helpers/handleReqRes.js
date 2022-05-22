/*
* Title: handle req res
* Description : handling request and response from server

*/
//dependencies
const url = require('url');
const {StringDecoder} = require('string_decoder');
const routes = require('../routes')
const {NotFoundHandler} = require('../handlers/routeHandlers/notFoundHandler');
const { type } = require('os');

// module scaffolding
const handler ={};

handler.handleReqRes = (req, res) => {
    // request handle
    // get url and parse
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '')
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    };

    //handlers
    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : NotFoundHandler;

    //get body with stream
    const decoder = new StringDecoder('utf-8');
    let realData = '';
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    })

    req.on('end', ()=> {
        realData += decoder.end(); 
        // handler Function
        chosenHandler(requestProperties, (statusCode, payload)=> {
            statusCode = typeof(statusCode) === 'number' ? statusCode : 500;
            payload = typeof(payload)=== "object" ? payload : {};
    
            const payloadString = JSON.stringify(payload);
    
            // return the response
            res.writeHead(statusCode);
            res.end(payloadString); 
        })

        //resposne handle  
        res.end('hello');
    })   
}

module.exports = handler;