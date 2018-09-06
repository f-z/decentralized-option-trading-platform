import { RouterModule, Routes } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { RatesComponent } from './components/rates/rates.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { SellersComponent } from './components/sellers/sellers.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';

// the array of routes
const appRoutes: Routes = [
  {
    path: '',
    component: LoginComponent // default route
  },
  {
    path: 'transactions',
    component: TransactionsComponent, // transactions route,
    canActivate: [AuthGuard] // user must be logged in to view this route
  },
  {
    path: 'rates',
    component: RatesComponent, // market rates route,
    canActivate: [AuthGuard] // user must be logged in to view this route
  },
  {
    path: 'register',
    component: RegisterComponent, // register route
    canActivate: [NotAuthGuard] // user must NOT be logged in to view this route
  },
  {
    path: 'login',
    component: LoginComponent, // login route
    canActivate: [NotAuthGuard] // user must NOT be logged in to view this route
  },
  {
    path: 'profile',
    component: ProfileComponent, // profile route
    canActivate: [AuthGuard] // user must be logged in to view this route
  },
  {
    path: 'sellers',
    component: SellersComponent, // sellers route
    canActivate: [AuthGuard] // user must be logged in to view this route
  },
  {
    path: 'user/:username',
    component: PublicProfileComponent, // public profile route
    canActivate: [AuthGuard] // user must be logged in to view this route
  },
  { path: '**', component: LoginComponent } // "catch-all" route
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppRoutingModule {}
