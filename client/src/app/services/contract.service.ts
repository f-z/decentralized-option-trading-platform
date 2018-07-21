import Web3 from 'web3';
import { Injectable } from '@angular/core';

declare let require: any;
declare let window: any;

@Injectable()
export class ContractsService {
  private account: string = null;
  private web3: any;
  private tokenABI = require('./tokenContract.json');

  private optionFactoryContract: any;
  private optionFactory: any;
  private optionFactoryAddress: string;

  constructor() {
    this.optionFactoryAddress = '0x1c05e91e0022dbbb58f583ab5ac007ea9aec4d5b';
    // this.tokenAbi = JSON.parse(this.tokenAbi);

    if (typeof window.web3 !== 'undefined') {
      // using Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);

      this.web3.version.getNetwork((err, netId) => {
        // synchronous way
        switch (netId) {
          case '1':
            console.log('Connected to the Main network');
            break;
          case '2':
            console.log('Connected to the deprecated Morden test network');
            break;
          case '3':
            console.log('Connected to the Ropsten test network');
            break;
          case '4':
            console.log('Connected to the Rinkeby test network');
            this.deployContract();
            break;
          default:
            console.log('Connected to an unknown network');
            alert('Please connect to an Ethereum blockchain network!');
        }
      });
      // asynchronous way
      // if (this.web3.version.network !== '4') {
      // } else {
      //  this.deployContract();
      // }
    } else {
      console.warn(
        'Please use a DApp browser like Mist or the MetaMask plugin for Chrome!'
      );
    }
  }

  private async deployContract(): Promise<string> {
  // checking and deploying contract
  this.web3.eth.getCode(this.optionFactoryAddress, function (error, result) {
    if (!error) {
      // checking if provided address corresponds to a contract or just account
      if (JSON.stringify(result) === '0x' || JSON.stringify(result) === '0x0') {
        console.log('Contract not deployed');
        this.optionFactoryContract = this.web3.eth.contract(this.tokenABI);
        this.optionFactory = this.optionFactoryContract.new({
          from: this.web3.eth.accounts[0],
          // tslint:disable-next-line:max-line-length
          data: '0x6080604052336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506107d0806100536000396000f30060806040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063168fd6d114610072578063409e2205146100df5780638da5cb5b14610193578063f2fde38b146101ea578063fea33db21461022d575b600080fd5b34801561007e57600080fd5b5061009d6004803603810190808035906020019092919050505061026f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156100eb57600080fd5b5061010a600480360381019080803590602001909291905050506102a2565b6040518080602001848152602001838152602001828103825285818151815260200191508051906020019080838360005b8381101561015657808201518184015260208101905061013b565b50505050905090810190601f1680156101835780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b34801561019f57600080fd5b506101a8610373565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156101f657600080fd5b5061022b600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610398565b005b61026d60048036038101908080359060200190820180359060200191909192939192939080359060200190929190803590602001909291905050506104ed565b005b60026020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6001818154811015156102b157fe5b9060005260206000209060030201600091509050806000018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561035d5780601f106103325761010080835404028352916020019161035d565b820191906000526020600020905b81548152906001019060200180831161034057829003601f168201915b5050505050908060010154908060020154905083565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156103f357600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415151561042f57600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600060018060606040519081016040528088888080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505081526020018681526020018542018152509080600181540180825580915050906001820390600052602060002090600302016000909192909190915060008201518160000190805190602001906105899291906106ff565b5060208201518160010155604082015181600201555050039050336002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205403600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055507f79ce9212767ade787cd3ec41b113238082cf0e1b6ef92bd2c54eea32598c986681600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054604051808381526020018281526020019250505060405180910390a15050505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061074057805160ff191683800117855561076e565b8280016001018555821561076e579182015b8281111561076d578251825591602001919060010190610752565b5b50905061077b919061077f565b5090565b6107a191905b8082111561079d576000816000905550600101610785565b5090565b905600a165627a7a723058202c19b1cfadac7d69abd84b9bacc63d96925721075ea1096341cf307b07ef0d2c0029',
          gas: '4700000'
        }, function (e, contract) {
          console.log(e, contract);
          if (typeof contract.address !== 'undefined') {
            console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
          }
        });
      } else {
        console.log('Contract already deployed');
      }
    } else {
      console.error(error);
    }
  });

    return Promise.resolve('Check done');
  }

  private async getAccount(): Promise<string> {
    if (this.account == null) {
      this.account = await new Promise((resolve, reject) => {
        this.web3.eth.getAccounts((err, accs) => {
          if (err != null) {
            alert('There was an error fetching your accounts!');
            return;
          }

          if (accs.length === 0) {
            alert(
              'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
            );
            return;
          }
          resolve(accs[0]);
        });
      }) as string;

      this.web3.eth.defaultAccount = this.account;
    }

    return Promise.resolve(this.account);
  }

  public async getUserBalance(): Promise<number> {
    const account = await this.getAccount();

    return new Promise((resolve, reject) => {
      const web3 = this.web3;
      this.optionFactoryContract.balanceOf.call(account, function (err, result) {
        if (err != null) {
          reject(err);
        }

        resolve(web3.fromWei(result));
      });
    }) as Promise<number>;
  }
}
