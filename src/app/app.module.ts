import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { UserApiService } from './user-api.service';

import { MatButtonModule, MatProgressBarModule, MatInputModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatInputModule,
    BrowserAnimationsModule
  ],
  providers: [ UserApiService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
