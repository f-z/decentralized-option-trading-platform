import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Listing, ListingService } from './shared/services/listing.service';
import { User, UserService } from './shared/services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { query } from '@angular/animations';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog.component';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-home',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  listing: Listing;
  listings: Observable<Listing[]> = null;
  recommendedItems: Observable<Listing[]> = null;
  public selectedCategory: string;
  user: User;
  term: string;
  categories: any;

  constructor(
    public itemService: ListingService,
    public userService: UserService,
    public dialog: MatDialog,
    public router: Router,
    public http: HttpClient
  ) {}

  ngOnInit(): void {
    this.user = this.getUser();
    this.term = 'All';
    // this.getListings();

    if (this.user != null) {
      // this.getUserRecommendations();
    }
  }

  getListings(): void {
    this.http
      .get(
        'https://okergo.azurewebsites.net/php/retrieve_all_listings.php'
      )
      .subscribe(
        (data: any) => {
          this.listings = data;
          for (let i = 0; i < data.length; i++) {
            // Format the end date and time.
            const endDate = new Date(this.listings[i].endTime).getTime();
            const now = new Date().getTime();
            // Find the distance between now and the end date.
            const distance = endDate - now;
          }
        },
        (error: any) => {
          console.dir(error);
        }
      );
  }

  getUserRecommendations(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = { userID: this.user.username },
      url: any =
        'https://okergo.azurewebsites.net/php/get_user_recommendations.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        if (data != null && data.length > 0) {
          this.recommendedItems = data;
          if (this.recommendedItems != null) {
            this.term = null;
          }
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
    return null;
  }

  setListing(listing: Listing): void {
    this.itemService.setListing(listing);

    if (this.user === null) {
      this.router.navigate(['/eisodos']);
    } else {
      this.router.navigate(['/aggelies', listing.title]);
    }
  }

  selectCategory(category): void {
    this.term = category;
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
    this.openDialog('Logging you out...', '', true);
  }

  openDialog(message: string, username: string, succeeded: boolean): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message: message,
        username: username
      }
    });

    dialogRef.afterOpen().subscribe(result => {
      setTimeout(dialogRef.close(), 4000);
    });

    dialogRef.afterClosed().subscribe(result => {
      if (succeeded) {
        this.user = null;
        this.setUser(null);
      }
    });
  }
}
