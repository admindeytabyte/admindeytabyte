import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtraLayoutComponent } from './layout/extra/extra.component';
import { VerticalLayoutComponent } from './layout/vertical/vertical.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { DashboardHomeComponent } from './pages/dashboards/dashboard-home/dashboard-home.component';
import { DashboardReceivablesComponent } from './pages/dashboards/dashboard-receivables/dashboard-receivables.component';
import { DashboardSalesComponent } from './pages/dashboards/dashboard-sales/dashboard-sales.component';
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './pages/services/authguard';

//const routes: Routes = [];

const mainRoutes: Routes = [
  { path: 'dashboard-home', component: DashboardHomeComponent },
  { path: 'dashboard-sales', component: DashboardSalesComponent},
  { path: 'dashboard-receivables', component: DashboardReceivablesComponent},
  { path: 'customers', component: CustomersComponent},
  { path: '**', component: PageNotFoundComponent },
];

const extraRoutes: Routes = [
  { path: 'login', component: LoginComponent }
];

const layoutRoutes: Routes = [
  {
    path: '',
    redirectTo: 'extra/login',
    pathMatch: 'full'
  },
  {
    path: 'vertical',
    component: VerticalLayoutComponent,
    children: mainRoutes
  },
  {
    path: 'extra',
    component: ExtraLayoutComponent,
    children: extraRoutes
  },
  {
    path: '**',
    component: VerticalLayoutComponent,
    children: mainRoutes
  }
];

@NgModule({
  imports: [RouterModule.forRoot(layoutRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
