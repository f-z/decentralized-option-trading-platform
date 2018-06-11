import { Component } from '@angular/core';
import { UserApiService } from './user-api.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  username: string;
  password: string;

  loading: boolean;

  user: any;

  constructor(private users: UserApiService) {
    // default values
    this.username = '5b1edfaa2311d622234b762d';
    this.password = '123';
    this.loading = false;
    this.user = null;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    // displaying an example chart upon load
    // this.getAllData(this.term, this.minDate, this.maxDate);
    this.getUser('5b1edfaa2311d622234b762d');
  }

  addUser(term, date, count) {
    this.users.addUser(term, date, count);
  }

  getUser(username): any {
    this.users.getUser(username).subscribe(res => {
      console.log(res);
      return res;
    });
  }
}
