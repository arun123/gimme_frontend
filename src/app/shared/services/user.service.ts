import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { User } from '@user/user.model';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private usersUrl: string = environment.url+'/api/users';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient
    ) { }

    getUser(id: string): Observable<User> {
        const url = `${this.usersUrl}/${id}`;
        return this.http.get<User>(url, this.httpOptions);
    }

    getUsers(): Observable<User[]> {
        let headers = new HttpHeaders({
            'accept':  'application/json',
            'Content-Type' : 'application/json',
          });
        let params = new HttpParams().set('isDeleted', 'false');
        return this.http.get<User[]>(this.usersUrl, { headers, params: params } );
    }

    addUser(user: User): Observable<User> {
        return this.http.post<User>(this.usersUrl, JSON.stringify(user), this.httpOptions).pipe(
            tap((user:User) => console.log()),
            catchError(error => of(new User()))
        );
    }

    updateUser(user: User): Observable<User> {
        return this.http.put<User>(this.usersUrl + `/${user.id}`, JSON.stringify(user), this.httpOptions).pipe(
            tap((User:User) => console.log())
        );
    }

    deleteUser(User: User): Observable<User> {
        return this.http.delete<User>(this.usersUrl + `/${User.id}`, this.httpOptions).pipe(
            tap((User:User) => console.log())
        );
    }
}
