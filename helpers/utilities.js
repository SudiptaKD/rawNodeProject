/*
* Title: Utilities
* Description : making all usefull utilities 

*/

//dependencise

// Module scaffolding
const utilities = {};

//parse json string to object
utilities.parseJSON =(jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString);
    } catch{
        output ={};
    }
    return output;
}

// export
module.exports = utilities;        