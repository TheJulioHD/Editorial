import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './compnentes/shared/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import {ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegistroComponent } from './pages/registro/registro.component';
import { AddUserComponent } from './pages/add-user/add-user.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NoFoundComponent } from './pages/no-found/no-found.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { HelpComponent } from './pages/help/help.component';
// import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RegistroComponent,
    AddUserComponent,
    NoFoundComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    // ChartsModule,
    HttpClientModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
