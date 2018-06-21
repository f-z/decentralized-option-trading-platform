import { Component } from '@angular/core';
import { PriceApiService } from './services/priceApi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  yesterday: string;
  web3: any;

  constructor(private priceService: PriceApiService) {
    const today = new Date();
    let day = (today.getDate() - 1).toString();
    let month = (today.getMonth() + 1).toString();
    const year = today.getFullYear().toString();

    if (today.getDate() < 10) {
      day = '0' + today.getDate();
    }

    if ((today.getMonth() + 1) < 10) {
      month = '0' + (today.getMonth() + 1);
    }

    this.yesterday = year + '-' + month + '-' + day;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.priceService.getCurrentPrice('BTC', this.yesterday);
    // if (typeof this.web3 !== 'undefined') {
    // this.web3 = new Web3(this.web3.currentProvider);
    // } else {
    // set the provider you want from Web3.providers
    //   this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    //  }

    // console.log(this.web3);
  }
}
