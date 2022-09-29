import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AppComponent} from "../app.component";

@Injectable({
  providedIn: 'root'
})
export class UsersListGuard implements CanActivate {
  constructor(
    private router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = JSON.parse(localStorage.getItem('userInfo'))
    if(user && user.email)
    {
      return true;
    } else {
      this.router.navigate(['/login'])
      return false;
    }
  }

}
