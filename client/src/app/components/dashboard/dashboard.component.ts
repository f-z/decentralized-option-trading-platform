import { Component, OnInit } from '@angular/core';
import { PriceApiService } from '../../services/priceApi.service';
import { Chart } from 'chart.js';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  symbol: string;
  yesterday: string;

  chart = [];
  results = [];
  data = [];
  labels = [];

  loading: boolean;

  desserts = [
    {
      name: 'Frozen yogurt',
      calories: '159',
      fat: '6',
      carbs: '24',
      protein: '4'
    },
    {
      name: 'Ice cream sandwich',
      calories: '237',
      fat: '9',
      carbs: '37',
      protein: '4'
    },
    { name: 'Eclair', calories: '262', fat: '16', carbs: '24', protein: '6' },
    { name: 'Cupcake', calories: '305', fat: '4', carbs: '67', protein: '4' },
    {
      name: 'Gingerbread',
      calories: '356',
      fat: '16',
      carbs: '49',
      protein: '4'
    }
  ];

  sortedData;

  constructor(private priceService: PriceApiService) {
    this.loading = true;
    this.symbol = 'BTC';

    const today = new Date();
    let day = (today.getDate() - 1).toString();
    let month = (today.getMonth() + 1).toString();
    const year = today.getFullYear().toString();

    if (today.getDate() < 10) {
      day = '0' + today.getDate();
    }

    if (today.getMonth() + 1 < 10) {
      month = '0' + (today.getMonth() + 1);
    }

    this.yesterday = year + '-' + month + '-' + day;

    this.sortedData = this.desserts.slice();
  }

  ngOnInit() {
    this.priceService.getCurrentPrice(this.symbol).then(res => {
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
  }

  createChart(data: any) {
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.symbol + ' closing price per day in GBP',
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

  sortData(sort: Sort) {
    const data = this.desserts.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'calories':
          return compare(+a.calories, +b.calories, isAsc);
        case 'fat':
          return compare(+a.fat, +b.fat, isAsc);
        case 'carbs':
          return compare(+a.carbs, +b.carbs, isAsc);
        case 'protein':
          return compare(+a.protein, +b.protein, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
