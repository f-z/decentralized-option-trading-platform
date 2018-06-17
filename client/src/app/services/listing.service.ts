import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class ListingService {
  options;
  domain = this.authService.domain;

  constructor(private authService: AuthService, private http: Http) {}

  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
    this.authService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        authorization: this.authService.authToken // Attach token
      })
    });
  }

  // Function to create a new listing post
  newListing(listing) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http
      .post(this.domain + 'listings/newListing', listing, this.options)
      .map(res => res.json());
  }

  // Function to get all listings from the database
  getAllListings() {
    this.createAuthenticationHeaders(); // Create headers
    return this.http
      .get(this.domain + 'listings/allListings', this.options)
      .map(res => res.json());
  }

  // Function to get the listing using the id
  getSingleListing(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http
      .get(this.domain + 'listings/singleListing/' + id, this.options)
      .map(res => res.json());
  }

  // Function to edit/update listing post
  editListing(listing) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http
      .put(this.domain + 'listings/updateListing/', listing, this.options)
      .map(res => res.json());
  }

  // Function to delete a listing
  deleteListing(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http
      .delete(this.domain + 'listings/deleteListing/' + id, this.options)
      .map(res => res.json());
  }

  // Function to like a listing post
  likeListing(id) {
    const listingData = { id: id };
    return this.http
      .put(this.domain + 'listings/likeListing/', listingData, this.options)
      .map(res => res.json());
  }

  // Function to dislike a listing post
  dislikeListing(id) {
    const listingData = { id: id };
    return this.http
      .put(this.domain + 'listings/dislikeListing/', listingData, this.options)
      .map(res => res.json());
  }

  // Function to post a comment on a listing post
  postComment(id, comment) {
    this.createAuthenticationHeaders(); // Create headers
    // Create listingData to pass to back-end
    const listingData = {
      id: id,
      comment: comment
    };
    return this.http
      .post(this.domain + 'listings/comment', listingData, this.options)
      .map(res => res.json());
  }
}
