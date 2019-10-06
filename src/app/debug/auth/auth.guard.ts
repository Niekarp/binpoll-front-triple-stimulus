import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  constructor(public auth: AuthService, public router: Router) {}

  canActivateChild(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): boolean {
    if (!this.auth.isLoggedIn) {
      this.router.navigateByUrl('/debug/');
    }
    return this.auth.isLoggedIn;
  }
}
