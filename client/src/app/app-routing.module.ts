import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { RatesComponent } from './components/rates/rates.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { InstitutionsComponent } from './components/institutions/institutions.component';
import { EditInstitutionComponent } from './components/institutions/edit-institution/edit-institution.component';
import { DeleteInstitutionComponent } from './components/institutions/delete-institution/delete-institution.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';

// Our Array of Angular 2 Routes
const appRoutes: Routes = [
  {
    path: '',
    component: TransactionsComponent // Default route
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
    path: 'institutions',
    component: InstitutionsComponent, // Institutions route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'edit-institution/:id',
    component: EditInstitutionComponent, // Edit institution route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'delete-institution/:id',
    component: DeleteInstitutionComponent, // Delete institution route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'user/:username',
    component: PublicProfileComponent, // Public profile route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  { path: '**', component: TransactionsComponent } // "Catch-All" Route
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]
})
export class AppRoutingModule {}
