import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ContractsService } from '../../services/contract.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private currentAccount: string;

  username = '';
  email = '';

  constructor(
    private authService: AuthService,
    contractService: ContractsService
  ) {
    contractService.getAccount().then(value => this.currentAccount = value);

    // deploying new factory version
    // this.contractService.deployFactory();
  }

  ngOnInit() {
    // Once component loads, get user's data to display on profile
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Set username
      this.email = profile.user.email; // Set e-mail
    });
  }

}
