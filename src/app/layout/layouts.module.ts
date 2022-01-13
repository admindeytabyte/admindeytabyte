import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { BaseLayoutComponent } from './base-layout/base-layout.component';
import { VerticalLayoutComponent } from './vertical/vertical.component';

import { AdditionNavbarComponent } from './layout-components/addition-navbar/addition-navbar.component';

import { VerticalNavbarComponent } from './layout-components/vertical-navbar/vertical-navbar.component';

import { LogoComponent } from './layout-components/logo/logo.component';

import { ActionsComponent } from './layout-components/actions/actions.component';
import { HorizontalNavbarComponent } from './layout-components/horizontal-navbar/horizontal-navbar.component';
import { FooterComponent } from './layout-components/footer/footer.component';
import { MenuComponent } from './layout-components/menu/menu.component';
import { UIModule } from '../ui/ui.module';
import { ExtraLayoutComponent } from './extra/extra.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UIModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatSelectModule
  ],
  declarations: [
    BaseLayoutComponent,
    VerticalLayoutComponent,
    AdditionNavbarComponent,
    HorizontalNavbarComponent,
    VerticalNavbarComponent,
    FooterComponent,
    LogoComponent,
    MenuComponent,
    ActionsComponent,
    ExtraLayoutComponent
  ]
})
export class LayoutsModule { }
