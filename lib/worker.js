/*
* Title: Workers library
* Description : Werkers related files and functions
*/

//dependencies
const url = require('url')
const data = require('./data');
const http =require('http');
const https = require('https');
const {parseJSON} = require('../helpers/utilities');
const {sendTwilioSms} = require('../helpers/notifications');


//Worker object - Module scuffolding
const worker ={};

// look up all the checks
worker.gatherAllChecks = () => {
    // get all the checks
    data.list('checks',(err1, checks) =>{
        if(!err1 && checks && checks.length >0) {
            checks.forEach(check => {
                // read the check data
                data.read('checks', check, (err2, originalCheckData)=>{
                    if(!err2 && originalCheckData) {
                        // pass the data to the check validator
                        worker.validateCheckData(parseJSON(originalCheckData));

                    }   else {
                        console.log("Error: Reading one of the checks data")
                    }
                })
            })

        }   else {
                console.log('Error: Could not fifnd any checks to process' );
        }
    });

};

// validate individual check data
worker.validateCheckData =(originalCheckData) => {
    let originalData = originalCheckData;
    if(originalCheckData && originalCheckData.id) {
        originalData.state = typeof(originalCheckData.state) ==='string'
                                && ['up', 'down'].indexOf(originalCheckData.state) >-1 
                                ? originalCheckData.state : 'down';

        originalData.lastChecked = typeof(originalCheckData.lastChecked) ==='number'
                                        && originalCheckData.lastChecked > 0 
                                        ? originalCheckData.lastChecked : false;

        // pass to the next process
        worker.performCheck(originalData);

    }   else {
            console.log("Error : Check was invalid or not properly ormatted!")
    }

};

// perform check
worker.performCheck =(originalCheckData) =>{
    //prepare the initial outcome
    let checkOutCome = {
        'error' : false,
        'responseCode' :false,
    };
    // mark the outcome has not been sent yet
    let outComeSent = false;

    // parse the hostname & full url from original data
    let parsedUrl =url.parse(originalCheckData.protocol + "://" + originalCheckData.url, true);
    const hostname = parsedUrl.hostname;
    const path = parsedUrl.path;

    // construct the request
    const reqestDetails = {
        'protocol' : originalCheckData.protocol + ":",
        'hostname' : hostname,
        'method' : originalCheckData.method.toUpperCase(),
        'path'  : path, 
        'timeout' : originalCheckData.timeoutSeconds*1000
    }

    // find which protocol to use
    const protocolToUse = originalCheckData.protocol === 'http' ? http : https;
    let req = protocolToUse.request(reqestDetails, (res)=> {
        // grab the stats of the response
        const status = res.statusCode;

        // update the check outcome and pass to the next process
        checkOutCome.responseCode =status;
        if(!outComeSent) {
            worker.processCheckOutCome(originalCheckData, checkOutCome);
            outComeSent = true;
        }
    })

    req.on('error', (e)=>{
        checkOutCome = {
            'error' : true,
            'value' : e
        };
        // update the check outcome and pass to the next process
        if(!outComeSent) {
            worker.processCheckOutCome(originalCheckData, checkOutCome);
            outComeSent = true;
        }
    })

    req.on('timeout', (e)=>{
        checkOutCome = {
            'error' : true,
            'value' : 'timeout'
        };
        // update the check outcome and pass to the next process
        if(!outComeSent) {
            worker.processCheckOutCome(originalCheckData, checkOutCome);
            outComeSent = true;
        }
    })
}

//save check outcome to database and send to next process
worker.processCheckOutCome = (originalCheckData, checkOutCome) =>{
    // check if check outcome is up or down
    let state = !checkOutCome.error && checkOutCome.responseCode 
                && originalCheckData.successCodes.indexOf(checkOutCome.responseCode) > -1
                ? 'up' : 'down';
    
    //decide wheater we should alert the user or not
    let alertWanted = originalCheckData.lastChecked && originalCheckData.state === state 
                    ? true: false;

    // update the check data
    let newCheckData = originalCheckData;

    newCheckData.state = state;
    newCheckData.lastChecked = Date.now()

    // update the check to disk
    data.update('checks', newCheckData.id, newCheckData, (err)=> {
        if(!err) {
            if(alertWanted) {
                // send the checkdata to next process
                worker.alertUserToStatusChange(newCheckData);

            }   else {
                console.log("Alert is not needed as state not changed!")
            }
            
        }   else {
                console.log("Error  trying to save check  data of one of the checks")
        }
    })
};

// send notification sms to users if state changes
worker.alertUserToStatusChange = (newCheckData)=> {
    let msg = `Alert: Your check for ${newCheckData.method.toUpperCase()}
             ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state} `;
    
    sendTwilioSms(newCheckData.userPhone, msg, (err)=>{
        if(!err) {
            console.log(`User was alerted to a status change via SMS : ${msg}`)

        }   else {
                console.log("There was a problem sending sms to one of the user")
        }
    })
    
}

// timer to excute the worker process once per minute
worker.loop =() => {
    setInterval(()=> {
        worker.gatherAllChecks();
    },5000)
};

// start the workers
worker.init = ()=> {
    // execute all the checks
    worker.gatherAllChecks();

    // call the loop so that checks continue
    worker.loop();
}

// export the workers
module.exports = worker;