var nconf = require('nconf');
var path = require('path');
var configPath;
nconf.env();

if (nconf.get('NODE_ENV') === 'prod') {
  // running on production machine
 configPath = path.join(__dirname, 'config-prod.json');
 nconf.file(configPath);
} 
if (nconf.get('NODE_ENV') === 'test') {
  // running on testing machine
 configPath = path.join(__dirname, 'config-test.json');
 nconf.file(configPath);
} 
if (nconf.get('NODE_ENV') === 'dev') {
  // running on development machine
 configPath = path.join(__dirname, 'config-dev.json');
 nconf.file(configPath);
} 


// "nconf" is a reference to the nconf object
// that loaded the config file
module.exports = nconf;
