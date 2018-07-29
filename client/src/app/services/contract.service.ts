import Web3 from 'web3';
import { Injectable } from '@angular/core';

declare let require: any;
declare let window: any;

@Injectable()
export class ContractsService {
  private account: string = null;
  private web3: any;
  private optionFactoryABI = require('./tokenContract.json');

  private optionFactoryContract: any;
  private optionFactory: any;
  private optionFactoryAddress: string;

  constructor() {
    this.optionFactoryAddress = '0x39134a82783cd2976be9099b1d92553d5ecd8dc0';
    // this.optionFactoryABI = JSON.parse(this.optionFactoryABI);

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
            console.log('Contract not deployed');
            this.deployContract().then(address => {
              resolve(address);
            });
          } else {
            console.log('Contract already deployed');
            resolve(this.optionFactoryAddress);
          }
        } else {
          alert(error);
          return;
        }
      });
    });
  }

  async deployContract(): Promise<string> {
    console.log('Deploying contract...');
    this.optionFactoryContract = this.web3.eth.contract(this.optionFactoryABI);
    this.optionFactory = (await new Promise((resolve, reject) => {
      this.optionFactoryContract.new(
        {
          from: this.web3.eth.accounts[0],
          // tslint:disable-next-line:max-line-length
          data: '0x6080604052670de0b6b3a7640000600555336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610e108061005f6000396000f3006080604052600436106100a4576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806307cadeec146100a957806312065fe01461010057806324ad848e1461012b578063409e22051461015857806351826dbd1461020c5780638da5cb5b146102a4578063d0e30db0146102fb578063f2fde38b14610305578063f3fef3a314610348578063fea33db214610395575b600080fd5b3480156100b557600080fd5b506100ea600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506103d7565b6040518082815260200191505060405180910390f35b34801561010c57600080fd5b50610115610425565b6040518082815260200191505060405180910390f35b34801561013757600080fd5b506101566004803603810190808035906020019092919050505061046c565b005b34801561016457600080fd5b50610183600480360381019080803590602001909291905050506104d1565b6040518080602001848152602001838152602001828103825285818151815260200191508051906020019080838360005b838110156101cf5780820151818401526020810190506101b4565b50505050905090810190601f1680156101fc5780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b34801561021857600080fd5b5061024d600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506105a2565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b83811015610290578082015181840152602081019050610275565b505050509050019250505060405180910390f35b3480156102b057600080fd5b506102b96106d4565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103036106f9565b005b34801561031157600080fd5b50610346600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610759565b005b34801561035457600080fd5b50610393600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506108ae565b005b6103d56004803603810190808035906020019082018035906020019190919293919293908035906020019092919080359060200190929190505050610a7d565b005b600080600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905080915050919050565b6000600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905090565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156104c757600080fd5b8060058190555050565b6001818154811015156104e057fe5b9060005260206000209060030201600091509050806000018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561058c5780601f106105615761010080835404028352916020019161058c565b820191906000526020600020905b81548152906001019060200180831161056f57829003601f168201915b5050505050908060010154908060020154905083565b606080600080600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040519080825280602002602001820160405280156106165781602001602082028038833980820191505090505b50925060009150600090505b6001805490508110156106c9578473ffffffffffffffffffffffffffffffffffffffff166002600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156106bc578083838151811015156106a557fe5b906020019060200201818152505081806001019250505b8080600101915050610622565b829350505050919050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600554341015151561070a57600080fd5b34600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156107b457600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141515156107f057600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b3373ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16148015610928575080600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410155b151561093357600080fd5b80600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055508173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501580156109c6573d6000803e3d6000fd5b507fdf273cb619d95419a9cd0ec88123a0538c85064229baa6363788f743fff90deb8282600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001935050505060405180910390a15050565b600060018060606040519081016040528088888080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050508152602001868152602001854201815250908060018154018082558091505090600182039060005260206000209060030201600090919290919091506000820151816000019080519060200190610b19929190610d3f565b5060208201518160010155604082015181600201555050039050336002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610bd86001600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054610d2190919063ffffffff16565b600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555034600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055507facdca046fc2bbd753a96081d8f4226b3ae19626f351c335ce373a661612efceb8133600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054604051808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a15050505050565b6000808284019050838110151515610d3557fe5b8091505092915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610d8057805160ff1916838001178555610dae565b82800160010185558215610dae579182015b82811115610dad578251825591602001919060010190610d92565b5b509050610dbb9190610dbf565b5090565b610de191905b80821115610ddd576000816000905550600101610dc5565b5090565b905600a165627a7a72305820ff572a0bfa1284ddb9bda221d1b4515ab0dcb18c14b497623cba3f1c3c280fa10029',
          gas: '4700000'
        },
        function (e, contract) {
          if (typeof contract.address !== 'undefined') {
            console.log('Contract mined');
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

    console.log(this.optionFactoryAddress);
    return Promise.resolve(this.optionFactoryAddress);
  }

  async getAccount(): Promise<string> {
    if (this.account == null) {
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
    const account = await this.getAccount();
    const contract = this.web3.eth.contract(this.optionFactoryABI);
    const contractInstance = contract.at(this.optionFactoryAddress);

    return new Promise((resolve, reject) => {
      const web3 = this.web3;
      contractInstance.getOptionCount.call(account, function (error, result) {
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
    const account = await this.getAccount();
    const contract = this.web3.eth.contract(this.optionFactoryABI);
    const contractInstance = contract.at(this.optionFactoryAddress);

    return new Promise((resolve, reject) => {
      const web3 = this.web3;
      contractInstance.getBalance.call(function (error, result) {
        if (error) {
          alert(error);
          return;
        } else {
          resolve(web3.fromWei(result));
        }
      });
    }) as Promise<number>;
  }

  async deposit(amount: number) {
    const account = await this.getAccount();
    const contract = this.web3.eth.contract(this.optionFactoryABI);
    const contractInstance = contract.at(this.optionFactoryAddress);

    // letting the user know that the transaction has been sent
    console.log('Sending your deposit; this may take a while...');
    // sending the transaction to our contract
    return new Promise((resolve, reject) => {
      const web3 = this.web3;
      contractInstance.deposit.sendTransaction(
        {
          from: web3.eth.accounts[0],
          gas: 4000000,
          value: amount
        },
        function (error, transactionHash) {
          // getting the transaction hash as callback from the function
          if (error) {
            alert(error);
            return;
          } else {
            console.log('Successful deposit');
            console.log('Transaction hash: ' + transactionHash);
          }
        }
      );
    });
  }

  async setMinimumDepositAmount(minimumAmount: number) {
    const account = await this.getAccount();
    const contract = this.web3.eth.contract(this.optionFactoryABI);
    const contractInstance = contract.at(this.optionFactoryAddress);

    // letting the user know that the transaction has been sent
    console.log('Setting minimum deposit amount...');
    // sending the transaction to our contract
    return new Promise((resolve, reject) => {
      const web3 = this.web3;
      contractInstance.setMinimumDepositValue.sendTransaction(minimumAmount,
        {
          from: web3.eth.accounts[0],
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

  async createOption(asset: string, exercisePrice: number, timeToExpiration: number, premium: number) {
    const account = await this.getAccount();
    const contract = this.web3.eth.contract(this.optionFactoryABI);
    const contractInstance = contract.at(this.optionFactoryAddress);

    // letting the user know that the transaction has been sent
    console.log('Creating the option contract; this may take a while...');
    // sending the transaction to our contract
    return new Promise((resolve, reject) => {
      const web3 = this.web3;
      contractInstance.createOption.sendTransaction(
        asset, exercisePrice, timeToExpiration,
        {
          from: web3.eth.accounts[0],
          gas: 4000000,
          value: premium
        },
        function (error, transactionHash) {
          // getting the transaction hash as callback from the function
          if (error) {
            alert(error);
            return;
          } else {
            console.log('Option contract created successfully!');
            console.log('Transaction hash: ' + transactionHash);
          }
        }
      );
    });
  }
}
