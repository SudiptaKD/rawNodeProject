/*
* Title: Environments
* Description : Handling al things related to environments 

*/

//dependencise

// Module scaffolding
const environments = {};

environments.staging ={
    port: 3000,
    envName : 'staging',
    secretKey : 'staging123',
    maxChecks : 5,
    twilio  :{
        fromPhone : '+19403533145',
        accountSid : 'ACe54135588f77ff044e44076053738ded',
        authToken : 'ee7b29677b72de23f83bb78c367287ec' 
    }
}

environments.production ={
    port: 5000,
    envName : 'production',
    secretKey : 'production123',
    maxChecks : 5,
    twilio : {
        fromPhone : '+19403533145',
        accountSid : 'ACe54135588f77ff044e44076053738ded',
        authToken : 'ee7b29677b72de23f83bb78c367287ec'
    },
}

// Find out which environment was passed
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment

const environmentToExport = 
    typeof(environments[currentEnvironment]) === 'object' 
        ? environments[currentEnvironment] 
        : environments.staging;

// export
module.exports = environmentToExport;        