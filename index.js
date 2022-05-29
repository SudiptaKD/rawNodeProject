/*
* Title: Project Initial file
* Description : Inotial file to start the  node server and workers 
*/

//dependencies
const server = require('./lib/server');
const worker = require('./lib/worker')

 
//test notification
// const {sendTwilioSms} = require('./helpers/notifications')
// sendTwilioSms('01521443834', "hello Sudipta", (err)=>{
//     console.log("this is err ", err)
// } )

//App object - Module scuffolding
const app ={};

app.init = () => {
    //start the server
    server.init();

    // start the workers
    worker.init();
}

app.init();

// export the app i ever needer
module.exports =app;

// // create server
// app.createServer = () => {
//     const server = http.createServer(app.handleReqRes);
//     server.listen(environment.port, ()=>{
//         console.log(`listening to port ${environment.port}`)
//     })
// }

// // handle request , response
// app.handleReqRes = handleReqRes;

// // start the server
// app.createServer();

