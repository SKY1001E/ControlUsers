import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {UserManagmentComponent} from "./components/user-managment/user-managment.component";
import {UsersListGuard} from "./guards/users-list.guard";
import {AllUserManagmentComponent} from "./components/all-user-managment/all-user-managment.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'users', component: UserManagmentComponent, canActivate: [UsersListGuard]},
  {path: 'allUsers', component: AllUserManagmentComponent, canActivate: [UsersListGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
