import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { RatesComponent } from './components/rates/rates.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { ListingService } from './services/listing.service';
import { PriceApiService } from './services/priceApi.service';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import {
  FlashMessagesModule,
  FlashMessagesService
} from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { InstitutionsComponent } from './components/institutions/institutions.component';
import { EditInstitutionComponent } from './components/institutions/edit-institution/edit-institution.component';
import { DeleteInstitutionComponent } from './components/institutions/delete-institution/delete-institution.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';

import {
  MatButtonModule,
  MatProgressBarModule,
  MatInputModule,
  MatToolbarModule,
  MatGridListModule,
  MatSortModule,
  MatTableModule,
  MatDatepickerModule,
  MatNativeDateModule
} from '@angular/material';
import { ContractsService } from './services/contract.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TransactionsComponent,
    RatesComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    InstitutionsComponent,
    EditInstitutionComponent,
    DeleteInstitutionComponent,
    PublicProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FlashMessagesModule,
    MatButtonModule,
    MatProgressBarModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatGridListModule,
    MatSortModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    NotAuthGuard,
    ListingService,
    PriceApiService,
    FlashMessagesService,
    ContractsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
