import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private userService: UserService
        , private router: Router) {
    }

    // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    canActivate() {

        if (this.userService.isLogged()) {
            return true;
        }

        this.router.navigateByUrl('/extra/login');

        return false;
    }
}
