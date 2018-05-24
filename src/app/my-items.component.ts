import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Item, ItemService } from './shared/services/item.service';
import { User, UserService } from './shared/services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.html',
  styleUrls: ['./my-items.scss']
})
export class MyItemsComponent implements OnInit {
  item: Item;
  userAuctions: Observable<Item[]> = null;
  userTopBids: Observable<Item[]> = null;
  userWatching: Observable<Item[]> = null;
  userOutbid: Observable<Item[]> = null;

  private user: User;

  constructor(
    private userService: UserService,
    private itemService: ItemService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.user = this.getUser();

    this.getItems();
  }

  additem(): void {
    this.itemService.setItem(null);
    this.router.navigate(['add-item']);
  }

  getItems(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        userID: this.user.userID,
        includeExpired: true
      },
      url: any =
        'https://php-group30.azurewebsites.net/retrieve_user_items.php';

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

  setItem(item: Item): void {
    this.itemService.setItem(item);
  }

  getUser(): User {
    return this.userService.getUser();
  }

  setUser(user: User): void {
    this.userService.setUser(user);
  }

  goToMyProfile(): void {
    this.router.navigate(['/profile', this.user.userID]);
  }

  logout(): void {
    this.user = null;
    this.setUser(null);
    this.router.navigate(['/search']);
  }
}
