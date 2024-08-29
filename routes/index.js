const user = require('./users');
const session = require('./Sessions');



exports.addAPI = function (mount, app, passport, cache) {
  app.use(mount + '/user', user(passport));
  app.use(mount + '/session', session(passport));


};