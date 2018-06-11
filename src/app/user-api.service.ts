import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  apiString = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
  params = '?db=pubmed&rettype=count&retmode=json&sort=pub+date&usehistory=y';

  uri = 'http://localhost:4000/users';

  constructor(private http: HttpClient) {}

  getPublicationCount(term: string, date: number): any {
    return new Promise(resolve => {
      this.http
        .get(this.apiString + this.params + '&term=' + term + '&mindate=' + date + '&maxdate=' + date)
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
