import Web3 from 'web3';
import { Injectable } from '@angular/core';

declare let require: any;
declare let window: any;

@Injectable()
export class ContractsService {
  public account: any;
  public web3: any;
  private optionFactoryABI = require('../../assets/contractABI.json');

  private optionFactoryContract: any;
  public optionFactory: any;
  private optionFactoryAddress: string;

  constructor() {
    this.optionFactoryAddress = '0xefafccc973b5ee172107a42aef208f34d8df5f4d';
    // this.optionFactoryABI = JSON.parse(this.optionFactoryABI);

    if (typeof window.web3 !== 'undefined') {
      // using Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);

      this.account = this.getAccount();
      this.optionFactoryContract = this.web3.eth.contract(this.optionFactoryABI);
      this.optionFactory = this.optionFactoryContract.at(this.optionFactoryAddress);

      this.web3.version.getNetwork((err, netID) => {
        // synchronous way
        switch (netID) {
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
            break;
          default:
            console.log('Connected to an unknown network');
            alert('Please connect to an Ethereum blockchain network!');
        }
      });
      // asynchronous way
      // if (this.web3.version.network !== '4') {
      // } else {
      //  this.deployFactory();
      // }
    } else {
      console.warn(
        'Please use a DApp browser like Mist or the MetaMask plugin for Chrome!'
      );
    }
  }

  async checkDeployment(): Promise<any> {
    // checking and deploying contract
    return new Promise((resolve, reject) => {
      this.web3.eth.getCode(this.optionFactoryAddress, function (error, result) {
        if (!error) {
          // checking if provided address corresponds to a contract or just account
          if (
            JSON.stringify(result) === '0x' ||
            JSON.stringify(result) === '0x0'
          ) {
            console.log('Option factory smart contract not deployed');
            this.deployFactory().then(address => {
              resolve(address);
            });
          } else {
            console.log('Option factory smart contract already deployed');
            resolve(this.optionFactoryAddress);
          }
        } else {
          alert(error);
          return;
        }
      });
    });
  }

  async deployFactory(): Promise<string> {
    console.log('Deploying factory smart contract...');
    this.optionFactory = (await new Promise((resolve, reject) => {
      this.optionFactoryContract.new(
        {
          from: this.web3.eth.accounts[0],
          // tslint:disable-next-line:max-line-length
          data: '0x6080604052670de0b6b3a7640000600555336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506110c28061005f6000396000f3006080604052600436106100af576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806307cadeec146100b457806312065fe01461010b578063128e00ab1461013657806324ad848e146101ce5780632e1a7d4d146101fb578063409e2205146102285780638da5cb5b146102dc578063d0e30db014610333578063d8aabebd1461033d578063ed7c6d151461037f578063f2fde38b146103d8575b600080fd5b3480156100c057600080fd5b506100f5600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061041b565b6040518082815260200191505060405180910390f35b34801561011757600080fd5b50610120610469565b6040518082815260200191505060405180910390f35b34801561014257600080fd5b50610177600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506104b0565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156101ba57808201518184015260208101905061019f565b505050509050019250505060405180910390f35b3480156101da57600080fd5b506101f9600480360381019080803590602001909291905050506105e2565b005b34801561020757600080fd5b5061022660048036038101908080359060200190929190505050610647565b005b34801561023457600080fd5b50610253600480360381019080803590602001909291905050506107de565b6040518080602001848152602001838152602001828103825285818151815260200191508051906020019080838360005b8381101561029f578082015181840152602081019050610284565b50505050905090810190601f1680156102cc5780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b3480156102e857600080fd5b506102f16108af565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61033b6108d4565b005b61037d6004803603810190808035906020019082018035906020019190919293919293908035906020019092919080359060200190929190505050610934565b005b34801561038b57600080fd5b506103d6600480360381019080803590602001908201803590602001919091929391929390803590602001909291908035906020019092919080359060200190929190505050610b8b565b005b3480156103e457600080fd5b50610419600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610e7e565b005b600080600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905080915050919050565b6000600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905090565b606080600080600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040519080825280602002602001820160405280156105245781602001602082028038833980820191505090505b50925060009150600090505b6001805490508110156105d7578473ffffffffffffffffffffffffffffffffffffffff166002600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156105ca578083838151811015156105b357fe5b906020019060200201818152505081806001019250505b8080600101915050610530565b829350505050919050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561063d57600080fd5b8060058190555050565b80600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015151561069557600080fd5b80600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610728573d6000803e3d6000fd5b507fdf273cb619d95419a9cd0ec88123a0538c85064229baa6363788f743fff90deb3382600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001935050505060405180910390a150565b6001818154811015156107ed57fe5b9060005260206000209060030201600091509050806000018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108995780601f1061086e57610100808354040283529160200191610899565b820191906000526020600020905b81548152906001019060200180831161087c57829003601f168201915b5050505050908060010154908060020154905083565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60055434101515156108e557600080fd5b34600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550565b600060018060606040519081016040528088888080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505081526020018681526020018542018152509080600181540180825580915050906001820390600052602060002090600302016000909192909190915060008201518160000190805190602001906109d0929190610ff1565b5060208201518160010155604082015181600201555050039050336002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610a8f6001600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054610fd390919063ffffffff16565b600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055507facdca046fc2bbd753a96081d8f4226b3ae19626f351c335ce373a661612efceb8133600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054604051808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a15050505050565b600081600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151515610bdb57600080fd5b81600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555060018060606040519081016040528089898080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050508152602001878152602001864201815250908060018154018082558091505090600182039060005260206000209060030201600090919290919091506000820151816000019080519060200190610cc2929190610ff1565b5060208201518160010155604082015181600201555050039050336002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610d816001600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054610fd390919063ffffffff16565b600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055507facdca046fc2bbd753a96081d8f4226b3ae19626f351c335ce373a661612efceb8133600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054604051808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a1505050505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610ed957600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151515610f1557600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000808284019050838110151515610fe757fe5b8091505092915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061103257805160ff1916838001178555611060565b82800160010185558215611060579182015b8281111561105f578251825591602001919060010190611044565b5b50905061106d9190611071565b5090565b61109391905b8082111561108f576000816000905550600101611077565b5090565b905600a165627a7a72305820e6142c4bb8e38bf7db58fb4b2c944245e17076e798fc511841a71c15f7945aeb0029',
          gas: '4700000'
        },
        function (e, contract) {
          if (typeof contract.address !== 'undefined') {
            console.log('Factory smart contract mined');
            console.log(
              'address: ' +
              contract.address +
              ' transactionHash: ' +
              contract.transactionHash
            );
            resolve(contract);
          }
        }
      );
    })) as any;

    this.optionFactoryAddress = this.optionFactory.address;
    return Promise.resolve(this.optionFactoryAddress);
  }

  async getAccount(): Promise<string> {
    if (this.account == null || this.account !== this.web3.eth.accounts[0]) {
      this.account = (await new Promise((resolve, reject) => {
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
      })) as string;

      this.web3.eth.defaultAccount = this.account;
    }

    return Promise.resolve(this.account);
  }

  async getOptionCount(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.optionFactory.getOptionCount.call(this.account, function (error, result) {
        if (error) {
          alert(error);
          return;
        } else {
          resolve(result);
        }
      });
    }) as Promise<number>;
  }

  async getContractBalance(): Promise<number> {
    return new Promise((resolve, reject) => {
      const web3 = this.web3;
      this.optionFactory.getBalance.call(function (error, result) {
        if (error) {
          alert(error);
          return;
        } else {
          resolve(web3.fromWei(result));
        }
      });
    }) as Promise<number>;
  }

  async deposit(amount: number): Promise<string> {
    // letting the user know that the transaction has been sent
    console.log('Sending your deposit; this may take a while...');
    // sending the transaction to our contract
    return new Promise((resolve, reject) => {
      this.optionFactory.deposit(
        {
          from: this.web3.eth.accounts[0],
          gas: 4000000,
          value: amount
        },
        function (error, transactionHash) {
          // getting the transaction hash as callback from the function
          if (error) {
            alert(error);
            return;
          } else {
            console.log('Deposit sent');
            console.log('Transaction hash: ' + transactionHash);
            resolve(transactionHash);
          }
        }
      );
    }) as Promise<string>;
  }

  async setMinimumDepositAmount(minimumAmount: number) {
    // letting the user know that the transaction has been sent
    console.log('Setting minimum deposit amount...');
    // sending the transaction to our contract
    return new Promise((resolve, reject) => {
      this.optionFactory.setMinimumDepositValue.sendTransaction(minimumAmount,
        {
          from: this.web3.eth.accounts[0],
          gas: 4000000,
          value: 0
        },
        function (error, transactionHash) {
          // getting the transaction hash as callback from the function
          if (error) {
            alert(error);
            return;
          } else {
            console.log('Set successfully!');
            console.log('Transaction hash: ' + transactionHash);
          }
        }
      );
    });
  }

  async buyOption(asset: string, exercisePrice: number, timeToExpiration: number, premium: number) {
    // letting the user know that the transaction has been sent
    console.log('Creating the option contract; this may take a while...');
    // sending the transaction to our contract
    return new Promise((resolve, reject) => {
      this.optionFactory.buyOption.sendTransaction(
        asset, exercisePrice, timeToExpiration,
        {
          from: this.web3.eth.accounts[0],
          gas: 4000000,
          value: premium
        },
        function (error, transactionHash) {
          // getting the transaction hash as callback from the function
          if (error) {
            alert(error);
            return;
          } else {
            console.log('Option contract bought successfully!');
            console.log('Transaction hash: ' + transactionHash);
          }
        }
      );
    });
  }

  // retrieving all options of the current user account
  async getOptionsByBuyer(account: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.optionFactory.getOptionsByBuyer(
        account,
        function (error, array) {
          if (error) {
            alert(error);
            return;
          } else {
            const optionIDs = [];
            for (let i = 0; i < array.length; i++) {
              optionIDs.push(array[i].c[0]);
            }
            resolve(optionIDs);
          }
        });
    }) as Promise<Array<number>>;
  }

  async getOption(ID: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.optionFactory.options(ID, function (error, option) {
        if (error) {
          alert(error);
          return;
        } else {
          resolve(option);
        }
      });
    }) as Promise<any>;
  }

  /*
   * If block hash is not 0x000... and blockNumber is not null,
   * then the transaction has been mined.
   */
  async getTransaction(hash: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.web3.eth.getTransaction(hash, function (error, transactionInfo) {
        if (error) {
          alert(error);
          return;
        } else {
          resolve(transactionInfo);
        }
      });
    }) as Promise<any>;
  }
}
