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
    secretKey : 'staging123'
}

environments.production ={
    port: 5000,
    envName : 'production',
    secretKey : 'production123'
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