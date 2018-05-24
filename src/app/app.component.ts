import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Listing, ListingService } from './shared/services/listing.service';
import { User, UserService } from './shared/services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatIconRegistry } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { DomSanitizer } from '@angular/platform-browser';
import { query } from '@angular/animations';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog.component';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  listing: Listing;
  items: Observable<Listing[]> = null;
  recommendedItems: Observable<Listing[]> = null;
  public selectedCategory: string;
  private user: User;
  private term: string;
  categories: any;

  constructor(
    private itemService: ListingService,
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'car',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/car.svg')
    );
    iconRegistry.addSvgIcon(
      'book',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/book.svg')
    );
    iconRegistry.addSvgIcon(
      'fashion',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/clothes.svg')
    );
    iconRegistry.addSvgIcon(
      'sports',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/ball.svg')
    );
    iconRegistry.addSvgIcon(
      'home',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/home.svg')
    );
    iconRegistry.addSvgIcon(
      'collectables',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/collectables.svg')
    );
  }

  ngOnInit(): void {
    this.user = this.getUser();
    this.term = 'All';
    this.getItems();

    if (this.user != null) {
      this.getUserRecommendations();
    }
  }

  getItems(): void {
    this.http
      .get(
        'https://okergo.azurewebsites.net/php/retrieve_all_listings.php'
      )
      .subscribe(
        (data: any) => {
          this.items = data;
          for (let i = 0; i < data.length; i++) {
            // Format the end date and time.
            const endDate = new Date(this.items[i].endTime).getTime();
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

  setItem(listing: Listing): void {
    this.itemService.setListing(listing);

    if (this.user === null) {
      this.router.navigate(['/login']);
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
    this.router.navigate(['/profile', this.user.username]);
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
