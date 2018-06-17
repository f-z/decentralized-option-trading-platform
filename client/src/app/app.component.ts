import { Component } from '@angular/core';
import { UserApiService } from './user-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  web3: any;

  constructor(private users: UserApiService) {
    // default values
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    // this.getAllData(this.term, this.minDate, this.maxDate);
    // if (typeof this.web3 !== 'undefined') {
    // this.web3 = new Web3(this.web3.currentProvider);
    // } else {
    // set the provider you want from Web3.providers
    //   this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    //  }

    console.log(this.web3);
  }
}
