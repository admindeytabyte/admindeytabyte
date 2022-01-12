import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutsModule } from './layout/layouts.module';
import { PagesModule } from './pages/pages.module';
import { appSettingsReducer } from './store/reducers/app-settings.reducer';
import { pageDataReducer } from './store/reducers/page-data.reducer';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule.forRoot({
      pageData: pageDataReducer,
      appSettings: appSettingsReducer,
    }),
    AppRoutingModule,
    LayoutsModule,
    PagesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
