/*
* Title: Workers library
* Description : Werkers related files and functions
*/

//dependencies
const data = require('./data');
const {parseJSON} = require('../helpers/utilities')


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

// timer to excute the worker process once per minute
worker.loop =() => {
    setInterval(()=> {
        worker.gatherAllChecks();
    },1000*60)
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