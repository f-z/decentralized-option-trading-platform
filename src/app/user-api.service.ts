import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  url = 'https://www.alphavantage.co/query?';
  params = 'function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=demo';
  apiKey = 'G1EXLX22YPP5TVD1';
  uri = 'http://localhost:4000/users';

  constructor(private http: HttpClient) {}

  getPublicationCount(term: string, date: number): any {
    return new Promise(resolve => {
      this.http
        .get(this.url + this.params + '&term=' + term + '&apikey=' + this.apiKey)
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  addUser(term, date, count) {
    const obj = {
      term: term,
      date: date,
      count: count
    };
    this.http.post(`${this.uri}/add`, obj)
        .subscribe();
  }

  getUser(username): Observable<any> {
    return this.http.get(`${this.uri}/get/` + username);
  }
}
