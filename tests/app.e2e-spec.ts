import { } from 'jasmine';
import { ContractsService } from './contract.service';
import { TestBed, inject } from '@angular/core/testing';
import { XHRBackend, ResponseOptions } from '@angular/http';

describe('workspace-project App', () => {
  // tslint:disable-next-line:prefer-const
  let service: ContractsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContractsService
      ]
    });
  });

  // tslint:disable-next-line:prefer-const
  // let request = require('request');

  /*
  it('Initial test: should reach Google', done => {
    request('http://www.google.com', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        done(); // informs runner that the asynchronous code has finished
    });
  });
  */

  const mockResponse = {
    data: [
      { '0': '0x112bdf6c3a7ba20100fff06a0326735e10079a85' }
    ]
  };

  it('Should retrieve account', done => {
    // tslint:disable-next-line:no-shadowed-variable
    inject([ContractsService, XHRBackend], (service, mockBackend) => {
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(JSON.stringify(mockResponse)
        ));
      });

      service.getAccount(0).then(account => {
        console.log('account:', account); // Print the account if a response was received
        done(); // informs runner that the asynchronous code has finished
      });
    });
  });
});
