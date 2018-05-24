import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration.component';
import { LoginComponent } from './login.component';
// import { MyJobsComponent } from './my-jobs.component';
// import { JobDetailsComponent } from './job-details.component';
import { AddListingComponent } from './add-listing.component';
// import { FeedbackComponent } from './feedback.component';
import { ProfileComponent } from './user-profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/anazitisi', pathMatch: 'full' },
  { path: 'anazitisi', component: AppComponent },
  { path: 'eggrafi', component: RegistrationComponent },
  { path: 'eisodos', component: LoginComponent },
  { path: 'nea-aggelia', component: AddListingComponent },
  // { path: 'aggelies/:aggeliaID', component: ListingDetailsComponent },
  // { path: 'oi-aggelies-mou', component: MyListingsComponent },
  // { path: 'kritikes', component: FeedbackComponent },
  { path: 'profil/:username', component: ProfileComponent },

];

export const appRoutingProviders: any[] = [];

export const routing = RouterModule.forRoot(routes);

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
