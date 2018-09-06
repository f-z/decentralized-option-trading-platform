import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ContractsService } from '../../services/contract.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username = '';
  email = '';

  isSeller: boolean;

  accountAddress = '';
  factoryAddress = '';

  markupPercentage: number;

  constructor(
    private authService: AuthService,
    public contractService: ContractsService
  ) {
  }

  ngOnInit() {
    // tslint:disable-next-line:prefer-const
    let __this = this;

    // once component loads, getting user's data to display on profile
    __this.authService.getProfile().subscribe(profile => {
      __this.username = profile.user.username; // setting username
      __this.email = profile.user.email; // setting e-mail
    });

    __this.isSeller = true;

    __this.contractService.getAccount().then(account => {
      __this.accountAddress = account;

      // checking for factory deployment
      __this.contractService
        .checkFactoryDeployment(__this.contractService.selectedOptionFactoryId)
        .then(address => {
          __this.factoryAddress = address;
        });

      __this.contractService
        .getSellerByAddress(__this.accountAddress)
        .then(seller => {
          // logging for demonstration and debugging purposes
          console.log('Account information from registry: ' + seller);
          // if the account is not an seller
          if (seller[0] === '') {
            __this.isSeller = false;
          } else {
            __this.username = seller[0];
            __this.accountAddress = seller[1];
            __this.factoryAddress = seller[2];
          }
        });
    });
  }

  /**
   * deploying new factory version
   */
  createFactory() {
    // tslint:disable-next-line:prefer-const
    let __this = this;

    __this.contractService
      .deployFactory(__this.markupPercentage)
      .then(factoryAddress => {
        __this.contractService.setFactoryAddress(factoryAddress);
      });
  }
}
