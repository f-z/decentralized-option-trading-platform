import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { DialogComponent } from './dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { User, UserService } from './shared/services/user.service';
import { Listing, ListingService } from './shared/services/listing.service';
import { Category } from './shared/services/listing.service';
import { FileUploader } from 'ng2-file-upload';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.html',
  styleUrls: ['./add-listing.css']
})
export class AddListingComponent implements OnInit {
  listing: Listing;
  user: User;

  name: string;
  description: string;
  condition: string;
  category: string;
  photo: string;

  categories: Observable<Category[]> = null;
  selectedCategory: string;

  public uploader1: FileUploader = new FileUploader({
    url: 'https://okergo.azurewebsites.net/php/upload_image.php',
    itemAlias: 'photo'
  });

  constructor(
    public userService: UserService,
    public listingService: ListingService,
    public http: HttpClient,
    public dialog: MatDialog,
    public router: Router
  ) {
    this.photo = null;
  }

  ngOnInit(): void {
    this.listing = this.listingService.getListing();
    this.name = this.listing.title;
    this.description = this.listing.description;
    this.photo = this.listing.photo;
    this.selectedCategory = this.listing.categoryName;

    this.user = this.getUser();
    this.getCategories();

    this.uploader1.onAfterAddingFile = file => {
      file.withCredentials = false;
      this.uploader1.uploadAll();
    };
    // Overriding the default onCompleteItem property of the uploader,
    // so we are able to deal with the server response.
    this.uploader1.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      this.photo = response.substring(1, response.length - 1);
    };
  }

  addListing(): void {
    let phpurl = '';
    if (!this.listing.title) {
      phpurl = 'https://okergo.azurewebsites.net/php/insert_listing.php';
    } else {
      phpurl = 'https://okergo.azurewebsites.net/php/update_listing.php';
    }

    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        name: this.name,
        description: this.description,
        condition: this.condition,
        categoryName: this.selectedCategory,
        photo: this.photo,
        sellerID: this.user.username,
        listingID: this.listing.listingID
      },
      url: any = phpurl;

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        this.addAuction(data);
      },
      (error: any) => {
        // If there is an error, notify the user.
        this.openDialog(
          'Something went wrong when adding the item, please try again!',
          '',
          false
        );
      }
    );
  }

  addAuction(itemID): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = {
        itemID: itemID,
        sellerUsername: this.user.username
      },
      url: any = 'https://okergo.azurewebsites.net/php/create_auction.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        // If the request was successful, notify the user.
        this.openDialog(
          'Congratulations, the item was added and the auction was created!',
          '',
          true
        );
      },
      (error: any) => {
        // If there is an error, notify the user.
        this.openDialog(
          'Something went wrong when creating the auction, please try again!',
          '',
          false
        );
      }
    );
  }

  getCategories(): void {
    this.http
      .get('https://okergo.azurewebsites.net/php/retrieve_categories.php')
      .subscribe(
        (data: any) => {
          this.categories = data;
        },
        (error: any) => {
          console.dir(error);
        }
      );
  }

  getUser(): User {
    return this.userService.getUser();
  }

  validate(): boolean {
    // If the details supplied are incomplete/incorrect, do not proceed with the transaction.
    const date = new Date(Date.now());
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const maxAuctionDate = new Date(year, month + 6, day);

    // If the details supplied are incomplete/incorrect, do not proceed with the transaction.
    if (
      this.name == null ||
      this.description == null ||
      this.condition == null
    ) {
      // If there are any empty fields, notify the user.
      this.openDialog('Please fill in all the fields!', '', false);
      return false;
    } else if (this.name.trim().length === 0) {
      this.openDialog('Please add your name', '', false);
      return false;
    } else if (this.description.trim().length === 0) {
      this.openDialog('Please add description', '', false);
      return false;
    } else if (this.condition.trim().length === 0) {
      this.openDialog('Please include item condition', '', false);
      return false;
    } else if (this.photo == null) {
      // If the user has not accepted the terms and conditions, do not allow them to proceed with registration.
      this.openDialog('Please add an item photo!', '', false);
      return false;
    }

    // If all the checks have passed, then proceed with uploading the image
    // and creating the registration record in the database.
    this.addListing();
    return true;
  }

  openDialog(message: string, name: string, succeeded: boolean): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message: message,
        username: name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (succeeded) {
        this.router.navigate(['/oi-aggelies-mou']);
      }
    });
  }

  setUser(user: User): void {
    this.userService.setUser(user);
  }

  goBack(): void {
    this.router.navigate(['/oi-aggelies-mou']);
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
