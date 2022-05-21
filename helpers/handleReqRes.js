/*
* Title: handle req res
* Description : handling request and response from server

*/
//dependencies
const url = require('url');
const {StringDecoder} = require('string_decoder');
const routes = require('../routes')
const {NotFoundHandler} = require('../handlers/routeHandlers/notFoundHandler')

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
        res.end('hello');
    })   
}

module.exports = handler;