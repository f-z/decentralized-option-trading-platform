import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ContractsService } from '../../services/contract.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private optionFactoryId: number;

  username = '';
  email = '';

  accountAddress = '';
  factoryAddress = '';

  markupPercentage: number;

  constructor(
    private authService: AuthService,
    public contractService: ContractsService
  ) {
    this.optionFactoryId = 0;

    contractService.getAccount().then(account => {
      this.accountAddress = account;

      // checking for factory deployment
      contractService.checkFactoryDeployment(this.optionFactoryId).then(address => {
        this.factoryAddress = address;
      });

      contractService.getInstitutionByAddress(this.accountAddress).then(institution => {
        this.username = institution[0];
        this.accountAddress = institution[1];
        this.factoryAddress = institution[2];
      });
    });
  }

  ngOnInit() {
    // once component loads, getting user's data to display on profile
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // setting username
      this.email = profile.user.email; // setting e-mail
    });
  }

  /**
   * deploying new factory version
   */
  createFactory() {
    this.contractService.deployFactory(this.markupPercentage).then(factoryAddress => {
      this.contractService.setFactoryAddress(factoryAddress);
    });
  }
}
