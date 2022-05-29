/*
* Title: Workers library
* Description : Werkers related files and functions
*/

//dependencies
const data = require('./data');


//Worker object - Module scuffolding
const worker ={};

// look up all the checks
worker.gatherAllChecks = () => {
    // get all the checks
    

}

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