import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './pages/admin/admin.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ViewproductComponent } from './pages/viewproduct/viewproduct.component';

export const routes: Routes = [
  {path: 'Landing', component: LandingComponent},
    {path: 'Home', component: HomeComponent},
    {path: '', redirectTo : 'Landing', pathMatch: 'full'},
    {path: 'Admin', component: AdminComponent},
    {path: 'Product', component: ViewproductComponent }
];
