const configurations = {
    defaultConfig: {
        mongoURI: "mongodb://localhost:27017/event",
        port: 5022,
    },
    sandbox: {
        mongoURI: "mongodb://localhost:27017/event",
        port: 6022,
    },
    local: {
        mongoURI: "mongodb://localhost:27017/event",
        port: 5022,
    }


}

const ENV = process.env.BE_ENV ? process.env.BE_ENV.toLowerCase() : "local";

console.log("ENV: ", ENV);

const configuration = { ...configurations.defaultConfig, ...configurations[ENV] };

console.log("configuration: ", configuration);

module.exports = configuration;
