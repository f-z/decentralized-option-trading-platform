import { Component, Input, OnInit } from '@angular/core';
import { Listing, Feedback, ListingService } from './shared/services/listing.service';
import { User, UserService } from './shared/services/user.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-feedback-item',
  templateUrl: './feedback-item.html',
  styleUrls: ['./feedback-item.css']
})
export class FeedbackItemComponent implements OnInit {
  @Input() feedback: Feedback;
  feedbackPercentage: number;
  item: Listing;
  feedbackUser: User;

  constructor( private userService: UserService,
               private itemService: ListingService,
               private router: Router,
               private route: ActivatedRoute,
               public http: HttpClient) {}

  ngOnInit(): void {
    this.feedbackPercentage = this.feedback.rating * 20;
    this.getItem(this.feedback.listingID);
  }

  visitProfile(): void {
    this.router.navigate(['/profil', this.feedback.username]);
  }

  setItem(): void {
    this.itemService.setListing(this.item);
  }

  getItem(auctionID: number): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = { auctionID: auctionID },
      url: any =
        'https://okergo.azurewebsites.net/php/retrieve_item.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        if (data != null) {
          this.item = data;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
    return null;
  }

  getFeedbackUser(userID: number): void {
        const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        buyerID: userID,
      },
      url: any =
        'https://okergo.azurewebsites.net/php/retrieve_user.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
       this.feedbackUser = data;
      },
      (error: any) => {
        console.log(error);
      }
    );
    return null;
  }
}
