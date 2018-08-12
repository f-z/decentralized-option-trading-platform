import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MatDatepickerModule } from '../../../../node_modules/@angular/material/datepicker';
import { InstitutionsComponent } from 'src/app/components/institutions/institutions.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '../../../../node_modules/@angular/core';
import { LoginComponent } from '../login/login.component';
import { TransactionsComponent } from '../transactions/transactions.component';
import { RatesComponent } from '../rates/rates.component';
import { RegisterComponent } from '../register/register.component';
import { ProfileComponent } from '../profile/profile.component';
import { PublicProfileComponent } from '../public-profile/public-profile.component';
import { APP_BASE_HREF } from '../../../../node_modules/@angular/common';
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { NotAuthGuard } from 'src/app/guards/notAuth.guard';
import { ListingService } from 'src/app/services/listing.service';
import { PriceApiService } from 'src/app/services/priceApi.service';
import { FlashMessagesService } from '../../../../node_modules/angular2-flash-messages';
import { ContractsService } from 'src/app/services/contract.service';
import { Http, ConnectionBackend, RequestOptions } from '../../../../node_modules/@angular/http';

describe('InstitutionsComponent', () => {
  let component: InstitutionsComponent;
  let fixture: ComponentFixture<InstitutionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        AppRoutingModule
      ],
      declarations: [
        InstitutionsComponent,
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
    fixture = TestBed.createComponent(InstitutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
