import Web3 from 'web3';
import { Injectable } from '../../../node_modules/@angular/core';

declare let require: any;
declare let window: any;

@Injectable()
export class ContractsService {
  private _account: string = null;
  private web3: any;
  private tokenABI = require('./tokenContract.json');

  private _tokenContract: any;
  private _tokenContractAddress = '0xbc84f3bf7dd607a37f9e5848a6333e6c188d926c';

  constructor() {
    // this.tokenAbi = JSON.parse(this.tokenAbi);
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);

      if (this.web3.version.network !== '4') {
        alert('Please connect to the Rinkeby network!');
      }
    } else {
      console.warn(
        'Please use a DApp browser like Mist or the MetaMask plugin for Chrome!'
      );
    }

    this._tokenContract = this.web3.eth.contract(this.tokenABI).at(this._tokenContractAddress);
  }

  private async getAccount(): Promise<string> {
    if (this._account == null) {
      this._account = await new Promise((resolve, reject) => {
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

      this.web3.eth.defaultAccount = this._account;
    }

    return Promise.resolve(this._account);
  }

  public async getUserBalance(): Promise<number> {
    const account = await this.getAccount();

    return new Promise((resolve, reject) => {
      const web3 = this.web3;
      this._tokenContract.balanceOf.call(account, function (err, result) {
        if (err != null) {
          reject(err);
        }

        resolve(web3.fromWei(result));
      });
    }) as Promise<number>;
  }
}
