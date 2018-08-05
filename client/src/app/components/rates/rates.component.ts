import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';

import { PriceApiService } from '../../services/priceApi.service';
import { ContractsService } from '../../services/contract.service';

import { Chart } from 'chart.js';
import { Sort } from '@angular/material';
import { MatTableDataSource } from '@angular/material';

export interface Element {
  symbol: string;
  price: number;
  type: string;
}

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {
  tokens: Element[] = [];

  displayedColumns: string[] = ['select', 'symbol', 'price', 'type'];
  dataSource = new MatTableDataSource<Element>(this.tokens);
  selection = new SelectionModel<Element>(true, []);

  symbol: string;
  yesterday: string;

  chart = [];
  results = [];
  data = [];
  labels = [];

  loading: boolean;

  sortedPrices;

  constructor(
    private priceService: PriceApiService,
    public contractService: ContractsService
  ) {
    this.loading = true;
    this.symbol = 'ETH';
    this.tokens.push({ symbol: 'BTC', price: 5000, type: 'crypto' });
    this.tokens.push({ symbol: 'ETH', price: 5000, type: 'crypto' });
    this.tokens.push({ symbol: 'GOOGL', price: 5000, type: 'stock' });
    this.sortedPrices = this.tokens.slice();
  }

  ngOnInit() {
    this.getChartData(this.symbol);

    // retrieving last closing price for each token in table
    for (let i = 0; i < this.tokens.length; i++) {
      let func: string, title: string, subtitle: string;
      if (this.tokens[i].type === 'crypto') {
        func = 'DIGITAL_CURRENCY_DAILY';
        title = 'Time Series (Digital Currency Daily)';
        subtitle = '4a. close (USD)';
      } else {
        func = 'TIME_SERIES_DAILY_ADJUSTED';
        title = 'Time Series (Daily)';
        subtitle = '5. adjusted close';
      }

      this.priceService
        .getCurrentPrice(func, this.tokens[i].symbol)
        .then(res => {
          // console.log(res[Object.keys(res)[Object.keys(res).length - 1]]);
          // this.mostRecentPrices[0].price = res['Time Series (Digital Currency Daily)']['2018-06-22']['4a. close (USD)'];
          this.tokens[i].price =
            Math.round(res[title][Object.keys(res[title])[0]][subtitle] * 100) /
            100;
        });
    }

    this.contractService.getAccount().then(account => {
      // checking for oracle deployment
      this.contractService
        .checkOracleDeployment(this.contractService.oracleAddresses[0])
        .then(result => {
          // deploying new oracle version
          // this.contractService.deployOracle('Coinbase',
          //                                   'https://api.gdax.com/products/', 'ETH', '-USD/ticker).price');
          // this.contractService.deployOracle('CoinMarketCap',
          //                                   'https://api.coinmarketcap.com/v2/ticker/', '1027', ').data.quotes.USD.price');
          // this.contractService.deployOracle('CryptoCompare',
          //                                   'https://min-api.cryptocompare.com/data/price?fsym=', 'ETH', '&tsyms=USD).USD');

          // calling each oracle's function to update the price stored
          // gas value in Gwei, standard current value from https://www.ethgasstation.info/
          for (let i = 0; i < this.contractService.oracleAddresses.length; i++) {
            this.updateSingleOraclePrice(i);
            this.listeningForOracleEvents(i);
          }
        });
    });
  }

  updateSingleOraclePrice(id: number): void {
    this.contractService.oracles[id].updatePrice(
      {
        from: this.contractService.account,
        gas: 4000000,
        value: this.contractService.web3.toWei(0.01, 'ether')
      },
      function(error, transactionHash) {
        // getting the transaction hash as callback from the function
        if (error) {
          alert(error);
          return;
        } else {
          console.log('Price update request sent...');
          console.log('Transaction hash: ' + transactionHash);
        }
      }
    );
  }

  listeningForOracleEvents(id: number): void {
    // Event that signifies start of price retrieval process
    const oracleConstructedEvent = this.contractService.oracles[id].ConstructorInitiated(
      function(error, constructorInfo) {
        if (error) {
          return;
        }
        console.log('Oracle constructed');
        console.log(constructorInfo.args.nextStep);
      }
    );

    // Event that signifies start of price retrieval process
    const oracleQueryingEvent = this.contractService.oracles[id].NewOracleQuery(
      function(error, queryInfo) {
        if (error) {
          return;
        }
        console.log('Price retrieval request received...');
        console.log(queryInfo.args.description);
      }
    );

    // Event that signifies end of price retrieval and update process
    const oraclePriceEvent = this.contractService.oracles[id].PriceUpdated(function(
      error,
      priceInfo
    ) {
      if (error) {
        return;
      }
      console.log('Price retrieved and updated successfully!');
      console.log('New price: ' + priceInfo.args.price);
    });
  }

  getChartData(symbol: string): void {
    // retrieving historical prices for chart
    this.priceService
      .getCurrentPrice('DIGITAL_CURRENCY_DAILY', this.symbol)
      .then(res => {
        this.labels = Object.keys(res['Time Series (Digital Currency Daily)']);
        this.labels = this.labels.reverse();
        this.results = res['Time Series (Digital Currency Daily)'];
        let key;
        for (key in this.results) {
          if (this.results.hasOwnProperty(key)) {
            // console.log(data['Time Series (Digital Currency Daily)'][date]['4a. close (USD)']);
            this.data.push(this.results[key]['4a. close (USD)']);
          }
        }
        this.data = this.data.reverse();
        this.createChart(symbol, this.labels, this.data);
        this.loading = false;
      });
  }

  createChart(symbol: string, labels: any, data: any) {
    const ctx = document.getElementById('canvas');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: symbol + ' closing price per day in USD',
            data: data,
            borderColor: '#3c5dba',
            pointRadius: 1,
            pointHoverRadius: 7,
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: true,
          position: 'bottom'
        },
        title: {
          display: true
        },
        events: ['mousemove'],
        scales: {
          xAxes: [
            {
              display: true
            }
          ],
          ticks: {
            source: 'data'
          },
          yAxes: [
            {
              display: true
            }
          ],
          bounds: 'data'
        },
        animation: false,
        tooltips: {
          yLabel: String,
          callbacks: {
            // tslint:disable-next-line:no-shadowed-variable
            label: function(tooltipItem, data) {
              let label = data.datasets[tooltipItem.datasetIndex].label || '';
              if (label) {
                label += ': ';
              }
              label += Math.round(tooltipItem.yLabel * 100) / 100;
              return label;
            }
          }
        }
      }
    });
  }

  sortData(sort: Sort) {
    const data = this.tokens.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedPrices = data;
      return;
    }

    this.sortedPrices = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'symbol':
          return compare(a.symbol, b.symbol, isAsc);
        case 'price':
          return compare(+a.price, +b.price, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
