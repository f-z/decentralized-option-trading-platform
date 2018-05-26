import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DialogComponent } from './dialog.component';
import { User, UserService } from './shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginPage: string;

  username: string;
  password: string;

  localURI: string;
  remoteURI: string;

  user: User;

  constructor(
    public http: HttpClient,
    public dialog: MatDialog,
    public router: Router,
    public userService: UserService
  ) {
    this.loginPage = 'true';
  }

  login(): void {
    const headers: any = new HttpHeaders({
      'Content-Type': 'application/json'
    }),
      options: any = { username: this.username, password: this.password },
      url: any = 'https://okergo.azurewebsites.net/php/login.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        // If the request was successful, set the current user and notify him/her
        this.user = data;

        this.openDialog('Συγχαρητήρια, γίνεται είσοδος...', '', true);
      },
      (error: any) => {
        // If the supplied username and password do not match, notify the user
        this.openDialog(
          'Το όνομα χρήστη και ο κωδικός πρόσβασης δεν είναι σωστά!',
          '',
          false
        );
      }
    );
  }

  setUser(user: User): void {
    this.userService.setUser(user);
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
        this.setUser(this.user);
        this.router.navigate(['/anazitisi']);
      }
    });
  }
}
