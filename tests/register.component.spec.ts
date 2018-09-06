import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material';
import { AppRoutingModule } from '../../app-routing.module';
import { SellersComponent } from '../sellers/sellers.component';
import { LoginComponent } from '../login/login.component';
import { TransactionsComponent } from '../transactions/transactions.component';
import { RatesComponent } from '../rates/rates.component';
import { ProfileComponent } from '../profile/profile.component';
import { PublicProfileComponent } from '../public-profile/public-profile.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../guards/auth.guard';
import { NotAuthGuard } from '../../guards/notAuth.guard';
import { ListingService } from '../../services/listing.service';
import { PriceApiService } from '../../services/priceApi.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ContractsService } from '../../services/contract.service';
import { Http, ConnectionBackend } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        AppRoutingModule
      ],
      declarations: [
        SellersComponent,
        LoginComponent,
        TransactionsComponent,
        RatesComponent,
        RegisterComponent,
        ProfileComponent,
        PublicProfileComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
        { provide: APP_BASE_HREF, useValue : '/' }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
