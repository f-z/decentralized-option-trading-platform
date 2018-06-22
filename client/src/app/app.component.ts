import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  web3: any;

  constructor() {
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    // if (typeof this.web3 !== 'undefined') {
    // this.web3 = new Web3(this.web3.currentProvider);
    // } else {
    // set the provider you want from Web3.providers
    //   this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    //  }

    // console.log(this.web3);
  }
}
