import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { Stock } from './stock.model';

@Injectable({
    providedIn: 'root'
})
export class StockService {

    private stockUrl: string = environment.url+'/api/stocks';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient
    ) { }

    getStock(id: string): Observable<Stock> {
        const url = `${this.stockUrl}/${id}`;
        return this.http.get<Stock>(url, this.httpOptions);
    }

    getStocks(): Observable<Stock[]> {
        let headers = new HttpHeaders({
            'accept':  'application/json',
            'Content-Type' : 'application/json',
          });
        let params = new HttpParams().set('isDeleted', 'false');
        return this.http.get<Stock[]>(this.stockUrl, { headers, params: params } );
    }

    addStock(stock: Stock): Observable<Stock> {
        return this.http.post<Stock>(this.stockUrl, JSON.stringify(stock), this.httpOptions).pipe(
            tap((stock:Stock) => console.log()),
            catchError(error => of(new Stock()))
        );
    }

    updateStock(stock: Stock): Observable<Stock> {
        return this.http.put<Stock>(this.stockUrl + `/${stock.id}`, JSON.stringify(stock), this.httpOptions).pipe(
            tap((stock:Stock) => console.log())
        );
    }

    deleteStock(stock: Stock): Observable<Stock> {
        return this.http.delete<Stock>(this.stockUrl + `/${stock.id}`, this.httpOptions).pipe(
            tap((stock:Stock) => console.log())
        );
    }
}
