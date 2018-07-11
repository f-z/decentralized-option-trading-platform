import Web3 from 'web3';
import { Injectable } from '../../../node_modules/@angular/core';

declare let require: any;
declare let window: any;

@Injectable()
export class ContractsService {
  private _account: string = null;
  private _web3: any;
  tokenAbi = require('./tokenContract.json');

  private _tokenContract: any;
  private _tokenContractAddress = '0xbc84f3bf7dd607a37f9e5848a6333e6c188d926c';

  constructor() {
    // this.tokenAbi = JSON.parse(this.tokenAbi);
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this._web3 = new Web3(window.web3.currentProvider);

      if (this._web3.version.network !== '4') {
        alert('Please connect to the Rinkeby network');
      }
    } else {
      console.warn(
        'Please use a dapp browser like mist or MetaMask plugin for chrome'
      );
    }

    this._tokenContract = this._web3.eth.contract(this.tokenAbi).at(this._tokenContractAddress);
  }

  private async getAccount(): Promise<string> {
    if (this._account == null) {
      this._account = await new Promise((resolve, reject) => {
        this._web3.eth.getAccounts((err, accs) => {
          if (err != null) {
            alert('There was an error fetching your accounts.');
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

      this._web3.eth.defaultAccount = this._account;
    }

    return Promise.resolve(this._account);
  }

  public async getUserBalance(): Promise<number> {
    const account = await this.getAccount();

    return new Promise((resolve, reject) => {
      const _web3 = this._web3;
      this._tokenContract.balanceOf.call(account, function (err, result) {
        if (err != null) {
          reject(err);
        }

        resolve(_web3.fromWei(result));
      });
    }) as Promise<number>;
  }
}
