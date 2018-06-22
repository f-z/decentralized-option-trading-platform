import { Component } from '@angular/core';
import { PriceApiService } from './services/priceApi.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  yesterday: string;

  chart = [];
  results = [];
  data = [];
  labels = [];

  web3: any;

  loading: boolean;

  constructor(private priceService: PriceApiService) {
    this.loading = true;
    this.labels = ['2000', '2001', '2002'];

    const today = new Date();
    let day = (today.getDate() - 1).toString();
    let month = (today.getMonth() + 1).toString();
    const year = today.getFullYear().toString();

    if (today.getDate() < 10) {
      day = '0' + today.getDate();
    }

    if ((today.getMonth() + 1) < 10) {
      month = '0' + (today.getMonth() + 1);
    }

    this.yesterday = year + '-' + month + '-' + day;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.priceService.getCurrentPrice('BTC').then(res => {
      this.labels = Object.keys(res['Time Series (Digital Currency Daily)']);
      this.labels = this.labels.reverse();
      this.results = res['Time Series (Digital Currency Daily)'];
      let key;
      for (key in this.results) {
        if (this.results.hasOwnProperty(key)) {
          // console.log(data['Time Series (Digital Currency Daily)'][date]['4a. close (GBP)']);
          // console.log(this.results[key]['4a. close (GBP)']);
          this.data.push(this.results[key]['4a. close (GBP)']);
        }
      }
      this.data = this.data.reverse();
      // console.log(res['Time Series (Digital Currency Daily)']);
      this.createChart(this.data);
      this.loading = false;
    });

    // if (typeof this.web3 !== 'undefined') {
    // this.web3 = new Web3(this.web3.currentProvider);
    // } else {
    // set the provider you want from Web3.providers
    //   this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    //  }

    // console.log(this.web3);
  }

  createChart(data: any) {
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'price at close',
            data: data,
            borderColor: '#3cba9f',
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        title: {
          display: true
        },
        events: ['click'],
        scales: {
          xAxes: [{
            display: true
          }],
          ticks: {
            source: 'data'
          },
          yAxes: [{
            display: true
          }],
          bounds: 'data'
        },
        animation: false,
        tooltips: {
          yLabel: String,
          callbacks: {
            // tslint:disable-next-line:no-shadowed-variable
            label: function (tooltipItem, data) {
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
}
