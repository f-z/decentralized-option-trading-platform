import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { RatesComponent } from './components/rates/rates.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { ListingComponent } from './components/listing/listing.component';
import { EditListingComponent } from './components/listing/edit-listing/edit-listing.component';
import { DeleteListingComponent } from './components/listing/delete-listing/delete-listing.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';

// Our Array of Angular 2 Routes
const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent // Default route
  },
  {
    path: 'rates',
    component: RatesComponent, // Market rates route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'register',
    component: RegisterComponent, // Register route
    canActivate: [NotAuthGuard] // User must NOT be logged in to view this route
  },
  {
    path: 'login',
    component: LoginComponent, // Login route
    canActivate: [NotAuthGuard] // User must NOT be logged in to view this route
  },
  {
    path: 'profile',
    component: ProfileComponent, // Profile route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'listing',
    component: ListingComponent, // Listing route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'edit-listing/:id',
    component: EditListingComponent, // Edit listing route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'delete-listing/:id',
    component: DeleteListingComponent, // Delete listing route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'user/:username',
    component: PublicProfileComponent, // Public profile route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  { path: '**', component: HomeComponent } // "Catch-All" Route
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]
})
export class AppRoutingModule {}
