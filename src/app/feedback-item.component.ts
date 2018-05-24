import { Component, Input, OnInit } from '@angular/core';
import { Item, Feedback, ItemService } from './shared/services/item.service';
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
  item: Item;
  feedbackUser: User;

  constructor( private userService: UserService,
               private itemService: ItemService,
               private router: Router,
               private route: ActivatedRoute,
               public http: HttpClient) {}

  ngOnInit(): void {
    this.feedbackPercentage = this.feedback.rating * 20;
    this.getItem(this.feedback.auctionID);
  }

  visitProfile(): void {
    this.router.navigate(['/profile', this.feedback.userID]);
  }

  setItem(): void {
    this.itemService.setItem(this.item);
  }

  getItem(auctionID: number): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = { auctionID: auctionID },
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_item.php';

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
        'https://php-group30.azurewebsites.net/retrieve_user.php';

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
