import { Injectable, Inject,PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { User } from '@user/user.model';
import { Tokens } from '@auth/models/tokens';
import { Router } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private readonly JWT_TOKEN = 'JWT_TOKEN';
    private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
    hasUsers: boolean;

    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    public data:any[] = [];

    constructor(private http: HttpClient, private router: Router ,@Inject('LOCALSTORAGE') private localStorage: any,@Inject(PLATFORM_ID) private platformId: any) {
        if (isPlatformBrowser(platformId)) {
            this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('USER')));
            this.user = this.userSubject.asObservable();
        }
        if (isPlatformServer(platformId)) {

            var item = this.data.find(x => x.id == 'USER');
            if(item)
            {
                this.userSubject = new BehaviorSubject<User>(JSON.parse(item['value']));
                this.user = this.userSubject.asObservable();
            }
            else {
                this.userSubject = new BehaviorSubject<User>(item);
                this.user = this.userSubject.asObservable();
            }

        }
    }

    login(user: { username: string, password: string }) {
        return this.http.post<any>(`${environment.url}/api/login-check`, user)
            .pipe(
                tap(tokens => this.doLoginUser(tokens)),
                mapTo(true),
                catchError(error => {
                    return of(error);
                }));
    }
   
    register(user: { username: string, password: string }) {
        return this.http.post<any>(`${environment.url}/api/user/register-admin-user`, user)
            .pipe(
                tap(tokens => this.doLoginUser(tokens)),
                mapTo(true),
                catchError(error => {
                    return of(error);
                }));
    }

    logout() {
        this.doLogoutUser();
        this.router.navigate(['/login']);
        this.userSubject.next(null);
        // window.location.reload();
    }

    isLoggedIn() {
        return !!this.getJwtToken();
    }

    checkHasUsers() {
        return this.http.get<any>(`${environment.url}/api/user/check-has-users`).pipe(tap(data => {
            this.hasUsers = data.message > 0;
        }));
    }

    refreshToken() {
        return this.http.post<any>(`${environment.url}/api/token/refresh`, {
            'refreshToken': this.getRefreshToken()
        }).pipe(tap((tokens: Tokens) => {
            this.storeJwtToken(tokens.token);
        }));
    }

    getJwtToken() {
        if (isPlatformBrowser(this.platformId)) {
            return this.localStorage.getItem(this.JWT_TOKEN);
        }
        if (isPlatformServer(this.platformId)) {
            var item = this.data.find(x => x.id == this.JWT_TOKEN);
            if(item)
            {
                return item.value;
            }
            
        }

    }

    fetchUser() {
        return this.http.get<any>(`${environment.url}/api/user/get-user`).pipe(tap(data => {
            this.storeUser(data);
            this.userSubject.next(data);
        })).subscribe();

    }

    inAccess(access: string) {
        if( this.getUser ) {
            const roles = this.getUser.roles;
            if( ! roles ) return false;
            
            // if roles has ROLE_ADMIN return true
            if( roles.includes('ROLE_ADMIN') ) return true;
            
            return this.getUser.access.includes(access);
        }

        return false;
    }

    public get getUser(): User {
        return this.userSubject.value;
    }

    public doLoginUser(tokens: Tokens) {
        this.storeTokens(tokens);
        this.fetchUser();
    }

    public doLogoutUser() {
        // this.user = null;
        this.removeTokens();
        this.removeUser();
    }

    private getRefreshToken() {
        if (isPlatformBrowser(this.platformId)) {
            return this.localStorage.getItem(this.REFRESH_TOKEN);
        }
        if (isPlatformServer(this.platformId)) {
            var item = this.data.find(x => x.id == this.REFRESH_TOKEN);

            return item.value;
        }

    }

    private storeJwtToken(jwt: string) {
        if (isPlatformBrowser(this.platformId)) {
            this.localStorage.setItem(this.JWT_TOKEN, jwt);
        }
        if (isPlatformServer(this.platformId)) {
            this.data.push({ 'id' : this.JWT_TOKEN , 'value': jwt});
        }

    }

    private storeTokens(tokens: Tokens) 
    {
        if (isPlatformBrowser(this.platformId)) {
            this.localStorage.setItem(this.JWT_TOKEN, tokens.token);
            this.localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
        }
        if (isPlatformServer(this.platformId)) {
            this.data.push({ 'id' : this.JWT_TOKEN , 'value': tokens.token});
            this.data.push({ 'id' : this.REFRESH_TOKEN , 'value': tokens.refreshToken});
        }
    }

    private removeTokens() {
        if (isPlatformBrowser(this.platformId)) {
            this.localStorage.removeItem(this.JWT_TOKEN);
            this.localStorage.removeItem(this.REFRESH_TOKEN);
        }
        if (isPlatformServer(this.platformId)) {
            var index = this.data.findIndex(x=> x.id == this.JWT_TOKEN );

            if( index !== -1 ) {
                this.data.splice(index, 1);
            }
            var index = this.data.findIndex(x=> x.id == this.REFRESH_TOKEN );

            if( index !== -1 ) {
                this.data.splice(index, 1);
            }
        }


    }

    private storeUser(user: User) {
        if (isPlatformBrowser(this.platformId)) {
            this.localStorage.setItem('USER', JSON.stringify(user));
        }

        if (isPlatformServer(this.platformId)) {
            this.data.push({ 'id' : 'USER' , 'value': JSON.stringify(user)});

        }
    }

    private removeUser() {
        if (isPlatformBrowser(this.platformId)) {
            this.localStorage.removeItem('USER');
        }
        if (isPlatformServer(this.platformId)) {
            var index = this.data.findIndex(x=> x.id == "USER" );

            if( index !== -1 ) {
                this.data.splice(index, 1);
            }
        }
    }
}
