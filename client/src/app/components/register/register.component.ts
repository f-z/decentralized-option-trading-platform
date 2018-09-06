import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ContractsService } from '../../services/contract.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form;
  message;
  messageClass;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;

  isSeller: any;

  constructor(
    public contractService: ContractsService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm(); // creating registration form when component loads
  }

  registerWithRegistrySmartContract(): void {
    this.contractService.register(this.form.controls['username'].value);
  }

  listeningForRegistrationEvents(data: any): void {
    // tslint:disable-next-line:prefer-const
    let __this = this;
    // tslint:disable-next-line:prefer-const
    let __data = data;

    // Event that signifies success of registration process
    const registeredEvent = __this.contractService.registry.Registered(
      { filter: { account: __this.contractService.account } },
      function (error, registrationInfo) {
        if (error) {
          return;
        }

        console.log('Seller registered with registry smart contract');
        console.log('Name: ' + registrationInfo.args.name);
        console.log('Account address: ' + registrationInfo.args.account);

        __this.goToLogin(__data);
      }
    );
  }

  // Function to create registration form
  createForm() {
    this.form = this.formBuilder.group({
      // Email input
      email: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(5), // Minimum length is 5 characters
        Validators.maxLength(30), // Maximum length is 30 characters
        this.validateEmail // Custom validation
      ])],
      // Username input
      region: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(3), // Minimum length is 3 characters
        Validators.maxLength(35) // Maximum length is 35 characters
      ])],
      // Username input
      username: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(3), // Minimum length is 3 characters
        Validators.maxLength(15), // Maximum length is 15 characters
        this.validateUsername // Custom validation
      ])],
      // Password input
      password: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(8), // Minimum length is 8 characters
        Validators.maxLength(35), // Maximum length is 35 characters
        this.validatePassword // Custom validation
      ])],
      // Confirm password input
      confirm: ['', Validators.required], // Field is required
      'isSeller': new FormControl('')
    }, { validator: this.matchingPasswords('password', 'confirm') }); // Add custom validator to form for matching passwords
  }

  // Function to disable the registration form
  disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['region'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }

  // Function to enable the registration form
  enableForm() {
    this.form.controls['email'].enable();
    this.form.controls['region'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }

  // Function to validate e-mail is proper format
  validateEmail(controls) {
    // Create a regular expression
    // tslint:disable-next-line:max-line-length
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // Testing email against regular expression
    if (regExp.test(controls.value)) {
      return null; // Returning as valid email
    } else {
      return { 'validateEmail': true }; // Returning as invalid email
    }
  }

  // Function to validate username is proper format
  validateUsername(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    // Test username against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid username
    } else {
      return { 'validateUsername': true }; // Return as invalid username
    }
  }

  // Function to validate password
  validatePassword(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    // Test password against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid password
    } else {
      return { 'validatePassword': true }; // Return as invalid password
    }
  }

  // Funciton to ensure passwords match
  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      // Check if both fields are the same
      if (group.controls[password].value === group.controls[confirm].value) {
        return null; // Return as a match
      } else {
        return { 'matchingPasswords': true }; // Return as error: do not match
      }
    };
  }

  // function to submit form
  onRegisterSubmit() {
    this.processing = true; // used to notify HTML that form is in processing, so that it can be disabled
    this.disableForm(); // disabling the form
    // creating user object form user's inputs
    const user = {
      email: this.form.get('email').value, // e-mail input field
      region: this.form.get('region').value,
      username: this.form.get('username').value, // username input field
      password: this.form.get('password').value // password input field
    };

    // function from authentication service to register user
    this.authService.registerUser(user).subscribe(data => {
      // response from registration attempt
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // setting an error class
        this.message = data.message; // setting an error message
        this.processing = false; // re-enabling submit button
        this.enableForm(); // re-enabling form
      } else {
        if (!this.form.controls['isSeller'].value) { // if not an seller, then go straight to login page
          this.goToLogin(data);
        } else { // if seller, then register with registry smart contract
          this.registerWithRegistrySmartContract();
          // and wait for event confirmation
          this.listeningForRegistrationEvents(data);
        }
      }
    });
  }

  goToLogin(data: any) {
    // tslint:disable-next-line:prefer-const
    let __this = this;

    this.messageClass = 'alert alert-success'; // setting a success class
    this.message = data.message; // setting a success message
    // after 2 second timeout, navigate to the login page
    setTimeout(() => {
      __this.router.navigate(['/login']); // redirecting to login view
    }, 2000);
  }

  // function to check if e-mail is taken
  checkEmail() {
    // Function from authentication file to check if e-mail is taken
    this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
      // Check if success true or false was returned from API
      if (!data.success) {
        this.emailValid = false; // Return email as invalid
        this.emailMessage = data.message; // Return error message
      } else {
        this.emailValid = true; // Return email as valid
        this.emailMessage = data.message; // Return success message
      }
    });
  }

  // Function to check if username is available
  checkUsername() {
    // Function from authentication file to check if username is taken
    this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
      // Check if success true or success false was returned from API
      if (!data.success) {
        this.usernameValid = false; // Return username as invalid
        this.usernameMessage = data.message; // Return error message
      } else {
        this.usernameValid = true; // Return username as valid
        this.usernameMessage = data.message; // Return success message
      }
    });
  }

  ngOnInit() {
  }
}
