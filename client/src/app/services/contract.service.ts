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
    this.optionFactoryAddress = '0xf0a3c33f853766f4e08aaecd92cd60433b8d1822';
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
          data: '0x6080604052662386f26fc10000600555336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061130c8061005e6000396000f3006080604052600436106100c5576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806307cadeec146100ca57806312065fe014610121578063128e00ab1461014c5780632e1a7d4d146101e4578063409e22051461021157806344e70748146102d05780638da5cb5b1461031f578063976006bb14610376578063aab483d6146103b7578063d0e30db0146103e4578063d8aabebd146103ee578063f2fde38b14610430578063f52f252614610473575b600080fd5b3480156100d657600080fd5b5061010b600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506104b8565b6040518082815260200191505060405180910390f35b34801561012d57600080fd5b50610136610506565b6040518082815260200191505060405180910390f35b34801561015857600080fd5b5061018d600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061054d565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156101d05780820151818401526020810190506101b5565b505050509050019250505060405180910390f35b3480156101f057600080fd5b5061020f6004803603810190808035906020019092919050505061067f565b005b34801561021d57600080fd5b5061023c60048036038101908080359060200190929190505050610816565b604051808060200185815260200184815260200183151515158152602001828103825286818151815260200191508051906020019080838360005b83811015610292578082015181840152602081019050610277565b50505050905090810190601f1680156102bf5780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b3480156102dc57600080fd5b5061031d60048036038101908080359060200190820180359060200191909192939192939080359060200190929190803590602001909291905050506108fa565b005b34801561032b57600080fd5b50610334610c23565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561038257600080fd5b506103a160048036038101908080359060200190929190505050610c48565b6040518082815260200191505060405180910390f35b3480156103c357600080fd5b506103e260048036038101908080359060200190929190505050610c52565b005b6103ec610cb7565b005b61042e6004803603810190808035906020019082018035906020019190919293919293908035906020019092919080359060200190929190505050610d17565b005b34801561043c57600080fd5b50610471600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610fac565b005b34801561047f57600080fd5b5061049e60048036038101908080359060200190929190505050611101565b604051808215151515815260200191505060405180910390f35b600080600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905080915050919050565b6000600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905090565b606080600080600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040519080825280602002602001820160405280156105c15781602001602082028038833980820191505090505b50925060009150600090505b600180549050811015610674578473ffffffffffffffffffffffffffffffffffffffff166002600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156106675780838381518110151561065057fe5b906020019060200201818152505081806001019250505b80806001019150506105cd565b829350505050919050565b80600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101515156106cd57600080fd5b80600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610760573d6000803e3d6000fd5b507fdf273cb619d95419a9cd0ec88123a0538c85064229baa6363788f743fff90deb3382600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001935050505060405180910390a150565b60018181548110151561082557fe5b9060005260206000209060040201600091509050806000018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108d15780601f106108a6576101008083540402835291602001916108d1565b820191906000526020600020905b8154815290600101906020018083116108b457829003601f168201915b5050505050908060010154908060020154908060030160009054906101000a900460ff16905084565b600067016345785d8a0000600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015151561095257600080fd5b67016345785d8a0000600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555060018060806040519081016040528088888080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050815260200186815260200185815260200160001515815250908060018154018082558091505090600182039060005260206000209060040201600090919290919091506000820151816000019080519060200190610a4892919061123b565b50602082015181600101556040820151816002015560608201518160030160006101000a81548160ff0219169083151502179055505050039050336002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610b276001600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461121d90919063ffffffff16565b600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055507facdca046fc2bbd753a96081d8f4226b3ae19626f351c335ce373a661612efceb8133600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054604051808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a15050505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000819050919050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610cad57600080fd5b8060058190555050565b6005543410151515610cc857600080fd5b34600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550565b600067016345785d8a00003410151515610d3057600080fd5b60018060806040519081016040528088888080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050815260200186815260200185815260200160001515815250908060018154018082558091505090600182039060005260206000209060040201600090919290919091506000820151816000019080519060200190610dd192919061123b565b50602082015181600101556040820151816002015560608201518160030160006101000a81548160ff0219169083151502179055505050039050336002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610eb06001600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461121d90919063ffffffff16565b600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055507facdca046fc2bbd753a96081d8f4226b3ae19626f351c335ce373a661612efceb8133600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054604051808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a15050505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561100757600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415151561104357600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000816002600082815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561117157600080fd5b60018381548110151561118057fe5b90600052602060002090600402016002015442101580156111cc57506001838154811015156111ab57fe5b906000526020600020906004020160030160009054906101000a900460ff16155b1561121257600180848154811015156111e157fe5b906000526020600020906004020160030160006101000a81548160ff02191690831515021790555060019150611217565b600091505b50919050565b600080828401905083811015151561123157fe5b8091505092915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061127c57805160ff19168380011785556112aa565b828001600101855582156112aa579182015b828111156112a957825182559160200191906001019061128e565b5b5090506112b791906112bb565b5090565b6112dd91905b808211156112d95760008160009055506001016112c1565b5090565b905600a165627a7a723058200a7a974007e4a9ce2829e2388217263a115ad8ec56b662d708e5d584f031550f0029',
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

  async buyOption(asset: string, exercisePrice: number, expirationDate: number, premium: number) {
    // letting the user know that the transaction has been sent
    console.log('Buying the option contract; this may take a while...');
    // sending the transaction to our contract
    return new Promise((resolve, reject) => {
      this.optionFactory.buyOption.sendTransaction(
        asset, exercisePrice, expirationDate,
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
            console.log('Transaction sent successfully!');
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
   async getOptionPremium(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.optionFactory.calculateOptionPremium(
        id,
        function (error, premium) {
          if (error) {
            alert(error);
            return;
          } else {
            resolve(premium);
          }
        });
    }) as Promise<number>;
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
