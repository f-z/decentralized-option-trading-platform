import Web3 from 'web3';
import { Injectable } from '@angular/core';

declare let require: any;
declare let window: any;

@Injectable()
export class ContractsService {
  public account: any;
  public web3: any;

  registry: any;
  private registryData = require('../../assets/registryData.json');
  private registryABI = require('../../assets/registryABI.json');
  private registryContract: any;
  private registryAddress = '0x93a20102adeaefc8f40961184a3cfa8377459ec1';

  optionFactory: any;
  private optionFactoryData = require('../../assets/factoryData.json');
  private optionFactoryABI = require('../../assets/factoryABI.json');
  private optionFactoryContract: any;
  private optionFactoryAddress = '0x0de46eb8e2f33181a1fb6c83b9b5d21f44df84a3';

  oracles = [];
  private oracleData = require('../../assets/oracleData.json');
  private oracleABI = require('../../assets/oracleABI.json');
  private oracleContract: any;
  // Coinbase , CoinMarketCap, CryptoCompare oracle addresses
  oracleAddresses = ['0x747f28e207f73aacc8eddc597d84cc6028f6b0e5',
                     '0xb8fddce43f4a3ce7450595220230491c3594ccde',
                     '0x127c4f72637e18772641c362c5ca10c02ed52556'];

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      // using Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);

      this.registryContract = this.web3.eth.contract(
        this.registryABI
      );
      this.registry = this.registryContract.at(
        this.registryAddress
      );

      this.optionFactoryContract = this.web3.eth.contract(
        this.optionFactoryABI
      );
      this.optionFactory = this.optionFactoryContract.at(
        this.optionFactoryAddress
      );

      this.oracleContract = this.web3.eth.contract(
        this.oracleABI
      );

      for (let i = 0; i < this.oracleAddresses.length; i++) {
        this.oracles.push(this.oracleContract.at(
          this.oracleAddresses[i])
        );
      }

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

  async checkRegistryDeployment(): Promise<any> {
    // checking and deploying registry contract
    return new Promise((resolve, reject) => {
      this.web3.eth.getCode(this.registryAddress, function (error, result) {
        if (!error) {
          // checking if provided address corresponds to a contract or just account
          if (
            JSON.stringify(result) === '0x' ||
            JSON.stringify(result) === '0x0'
          ) {
            console.log('Registry smart contract not deployed');
            this.deployRegistry().then(address => {
              resolve(address);
            });
          } else {
            console.log('Registry smart contract already deployed');
            resolve(this.registryAddress);
          }
        } else {
          alert(error);
          return;
        }
      });
    });
}

async deployRegistry(): Promise<string> {
  console.log('Deploying registry smart contract...');
  this.registry = (await new Promise((resolve, reject) => {
    this.registryContract.new(
      {
        from: this.web3.eth.accounts[0],
        data: this.registryData[0].data,
        gas: '4700000'
      },
      function (e, contract) {
        if (typeof contract.address !== 'undefined') {
          console.log('Registry smart contract mined');
          console.log('Address: ' + contract.address);
          console.log('TransactionHash: ' + contract.transactionHash);
          resolve(contract);
        }
      }
    );
  })) as any;

  this.registryAddress = this.registry.address;
  return Promise.resolve(this.registryAddress);
}

  async checkFactoryDeployment(): Promise<any> {
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
          data: this.optionFactoryData[0].data,
          gas: '4700000'
        },
        function (e, contract) {
          if (typeof contract.address !== 'undefined') {
            console.log('Factory smart contract mined');
            console.log('Address: ' + contract.address);
            console.log('TransactionHash: ' + contract.transactionHash);
            resolve(contract);
          }
        }
      );
    })) as any;

    this.optionFactoryAddress = this.optionFactory.address;
    return Promise.resolve(this.optionFactoryAddress);
  }

  async checkOracleDeployment(oracleAddress: string): Promise<any> {
    // checking and deploying oracle
    return new Promise((resolve, reject) => {
      this.web3.eth.getCode(oracleAddress, function (error, result) {
        if (!error) {
          // checking if provided address corresponds to a contract or just account
          if (
            JSON.stringify(result) === '0x' ||
            JSON.stringify(result) === '0x0'
          ) {
            console.log('Oracle smart contract not deployed');
            this.deployOracle().then(address => {
              resolve(address);
            });
          } else {
            console.log('Oracle smart contract already deployed');
            resolve(oracleAddress);
          }
        } else {
          alert(error);
          return;
        }
      });
    });
}

async deployOracle(name: string, urlPart1: string, symbol: string, urlPart2: string): Promise<string> {
  console.log('Deploying ' + name + ' oracle...');
  const oracle = (await new Promise((resolve, reject) => {
    this.oracleContract.new(name, urlPart1, symbol, urlPart2,
      {
        from: this.web3.eth.accounts[0],
        data: this.oracleData[0].data,
        gas: '4700000'
      },
      function (e, contract) {
        if (typeof contract.address !== 'undefined') {
          console.log(name + ' oracle smart contract mined');
          console.log(name + ' address: ' + contract.address);
          console.log('TransactionHash: ' + contract.transactionHash);
          resolve(contract);
        }
      }
    );
  })) as any;

  this.oracles.push(oracle);
  this.oracleAddresses.push(oracle.address);
  return Promise.resolve(oracle.address);
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
      this.optionFactory.getOptionCount.call(this.account, function (
        error,
        result
      ) {
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
    // value in Gwei, standard current value from https://www.ethgasstation.info/
    return new Promise((resolve, reject) => {
      this.optionFactory.setMinimumDepositValue.sendTransaction(
        minimumAmount,
        {
          from: this.web3.eth.accounts[0],
          gas: 4000000,
          value: 1700000000
        },
        function (error, transactionHash) {
          // getting the transaction hash as callback from the function
          if (error) {
            alert(error);
            return;
          } else {
            console.log('Set successfully');
            console.log('Transaction hash: ' + transactionHash);
          }
        }
      );
    });
  }

  async buyOption(
    asset: string,
    exercisePrice: number,
    expirationDate: number,
    premium: number
  ) {
    // letting the user know that the transaction has been sent
    console.log('Buying the option contract; this may take a while...');
    // sending the transaction to our contract
    return new Promise((resolve, reject) => {
      this.optionFactory.buyOption.sendTransaction(
        asset,
        exercisePrice,
        expirationDate,
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
            console.log('Option purchasing transaction sent successfully');
            console.log('Transaction hash: ' + transactionHash);
          }
        }
      );
    });
  }

  // exercising the option, if it is past its maturity date
  async exerciseOption(id: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.optionFactory.exerciseOption(id, function (error, hash) {
        if (error) {
          alert(error);
          return;
        } else {
          resolve(hash);
        }
      });
    }) as Promise<string>;
  }

  // retrieving all options of the current user account
  async getOptionsByBuyer(account: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.optionFactory.getOptionsByBuyer(account, function (error, array) {
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

  async getOption(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.optionFactory.options(id, function (error, option) {
        if (error) {
          alert(error);
          return;
        } else {
          resolve(option);
        }
      });
    }) as Promise<any>;
  }

  // retrieving the calculated premium for a specific option
  async getOptionPremium(exercisePrice: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.optionFactory.calculateOptionPremium.sendTransaction(
        exercisePrice,
          {
            from: this.web3.eth.accounts[0],
            gas: 4000000,
            value: this.web3.toWei(0.01, 'ether')
          },
          function (error, transactionHash) {
            // getting the transaction hash as callback from the function
            if (error) {
              alert(error);
              return;
            } else {
              console.log('Option premium calculation transaction sent successfully');
              console.log('Transaction hash: ' + transactionHash);
            }
          }
        );
      });
  }

  /*
   * If the block hash is not 0x000... and the blockNumber is not null,
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
