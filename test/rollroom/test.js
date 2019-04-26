// var utils = require('./utils/utils');
// console.log(utils.generateExchangeCode());


// var RandExp = require('randexp');
// const randexp = new RandExp(/^[a-zA-Z0-9]{8}&/);
// console.log(randexp.gen());

var cp = require('child_process');

cp.fork('./waitToRoll.js');