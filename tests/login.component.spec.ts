import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { NotAuthGuard } from 'src/app/guards/notAuth.guard';
import { ListingService } from 'src/app/services/listing.service';
import { PriceApiService } from 'src/app/services/priceApi.service';
import { FlashMessagesService } from 'angular2-flash-messages/module/flash-messages.service';
import { ContractsService } from 'src/app/services/contract.service';
import { Http, ConnectionBackend, RequestOptions, HttpModule, RequestMethod } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let options: RequestOptions;

  beforeEach(async(() => {
    options = new RequestOptions({method: RequestMethod.Post});
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        FormsModule,
        ReactiveFormsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ LoginComponent ],
      providers: [
        AuthService,
        AuthGuard,
        NotAuthGuard,
        ListingService,
        PriceApiService,
        FlashMessagesService,
        ContractsService,
        Http,
        ConnectionBackend,
        RequestOptions,
        { provide: APP_BASE_HREF, useValue : '/' }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
