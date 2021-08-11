import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { Role } from '@role/role.model';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RoleService {

    private rolesUrl: string = environment.url+'/api/roles';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient
    ) { }

    getRole(id: string): Observable<Role> {
        const url = `${this.rolesUrl}/${id}`;
        return this.http.get<Role>(url, this.httpOptions);
    }

    getRoles(): Observable<Role[]> {
        let headers = new HttpHeaders({
            'accept':  'application/json',
            'Content-Type' : 'application/json',
          });
        let params = new HttpParams().set('isDeleted', 'false');
        return this.http.get<Role[]>(this.rolesUrl, { headers, params: params } );
    }

    addRole(role: Role): Observable<Role> {
        return this.http.post<Role>(this.rolesUrl, JSON.stringify(role), this.httpOptions).pipe(
            tap((role:Role) => console.log()),
            catchError(error => of(new Role()))
        );
    }

    updateRole(role: Role): Observable<Role> {
        return this.http.put<Role>(this.rolesUrl + `/${role.id}`, JSON.stringify(role), this.httpOptions).pipe(
            tap((role:Role) => console.log())
        );
    }

    deleteRole(Role: Role): Observable<Role> {
        return this.http.delete<Role>(this.rolesUrl + `/${Role.id}`, this.httpOptions).pipe(
            tap((role:Role) => console.log())
        );
    }
}
