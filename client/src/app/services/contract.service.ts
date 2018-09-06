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
  public registryAddress = '0x0ac768cff44b463b51a946407488676c16590707';

  public optionFactories = [];
  private optionFactoryData = require('../../assets/factoryData.json');
  private optionFactoryABI = require('../../assets/factoryABI.json');
  public optionFactoryContract: any;
  public optionFactoryAddresses = [];
  public sellers = [];

  public oracles = [];
  private oracleData = require('../../assets/oracleData.json');
  private oracleABI = require('../../assets/oracleABI.json');
  public oracleContract: any;
  // Coinbase , CoinMarketCap, CryptoCompare oracle addresses
  public oracleAddresses = [
    '0x747f28e207f73aacc8eddc597d84cc6028f6b0e5',
    '0xb8fddce43f4a3ce7450595220230491c3594ccde',
    '0x127c4f72637e18772641c362c5ca10c02ed52556'
  ];

  public selectedOptionFactoryId = 0;

  constructor() {
    // tslint:disable-next-line:prefer-const
    let __this = this; // for scope reasons

    if (typeof window.web3 !== 'undefined') {
      // using Mist/MetaMask's provider
      __this.web3 = new Web3(window.web3.currentProvider);

      __this.web3.version.getNetwork((err, netID) => {
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
      // if (__this.web3.version.network !== '4') {
      // } else {
      //  this.deployFactory();
      // }
    } else {
      console.warn(
        'Please use a DApp browser like Mist or the MetaMask plugin for Chrome!'
      );
    }

    __this.registryContract = __this.web3.eth.contract(__this.registryABI);
    __this.registry = __this.registryContract.at(__this.registryAddress);

    __this.oracleContract = __this.web3.eth.contract(__this.oracleABI);

    for (let i = 0; i < __this.oracleAddresses.length; i++) {
      __this.oracles.push(__this.oracleContract.at(__this.oracleAddresses[i]));
    }

    __this.optionFactoryContract = __this.web3.eth.contract(
      __this.optionFactoryABI
    );

    __this.getAccount().then(account => {
      __this.account = account;

      // checking for registry deployment
      __this.checkRegistryDeployment().then(result => {
        console.log('Registry address: ' + result);
        // deploying new registry version by force
        // __this.contractService.deployRegistry();

        // getting the number of sellers registered
        __this.getCountOfSellers().then(count => {
          for (let i = 0; i < count; i++) {
            // getting each registered seller's account address
            __this.registry.addressLUT(i, function(error, address) {
              if (error) {
                return;
              }

              // getting each seller's information from its account address
              __this.getSellerByAddress(address).then(seller => {
                // saving the seller to the array of sellers
                __this.sellers.push(seller);
                // storing a default value for the premium, before it has actually been calculated
                seller.push('...');
                // saving the seller's factory address to the option factory addresses array
                __this.optionFactoryAddresses.push(seller[2]);
                // storing the factory contract object at the specified address to the array of option factories
                __this.optionFactories.push(
                  __this.optionFactoryContract.at(seller[2])
                );
              });
            });
          }
        });
      });
    });
  }

  async register(name: string): Promise<any> {
    // letting the user know that the registration request has been sent
    console.log('Registering; this may take a while...');
    // sending the transaction to the registry contract
    return new Promise((resolve, reject) => {
      this.registry.register.sendTransaction(
        name,
        {
          from: this.web3.eth.accounts[0],
          gas: 4000000,
          value: this.web3.toWei(0.01, 'ether')
        },
        function(error, transactionHash) {
          // getting the transaction hash as callback from the function
          if (error) {
            alert(error);
            return;
          } else {
            console.log('Registration transaction sent successfully');
            console.log('Transaction hash: ' + transactionHash);
          }
        }
      );
    });
  }

  async checkRegistryDeployment(): Promise<any> {
    // tslint:disable-next-line:prefer-const
    let __this = this;

    // checking and deploying registry contract
    return new Promise((resolve, reject) => {
      __this.web3.eth.getCode(__this.registryAddress, function(error, result) {
        if (!error) {
          // checking if provided address corresponds to a contract or just account
          if (
            JSON.stringify(result) === '0x' ||
            JSON.stringify(result) === '0x0'
          ) {
            console.log('Registry smart contract not deployed');
            __this.deployRegistry().then(address => {
              resolve(address);
            });
          } else {
            console.log('Registry smart contract already deployed');
            resolve(__this.registryAddress);
          }
        } else {
          alert(error);
          return;
        }
      });
    });
  }

  async deployRegistry(): Promise<string> {
    // tslint:disable-next-line:prefer-const
    let __this = this;

    console.log('Deploying registry smart contract...');
    __this.registry = (await new Promise((resolve, reject) => {
      __this.registryContract.new(
        {
          from: __this.web3.eth.accounts[0],
          data: __this.registryData[0].data,
          gas: 4700000
        },
        function(e, contract) {
          if (typeof contract.address !== 'undefined') {
            console.log('Registry smart contract mined');
            console.log('Address: ' + contract.address);
            console.log('TransactionHash: ' + contract.transactionHash);
            resolve(contract);
          }
        }
      );
    })) as any;

    __this.registryAddress = __this.registry.address;
    return Promise.resolve(__this.registryAddress);
  }

  /**
   * Retrieving the number of sellers registered with the master registry smart contract
   */
  async getCountOfSellers(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.registry.size(function(error, count) {
        if (error) {
          alert(error);
          return;
        } else {
          resolve(count);
        }
      });
    }) as Promise<number>;
  }

  // retrieving the factory of the current user account
  async getSellerByAddress(account: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.registry.sellers(account, function(error, seller) {
        if (error) {
          alert(error);
          return;
        } else {
          resolve(seller);
        }
      });
    }) as Promise<any>;
  }

  async checkFactoryDeployment(id: number): Promise<any> {
    // tslint:disable-next-line:prefer-const
    let __this = this;

    // checking and deploying contract
    return new Promise((resolve, reject) => {
      const optionFactory = __this.optionFactoryAddresses[id];

      if (
        optionFactory !== '' &&
        optionFactory !== undefined &&
        optionFactory !== null
      ) {
        __this.web3.eth.getCode(__this.optionFactoryAddresses[id], function(
          error,
          result
        ) {
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
              console.log(
                'Option factory smart contract at address ' +
                  __this.optionFactoryAddresses[id] +
                  ' already deployed'
              );
              resolve(__this.optionFactoryAddresses[id]);
            }
          } else {
            alert(error);
            return;
          }
        });
      } else {
        resolve('');
      }
    });
  }

  async deployFactory(markupPercentage: number): Promise<string> {
    console.log('Deploying factory smart contract...');
    const optionFactory = (await new Promise((resolve, reject) => {
      this.optionFactoryContract.new(
        markupPercentage,
        {
          from: this.web3.eth.accounts[0],
          data: this.optionFactoryData[0].data,
          gas: '4700000'
        },
        function(e, contract) {
          if (typeof contract.address !== 'undefined') {
            console.log('Factory smart contract mined');
            console.log('Address: ' + contract.address);
            console.log('TransactionHash: ' + contract.transactionHash);
            resolve(contract);
          }
        }
      );
    })) as any;

    this.optionFactories.push(optionFactory);
    this.optionFactoryAddresses.push(optionFactory.address);
    return Promise.resolve(optionFactory.address);
  }

  async setFactoryAddress(factoryAddress: string) {
    // letting the user know that the transaction has been sent
    console.log('Registering factory address with master registry...');
    // sending the transaction to our contract
    // value in Gwei, standard current value from https://www.ethgasstation.info/
    return new Promise((resolve, reject) => {
      this.registry.setFactoryAddress.sendTransaction(
        factoryAddress,
        {
          from: this.web3.eth.accounts[0],
          gas: 4000000
        },
        function(error, transactionHash) {
          // getting the transaction hash as callback from the function
          if (error) {
            alert(error);
            return;
          } else {
            console.log('Factory address registration sent successfully');
            console.log('Transaction hash: ' + transactionHash);
          }
        }
      );
    });
  }

  async checkOracleDeployment(oracleAddress: string): Promise<any> {
    // checking and deploying oracle
    return new Promise((resolve, reject) => {
      this.web3.eth.getCode(oracleAddress, function(error, result) {
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
            console.log(
              'Oracle smart contract at address ' +
                oracleAddress +
                ' already deployed'
            );
            resolve(oracleAddress);
          }
        } else {
          alert(error);
          return;
        }
      });
    });
  }

  async deployOracle(
    name: string,
    urlPart1: string,
    symbol: string,
    urlPart2: string
  ): Promise<string> {
    console.log('Deploying ' + name + ' oracle...');
    const oracle = (await new Promise((resolve, reject) => {
      this.oracleContract.new(
        name,
        urlPart1,
        symbol,
        urlPart2,
        {
          from: this.web3.eth.accounts[0],
          data: this.oracleData[0].data,
          gas: 4700000
        },
        function(e, contract) {
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

  async getOptionCount(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.optionFactories[id].getOptionCount.call(this.account, function(
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

  async getContractBalance(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      const web3 = this.web3;
      this.optionFactories[id].getBalance.call(function(error, result) {
        if (error) {
          alert(error);
          return;
        } else {
          resolve(web3.fromWei(result));
        }
      });
    }) as Promise<number>;
  }

  async deposit(id: number, amount: number): Promise<string> {
    // letting the user know that the transaction has been sent
    console.log('Sending your deposit; this may take a while...');
    // sending the transaction to our contract
    return new Promise((resolve, reject) => {
      this.optionFactories[id].deposit(
        {
          from: this.web3.eth.accounts[0],
          gas: 4000000,
          value: amount
        },
        function(error, transactionHash) {
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

  async setMinimumDepositAmount(
    id: number,
    minimumAmount: number
  ): Promise<any> {
    // letting the user know that the transaction has been sent
    console.log('Setting minimum deposit amount...');
    // sending the transaction to our contract
    // value in Gwei, standard current value from https://www.ethgasstation.info/
    return new Promise((resolve, reject) => {
      this.optionFactories[id].setMinimumDepositValue.sendTransaction(
        minimumAmount,
        {
          from: this.web3.eth.accounts[0],
          gas: 4000000,
          value: this.web3.toWei(0.0001, 'ether')
        },
        function(error, transactionHash) {
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
    id: number,
    asset: string,
    exercisePrice: number,
    expirationDate: number,
    premium: number
  ): Promise<any> {
    // letting the user know that the transaction has been sent
    console.log('Buying the option contract; this may take a while...');
    // sending the transaction to our contract
    return new Promise((resolve, reject) => {
      this.optionFactories[id].buyOption.sendTransaction(
        asset,
        exercisePrice,
        expirationDate,
        {
          from: this.web3.eth.accounts[0],
          gas: 4000000,
          value: premium
        },
        function(error, transactionHash) {
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
  async exerciseOption(id: number, option: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.optionFactories[id].exerciseOption(option, function(error, hash) {
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
  async getOptionsByBuyer(id: number, account: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.optionFactories[id].getOptionsByBuyer(account, function(
        error,
        array
      ) {
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

  async getOption(id: number, option: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.optionFactories[id].options(option, function(error, optionInfo) {
        if (error) {
          alert(error);
          return;
        } else {
          resolve(optionInfo);
        }
      });
    }) as Promise<any>;
  }

  // retrieving the calculated premium for a specific option from a specific factory
  async getOptionPremium(id: number, exercisePrice: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.optionFactories[id].calculateOptionPremium.sendTransaction(
        exercisePrice,
        {
          from: this.web3.eth.accounts[0],
          gas: 4000000,
          value: this.web3.toWei(0.0001, 'ether')
        },
        function(error, transactionHash) {
          // getting the transaction hash as callback from the function
          if (error) {
            alert(error);
            return;
          } else {
            console.log(
              'Option premium calculation transaction sent successfully'
            );
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
      this.web3.eth.getTransaction(hash, function(error, transactionInfo) {
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
