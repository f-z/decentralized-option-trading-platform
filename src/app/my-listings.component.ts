import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Listing, ListingService } from './shared/services/listing.service';
import { User, UserService } from './shared/services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatTabsModule} from '@angular/material/tabs';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.html',
  styleUrls: ['./my-listings.scss']
})
export class MyListingsComponent implements OnInit {
  listing: Listing;
  userAuctions: Observable<Listing[]> = null;
  userTopBids: Observable<Listing[]> = null;
  userWatching: Observable<Listing[]> = null;
  userOutbid: Observable<Listing[]> = null;

  private user: User;

  constructor(
    private userService: UserService,
    private listingService: ListingService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.user = this.getUser();

    this.getItems();
  }

  addListing(): void {
    this.listingService.setListing(null);
    this.router.navigate(['add-item']);
  }

  getItems(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        username: this.user.username,
        includeExpired: true
      },
      url: any =
        'https://okergo.azurewebsites.net/php/retrieve_user_items.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        this.userAuctions = data.auctions;

        this.userTopBids = data.topbids;

        this.userWatching = data.watching;

        this.userOutbid = data.outbid;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  setListing(listing: Listing): void {
    this.listingService.setListing(listing);
  }

  getUser(): User {
    return this.userService.getUser();
  }

  setUser(user: User): void {
    this.userService.setUser(user);
  }

  goToMyProfile(): void {
    this.router.navigate(['/profil', this.user.username]);
  }

  logout(): void {
    this.user = null;
    this.setUser(null);
    this.router.navigate(['/anazitisi']);
  }
}
