var Web3 = require('web3');
var util = require('ethereumjs-util');
var tx = require('ethereumjs-tx');
var lightwallet = require('eth-lightwallet');
var txutils = lightwallet.txutils;
var web3 = new Web3(
    new Web3.providers.HttpProvider('https://rinkeby.infura.io/')
);
var address = '0x8D68583e625CAaE969fA9249502E105a21435EbF';
var key = '1ce642301e680f60227b9d8ffecad474f15155b6d8f8a2cb6bde8e85c8a4809a';
var bytecode = '6060604052346100005760405160208061075b833981016040528080519060200190919050505b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c01000000000000000000000000908102040217905550600160016000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001819055508060ff16600281815481835581811511610100578183600052602060002091820191016100ff91905b808211156100fb5760006000820160009055506001016100e0565b5090565b5b505050505b505b610646806101156000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480635c19a95c14610059578063609ff1bd146100765780639e7b8d611461009c578063b3f98adc146100b9575b610000565b346100005761007460048080359060200190919050506100d6565b005b34610000576100836103dc565b604051808260ff16815260200191505060405180910390f35b34610000576100b76004808035906020019091905050610460565b005b34610000576100d46004808035906020019091905050610533565b005b60006000600160003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002091508160010160009054906101000a900460ff1615610121576103d7565b5b600073ffffffffffffffffffffffffffffffffffffffff16600160008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415801561022357503373ffffffffffffffffffffffffffffffffffffffff16600160008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614155b1561027c57600160008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160029054906101000a900473ffffffffffffffffffffffffffffffffffffffff169250610122565b3373ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156102b5576103d7565b60018260010160006101000a81548160ff02191690837f0100000000000000000000000000000000000000000000000000000000000000908102040217905550828260010160026101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c01000000000000000000000000908102040217905550600160008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090508060010160009054906101000a900460ff16156103bf57816000015460028260010160019054906101000a900460ff1660ff16815481101561000057906000526020600020900160005b50600001600082825401925050819055506103d6565b816000015481600001600082825401925050819055505b5b505050565b60006000600060009150600090505b6002805490508160ff16101561045a578160028260ff16815481101561000057906000526020600020900160005b5060000154111561044c5760028160ff16815481101561000057906000526020600020900160005b506000015491508092505b5b80806001019150506103eb565b5b505090565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415806104f35750600160008273ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900460ff165b156104fd57610530565b6001600160008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001819055505b50565b6000600160003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090508060010160009054906101000a900460ff168061058557506002805490508260ff1610155b1561058f57610642565b60018160010160006101000a81548160ff02191690837f0100000000000000000000000000000000000000000000000000000000000000908102040217905550818160010160016101000a81548160ff02191690837f0100000000000000000000000000000000000000000000000000000000000000908102040217905550806000015460028360ff16815481101561000057906000526020600020900160005b50600001600082825401925050819055505b505056';
var interface = [{"constant":false,"inputs":[{"name":"to","type":"address"}],"name":"delegate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"winningProposal","outputs":[{"name":"winningProposal","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"voter","type":"address"}],"name":"giveRightToVote","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"proposal","type":"uint8"}],"name":"vote","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_numProposals","type":"uint8"}],"payable":false,"type":"constructor"}];

function sendRaw(rawTx) {
    var privateKey = new Buffer(key, 'hex');
    var transaction = new tx(rawTx);
    transaction.sign(privateKey);
    var serializedTx = transaction.serialize().toString('hex');
    web3.eth.sendRawTransaction(
    '0x' + serializedTx, function(err, result) {
        if(err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
}

//1st transaction to create smart contract
// var rawTx = {
//     nonce: web3.toHex(web3.eth.getTransactionCount(address)),
//     gasLimit: web3.toHex(800000),
//     gasPrice: web3.toHex(20000000000),
//     data: '0x' + bytecode + '0000000000000000000000000000000000000000000000000000000000000005'
// };
// sendRaw(rawTx);

//2nd transaction to submit a vote to the smart contract
// var contractAddress = '0x3ea36fad89cafdc84bc0ce82e0d98c6c0a796b19';
// var txOptions = {
//     nonce: web3.toHex(web3.eth.getTransactionCount(address)),
//     gasLimit: web3.toHex(800000),
//     gasPrice: web3.toHex(20000000000),
//     to: contractAddress
// }
// var rawTx = txutils.functionTx(interface, 'vote', [4], txOptions);
// sendRaw(rawTx);

//check if vote is submitted
// var contractAddress = '0x3ea36fad89cafdc84bc0ce82e0d98c6c0a796b19';
// var contract = web3.eth.contract(interface);
// var instance = contract.at(contractAddress);
// instance.winningProposal.call(function(err, result) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log(result.toNumber());
//     }
// });

//3rd transaction to return remaining ether
// var rawTx = {
//     nonce: web3.toHex(web3.eth.getTransactionCount(address)),
//     gasLimit: web3.toHex(21000),
//     gasPrice: web3.toHex(20000000000),
//     to: '0x31B98D14007bDEe637298086988A0bBd31184523',
//     value: web3.toHex(web3.toBigNumber(web3.eth.getBalance(address))
//           .minus(web3.toBigNumber(21000).times(20000000000)))
// };
// sendRaw(rawTx);
