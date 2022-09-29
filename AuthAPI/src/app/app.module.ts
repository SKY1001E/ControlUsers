import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import uaLocale from "@angular/common/locales/ru-UA";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { RegisterComponent } from './components/register/register.component';
import { UserManagmentComponent } from './components/user-managment/user-managment.component';
import {registerLocaleData} from "@angular/common";
import { AllUserManagmentComponent } from './components/all-user-managment/all-user-managment.component';

registerLocaleData(uaLocale, 'ua')

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserManagmentComponent,
    AllUserManagmentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
