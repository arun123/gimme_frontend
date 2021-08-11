import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationEnd  } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { Observable } from 'rxjs'
import { filter, map, mergeMap } from 'rxjs/operators';
import { User } from '@user/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserGuard implements CanActivate, CanActivateChild {

    private user: User;

    constructor(private authService: AuthService, private router: Router) { 
        this.authService.user.subscribe(x => this.user = x);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if( ! this.authService.isLoggedIn() ) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        }

        if( this.user ) {
            // if roles has ROLE_ADMIN return true
            if( this.user.roles.includes('ROLE_ADMIN') ) return true;
           
            const routeAccess = route.data.accessName ? route.data.accessName : '';
           
            if( routeAccess ) {

                if( ! this.user.access.includes(routeAccess) ) {
                    this.router.navigate(['/admin/403']);
                }
            }

            return true;
        }

        return true;
        
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canActivate(route, state);
    }
}
