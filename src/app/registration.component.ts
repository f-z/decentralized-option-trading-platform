import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { DialogComponent } from './dialog.component';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.html',
  styleUrls: ['./registration.css']
})
export class RegistrationComponent implements OnInit {
  loginPage: string;

  userRole: string;
  firstName: string;
  lastName: string;
  region: string;
  username: string;
  email: string;
  password: string;
  confirmedPassword: string;
  phone: number;
  photo: string;
  registrationNumber: string;
  imageAdded: boolean;

  public uploader: FileUploader = new FileUploader({
    url: 'https://okergo.azurewebsites.net/php/upload_image.php',
    itemAlias: 'photo'
  });

  constructor(
    public http: HttpClient,
    public dialog: MatDialog,
    public router: Router
  ) {
    this.loginPage = 'false';
    this.imageAdded = false;
  }

  ngOnInit(): void {
    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
      this.imageAdded = true;
    };
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      this.photo = response.substring(1, response.length - 1);
      this.register();
    };
  }

  register(): void {
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options: any = {
        firstName: this.firstName,
        lastName: this.lastName,
        region: this.region,
        username: this.username,
        email: this.email,
        password: this.password,
        phone: this.phone,
        photo: this.photo,
        registrationNumber: this.registrationNumber
      },
      url: any = 'https://okergo.azurewebsites.net/php/register.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        // If the request was successful, notify the user
        this.openDialog(
          'Συγχαρητήρια, έγινε εγγραφή: ',
          this.username,
          true
        );
      },
      (error: any) => {
        // If the supplied username or email already exist in the database, notify the user
        this.openDialog(
          'Το όνομα χρήστη ή το email είναι ήδη σε χρήση!',
          '',
          false
        );
      }
    );
  }

  validate(): boolean {
    // If the details supplied are incomplete/incorrect, do not proceed with the transaction
    const pw_regex_number = /[0-9]/;
    const pw_regex_lowercase = /[a-z]/;
    const pw_regex_uppercase = /[A-Z]/;
    // tslint:disable-next-line:max-line-length
    const email_regex = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (
      this.firstName == null ||
      this.lastName == null ||
      this.region == null ||
      this.username == null ||
      this.email == null ||
      this.password == null ||
      this.confirmedPassword == null ||
      this.phone == null
    ) {
      // If there are any empty fields, notify the user
      this.openDialog('Παρακαλώ συμπληρώστε όλα τα πεδία!', '', false);
      return false;
    } else if (
      this.firstName.trim().length === 0 ||
      this.lastName.trim().length === 0 ||
      this.region.trim().length === 0 ||
      this.username.trim().length === 0 ||
      this.email.trim().length === 0 ||
      this.password.trim().length === 0 ||
      this.confirmedPassword.trim().length === 0 ||
      this.phone === 0 ||
      this.phone.toString().length < 5 ||
      this.phone.toString().length > 15
    ) {
      // If there are any incorrect details entered, notify the user
      this.openDialog('Παρακαλώ συμπληρώστε τα σωστά στοιχεία!', '', false);
      return false;
    } else if (this.password !== this.confirmedPassword) {
      // If passwords do not match, notify the user
      this.openDialog('Οι κωδικοί ασφαλείας δεν ταιριάζουν!', '', false);
      return false;
    } else if (this.password.length < 8) {
      this.openDialog(
        'Οι κωδικοί ασφαλείας πρέπει να είναι τουλάχιστον 8 χαρακτήρες!',
        '',
        false
      );
      return false;
    } else if (!pw_regex_number.test(this.password)) {
      this.openDialog('Οι κωδικοί ασφαλείας πρέπει να περιέχουν τουλάχιστον ένα νούμερο!', '', false);
      return false;
    } else if (!pw_regex_lowercase.test(this.password)) {
      this.openDialog(
        'Οι κωδικοί ασφαλείας πρέπει να περιέχουν τουλάχιστον ένα μικρό γράμμα!',
        '',
        false
      );
      return false;
    } else if (!pw_regex_uppercase.test(this.password)) {
      this.openDialog(
        'Οι κωδικοί ασφαλείας πρέπει να περιέχουν τουλάχιστον ένα κεφαλαίο γράμμα!',
        '',
        false
      );
      return false;
    } else if (!email_regex.test(this.email)) {
      this.openDialog('Παρακαλώ εισάγετε σωστή διεύθυνση email!', '', false);
      return false;
    }

    // If all the checks have passed, then proceed with uploading the image
    // and creating the registration record in the database
    this.uploader.uploadAll();
    return true;
  }

  openDialog(message: string, username: string, succeeded: boolean): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message: message,
        username: username
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (succeeded) {
        this.router.navigate(['/eisodos']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/anazitisi']);
  }
}
