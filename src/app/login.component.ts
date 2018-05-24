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

  private localURI: string;
  private remoteURI: string;

  private user: User;

  constructor(
    public http: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private userService: UserService
  ) {
    this.loginPage = 'true';
  }

  login(): void {
    const headers: any = new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      options: any = { username: this.username, password: this.password },
      url: any = 'https://php-group30.azurewebsites.net/login.php';

    this.http.post(url, JSON.stringify(options), headers).subscribe(
      (data: any) => {
        // If the request was successful, set the current user and notify him/her.
        this.user = data;

        this.openDialog('Congratulations, logging in...', '', true);
      },
      (error: any) => {
        // If the supplied username and password do not match, notify the user.
        this.openDialog(
          'The supplied username and password are incorrect!',
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
        if (this.user.role === 'seller') {
          this.router.navigate(['/my-items']);
        } else {
          this.router.navigate(['/search']);
        }
      }
    });
  }
}
