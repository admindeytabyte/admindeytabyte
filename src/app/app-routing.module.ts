import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtraLayoutComponent } from './layout/extra/extra.component';
import { VerticalLayoutComponent } from './layout/vertical/vertical.component';
import { BackOfficeComponent } from './pages/back-office/back-office.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { DashboardHomeComponent } from './pages/dashboards/dashboard-home/dashboard-home.component';
import { DashboardReceivablesComponent } from './pages/dashboards/dashboard-receivables/dashboard-receivables.component';
import { DashboardSalesComponent } from './pages/dashboards/dashboard-sales/dashboard-sales.component';
import { DispatchComponent } from './pages/dispatch/dispatch.component';
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './pages/not-found/not-found.component';
import { PaintCodesComponent } from './pages/paint-codes/paint-codes.component';
import { PaintsComponent } from './pages/paints/paints.component';
import { ProductsComponent } from './pages/products/products.component';
import { SalesManagementComponent } from './pages/sales-management/sales-management.component';
import { AuthGuard } from './pages/services/authguard';

//const routes: Routes = [];

const mainRoutes: Routes = [
  { path: 'dashboard-home', component: DashboardHomeComponent, canActivate: [AuthGuard]  },
  { path: 'dashboard-sales', component: DashboardSalesComponent, canActivate: [AuthGuard] },
  { path: 'dashboard-receivables', component: DashboardReceivablesComponent, canActivate: [AuthGuard] },
  { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'dispatch', component: DispatchComponent, canActivate: [AuthGuard] },
  { path: 'paint-orders', component: PaintsComponent, canActivate: [AuthGuard] },
  { path: 'paint-codes', component: PaintCodesComponent, canActivate: [AuthGuard] },
  { path: 'backoffice', component: BackOfficeComponent, canActivate: [AuthGuard] },
  { path: 'salesmanagement', component: SalesManagementComponent, canActivate: [AuthGuard] },
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
