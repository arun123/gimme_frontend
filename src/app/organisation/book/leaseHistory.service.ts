import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { LeaseHistory } from './leaseHistory.model';

@Injectable({
    providedIn: 'root'
})
export class LeaseHistoryService {

    private leaseHistoryUrl: string = environment.url+'/api/lease-histories';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient
    ) { }

    getLeaseHistory(id: string): Observable<LeaseHistory> {
        const url = `${this.leaseHistoryUrl}/${id}`;
        return this.http.get<LeaseHistory>(url, this.httpOptions);
    }

    getLeaseHistories(user_id): Observable<LeaseHistory[]> {
        let headers = new HttpHeaders({
            'accept':  'application/json',
            'Content-Type' : 'application/json',
          });
        let params = new HttpParams().set('isDeleted', 'false');
        return this.http.get<LeaseHistory[]>(this.leaseHistoryUrl + `/${user_id}`, { headers, params: params } );
    }

    addLeaseHistory(leaseHistory: LeaseHistory): Observable<LeaseHistory> {
        return this.http.post<LeaseHistory>(this.leaseHistoryUrl, JSON.stringify(leaseHistory), this.httpOptions).pipe(
            tap((LeaseHistory:LeaseHistory) => console.log()),
            catchError(error => of(new LeaseHistory()))
        );
    }

    updateLeaseHistory(leaseHistory: LeaseHistory): Observable<LeaseHistory> {
        return this.http.put<LeaseHistory>(this.leaseHistoryUrl + `/${leaseHistory.id}`, JSON.stringify(leaseHistory), this.httpOptions).pipe(
            tap((LeaseHistory:LeaseHistory) => console.log())
        );
    }

    deleteLeaseHistory(leaseHistory: LeaseHistory): Observable<LeaseHistory> {
        return this.http.delete<LeaseHistory>(this.leaseHistoryUrl + `/${leaseHistory.id}`, this.httpOptions).pipe(
            tap((LeaseHistory:LeaseHistory) => console.log())
        );
    }
}
