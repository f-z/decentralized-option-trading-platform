import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserService } from './shared/services/user.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {
  Listing,
  ListingService,
  Bid
} from './shared/services/listing.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.css']
})
export class FeedbackComponent implements OnInit {
  @Input() user: User;
  @Input() buyerID: number;
  @Input() subject: string;
  @Input() item: Listing;
  comment: string;
  rating: number;

  constructor(
    public dialog: MatDialog,
    public userService: UserService,
    public itemService: ListingService,
    public http: HttpClient,
    public router: Router
  ) {}

  ngOnInit(): void {}

  insertFeedback(): void {
    if (!this.rating) {
      this.openDialog(
          'Please rate your experience:', '', true);
    } else {
       if (this.user.username === this.item.sellerUsername) {
        this.insertSellerFeedback();
      } else {
        this.insertBuyerFeedback();
      }
    }
  }

  insertBuyerFeedback(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        sellerUsername: this.item.sellerUsername,
        buyerID: this.buyerID,
        buyerComment: this.comment,
        buyerRating: this.rating,
        auctionID: this.item.auctionID
      },
      url: any =
        'https://okergo.azurewebsites.net/php/insert_buyer_feedback.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        // If the request was successful, notify the user.
        this.openDialog('Thank you for your feedback.', '', true);
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog(
          'Oops! Something went wrong; redirecting you to safety...',
          '',
          false
        );
      }
    );
    return null;
  }

  insertSellerFeedback(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        sellerID: this.item.sellerUsername,
        buyerID: this.buyerID,
        sellerComment: this.comment,
        sellerRating: this.rating,
        auctionID: this.item.auctionID
      },
      url: any =
        'https://okergo.azurewebsites.net/php/insert_seller_feedback.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        // If the request was successful, notify the user.
        this.openDialog('Thank you for your feedback.', '', true);
        document.getElementById('feedback-box').style.display = 'none';
      },
      (error: any) => {
        // If there is an error, return to main search page.
        this.openDialog(
          'Oops! Something went wrong; redirecting you to safety...',
          '',
          false
        );
      }
    );
    return null;
  }

  openDialog(message: string, username: string, succeeded: boolean): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message: message,
        username: username
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!succeeded) {
        this.router.navigate(['/search']);
      } else {
        window.location.reload();
      }
    });
  }
}
