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

  accountAddress = '';
  factoryAddress = '';

  constructor(
    private authService: AuthService,
    public contractService: ContractsService
  ) {
    contractService.getAccount().then(account => {
      this.accountAddress = account;

      // checking for factory deployment
      contractService.checkFactoryDeployment().then(address => {
        this.factoryAddress = address;
      });

      contractService.getFactoryByAddress(this.accountAddress).then(institution => {
        this.username = institution[0];
        this.accountAddress = institution[1];
        this.factoryAddress = institution[2];
      });
    });
  }

  ngOnInit() {
    // Once component loads, get user's data to display on profile
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Set username
      this.email = profile.user.email; // Set e-mail
    });
  }

  /**
   * deploying new factory version
   */
  createFactory() {
    this.contractService.deployFactory(20);
  }
}
