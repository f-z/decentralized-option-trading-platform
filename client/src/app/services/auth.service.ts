import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  // domain = ""; // Production
  domain = environment.domain;
  authToken;
  user;
  options;

  constructor(private http: Http) {}

  // Function to create headers and add token; to be used in HTTP requests
  createAuthenticationHeaders() {
    this.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Setting format to JSON
        authorization: this.authToken // Attaching token
      })
    });
  }

  // Function to get token from client local storage
  loadToken() {
    this.authToken = localStorage.getItem('token'); // Getting token and assigning to variable to be used elsewhere
  }

  // Function to register user accounts
  registerUser(user) {
    return this.http
      .post(this.domain + 'authentication/register', user)
      .map(res => res.json());
  }

  // Function to check if username is taken
  checkUsername(username) {
    return this.http
      .get(this.domain + 'authentication/checkUsername/' + username)
      .map(res => res.json());
  }

  // Function to check if e-mail is taken
  checkEmail(email) {
    return this.http
      .get(this.domain + 'authentication/checkEmail/' + email)
      .map(res => res.json());
  }

  // Function to login user
  login(user) {
    return this.http
      .post(this.domain + 'authentication/login', user)
      .map(res => res.json());
  }

  // Function to logout
  logout() {
    this.authToken = null; // Setting token to null
    this.user = null; // Setting user to null
    localStorage.clear(); // Clearing local storage
  }

  // Function to store user's data in client local storage
  storeUserData(token, user) {
    localStorage.setItem('token', token); // Setting token in local storage
    localStorage.setItem('user', JSON.stringify(user)); // Setting user in local storage as string
    this.authToken = token; // Assigning token to be used elsewhere
    this.user = user; // Setting user to be used elsewhere
  }

  // Function to get user's profile data
  getProfile() {
    this.createAuthenticationHeaders(); // Creating headers before sending to API
    return this.http
      .get(this.domain + 'authentication/profile', this.options)
      .map(res => res.json());
  }

  // Function to get public profile data
  getPublicProfile(username) {
    this.createAuthenticationHeaders(); // Creating headers before sending to API
    return this.http
      .get(
        this.domain + 'authentication/publicProfile/' + username,
        this.options
      )
      .map(res => res.json());
  }

  // Function to check if user is logged in
  loggedIn() {
    return tokenNotExpired();
  }
}
