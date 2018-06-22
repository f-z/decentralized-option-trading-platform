import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PriceApiService {
  apiString = 'https://www.alphavantage.co/query?';

  // params = 'function=TIME_SERIES_INTRADAY&interval=1min&apikey=demo&symbol=';
  params = 'function=DIGITAL_CURRENCY_DAILY&market=GBP';
  apiKey = 'G1EXLX22YPP5TVD1';

  constructor(private http: HttpClient) {}

  getCurrentPrice(symbol: string): any {
    return new Promise(resolve => {
      this.http
        .get(this.apiString + this.params + '&symbol=' + symbol + '&apikey=' + this.apiKey)
        .subscribe(data => {
          resolve(data);
        });
    });
  }
}
