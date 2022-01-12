import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TCDropdownButtonComponent, TCDropdownComponent, TCDropdownContentComponent } from './components/dropdown';
import { TCAlertComponent } from './components/alert';
import { TCAvatarComponent } from './components/avatar';
import { TCBadgeComponent } from './components/badge';
import { TCButtonComponent } from './components/button';
import { TCCardComponent } from './components/card';
import { TCIconComponent } from './components/icon';
import { TCRatingComponent } from './components/rating';
import { TCBgColorDirective } from './directives/bg-color/bg-color.directive';
import { TCBorderColorDirective } from './directives/border-color/border-color.directive';
import { TCBorderStyleDirective } from './directives/border-style/border-style.directive';
import { TCColorDirective } from './directives/color/color.directive';
import { TCFontSizeDirective } from './directives/font-size/font-size.directive';
import { TCGradientDirective } from './directives/gradient/gradient.directive';
import { TCShapeDirective } from './directives/shape/shape.directive';
import { TCBreadcrumbComponent } from './components/breadcrumbs';
import { TCChatComponent } from './components/chat';
import { TCFileComponent } from './components/file';
import { TCVTimelineComponent } from './components/v-timeline';

@NgModule({
  imports: [
    CommonModule,
		FormsModule,
    RouterModule,
    ReactiveFormsModule
  ],
  declarations: [
    TCDropdownComponent, TCDropdownButtonComponent, TCDropdownContentComponent,
    TCAlertComponent,
    TCAvatarComponent,
    TCBadgeComponent,
    TCButtonComponent,
    TCCardComponent,
    TCIconComponent,
    TCRatingComponent,
    TCBreadcrumbComponent,
    TCChatComponent,
    TCFileComponent,
    TCVTimelineComponent,
    TCBgColorDirective,
    TCBorderColorDirective,
    TCBorderStyleDirective,
    TCColorDirective,
    TCFontSizeDirective,
    TCGradientDirective,
    TCShapeDirective
  ],
  exports: [
    TCDropdownComponent, TCDropdownButtonComponent, TCDropdownContentComponent,
    TCAlertComponent,
    TCAvatarComponent,
    TCBadgeComponent,
    TCButtonComponent,
    TCCardComponent,
    TCIconComponent,
    TCRatingComponent,
    TCBreadcrumbComponent,
    TCChatComponent,
    TCFileComponent,
    TCVTimelineComponent,
    TCBgColorDirective,
    TCBorderColorDirective,
    TCBorderStyleDirective,
    TCColorDirective,
    TCFontSizeDirective,
    TCGradientDirective,
    TCShapeDirective
  ],
  entryComponents: []
})
export class UIModule { }
