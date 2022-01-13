import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerticalLayoutComponent } from './layout/vertical/vertical.component';
import { DashboardHomeComponent } from './pages/dashboards/dashboard-home/dashboard-home.component';
import { DashboardReceivablesComponent } from './pages/dashboards/dashboard-receivables/dashboard-receivables.component';
import { DashboardSalesComponent } from './pages/dashboards/dashboard-sales/dashboard-sales.component';
import { AuthGuard } from './pages/services/authguard';

//const routes: Routes = [];

const mainRoutes: Routes = [
  { path: 'dashboard', component: DashboardHomeComponent },
  { path: 'dashboard-sales', component: DashboardSalesComponent},
  { path: 'dashboard-receivables', component: DashboardReceivablesComponent},
];


const layoutRoutes: Routes = [
  {
    path: '',
    redirectTo: '/vertical/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'vertical',
    component: VerticalLayoutComponent,
    children: mainRoutes
  },
  {
    path: '**',
    component: VerticalLayoutComponent,
    children: mainRoutes
  }
];

@NgModule({
  imports: [RouterModule.forRoot(layoutRoutes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
