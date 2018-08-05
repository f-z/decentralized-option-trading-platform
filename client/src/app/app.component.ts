import { Component } from '@angular/core';
import { ContractsService } from './services/contract.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  web3: any;

  constructor(public contractService: ContractsService) {
    this.contractService.getAccount().then(account => {
      // checking for registry deployment
      this.contractService
        .checkRegistryDeployment().then(result => {
          // deploying new registry version
          // this.contractService.deployRegistry();

          this.contractService.registry.getAveragePrice('0xde42bbf67a6afc53e7da5060f8090779f3632711',
          '0x08e2491fcdb2f301e794391d60abbdf5f5a123a3', '0xd286d9c2547d92d3b69127c1894bd8fbe8acc4a4',
            {
              from: account,
              gas: 4000000,
              value: this.contractService.web3.toWei(0.01, 'ether')
            },
            function (error, transactionHash) {
              // getting the transaction hash as callback from the function
              if (error) {
                alert(error);
                return;
              } else {
                console.log('Price is being requested from the three oracles...');
                console.log('Transaction hash: ' + transactionHash);
              }
            });
        });
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    // Event that signifies that the registry has received the price from the oracle
    const registryPriceEvent = this.contractService.registry.AverageOraclePrice(function (
      error,
      price
    ) {
      if (error) {
        return;
      }
      console.log('The registry has successfully received the prices from the oracles and calculated the weighted average!');
      console.log('Latest price average: ' + price.args.price);
    });

    // if (typeof this.web3 !== 'undefined') {
    // this.web3 = new Web3(this.web3.currentProvider);
    // } else {
    // set the provider you want from Web3.providers
    //   this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    //  }

    // console.log(this.web3);
  }
}
