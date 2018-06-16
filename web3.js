require('dotenv').config();
var BigNumber = require('bignumber.js');
var Web3 = require('web3')

var web3 = new Web3(new Web3.providers.HttpProvider(process.env.API_URL));

var balance = web3.eth.getBalance(process.env.ACCOUNT, function (error, result) {
  if (!error) {
	  console.log(web3.utils.fromWei(result.toString(), 'ether'));
  } else {
    console.error(error);
  }
});