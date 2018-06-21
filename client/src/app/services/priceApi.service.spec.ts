import { TestBed, inject } from '@angular/core/testing';

import { PriceApiService } from './priceApi.service';

describe('PriceApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PriceApiService]
    });
  });

  it('should be created', inject([PriceApiService], (service: PriceApiService) => {
    expect(service).toBeTruthy();
  }));
});
