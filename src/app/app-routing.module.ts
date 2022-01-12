import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerticalLayoutComponent } from './layout/vertical/vertical.component';
import { DashboardHomeComponent } from './pages/dashboards/dashboard-home/dashboard-home.component';

//const routes: Routes = [];

const mainRoutes: Routes = [
  { path: 'dashboard', component: DashboardHomeComponent },
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
