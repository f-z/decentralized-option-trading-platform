import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ItemComponent } from './item.component';
import { FeedbackItemComponent } from './feedback-item.component';
import { ListingDetailsComponent } from './listing-details.component';
import { RegistrationComponent } from './registration.component';
import { LoginComponent } from './login.component';
import { MyItemsComponent } from './my-items.component';
import { AddListingComponent } from './add-listing.component';
import { FeedbackComponent } from './feedback.component';
import { ProfileComponent } from './user-profile.component';
import { DialogComponent } from './dialog.component';
import { BidHistoryComponent } from './bid-history.component';
import { SearchPipe } from './search.pipe';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './shared/services/user.service';
import { ListingService } from './shared/services/listing.service';
import { MatDialogModule, MatButtonToggleModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { FileSelectDirective } from 'ng2-file-upload';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatButtonToggleModule,
    MatIconModule,
    MatGridListModule,
    MatTabsModule,
    MatTableModule
  ],
  declarations: [
    HomeComponent,
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    MyItemsComponent,
    AddListingComponent,
    ItemComponent,
    FeedbackItemComponent,
    ListingDetailsComponent,
    FeedbackComponent,
    ProfileComponent,
    SearchPipe,
    DialogComponent,
    BidHistoryComponent,
    FileSelectDirective
  ],
  bootstrap: [HomeComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    UserService,
    ListingService
  ],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [DialogComponent, BidHistoryComponent]
})
export class AppModule {}
