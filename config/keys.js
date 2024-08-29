const configuration = require("./configuration");

module.exports = {

  mongoURI: configuration.mongoURI,

  secretOrKey: "Avengers@A$semble#@@",
  redisHost: "127.0.0.1",
  redisPort: 6379,
  region: "ap-south-1",
  defaultRedisCacheTTL: 10, //seconds
  spGetTTL: 600, //seconds
  queueCountTTL: 2 //seconds

};