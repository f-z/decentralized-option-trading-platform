import { TestBed, inject } from '@angular/core/testing';

import { UserApiService } from './user-api.service';

describe('UserApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserApiService]
    });
  });

  it('should be created', inject([UserApiService], (service: UserApiService) => {
    expect(service).toBeTruthy();
  }));
});
