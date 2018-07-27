import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
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
import { ListingComponent } from './components/listing/listing.component';
import { EditListingComponent } from './components/listing/edit-listing/edit-listing.component';
import { DeleteListingComponent } from './components/listing/delete-listing/delete-listing.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';

import {
  MatButtonModule,
  MatProgressBarModule,
  MatInputModule,
  MatToolbarModule,
  MatGridListModule,
  MatSortModule
} from '@angular/material';
import { ContractsService } from './services/contract.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RatesComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    ListingComponent,
    EditListingComponent,
    DeleteListingComponent,
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
    MatSortModule
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
