import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PriceApiService {
  apiString = 'https://www.alphavantage.co/query?';
  market = '&market=USD';
  apiKey = '&apikey=G1EXLX22YPP5TVD1';

  constructor(private http: HttpClient) {}

  getCurrentPrice(func: string, symbol: string): any {
    return new Promise(resolve => {
      this.http
        .get(this.apiString + 'function=' + func + '&symbol=' + symbol + this.market + this.apiKey)
        .subscribe(data => {
          resolve(data);
        });
    });
  }
}
