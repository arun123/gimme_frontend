import { Injectable } from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, finalize, tap } from 'rxjs/operators';
import { Stock } from './stock.model';
import { StockService } from './stock.service';


@Injectable({
    providedIn: 'root'
})
export class StockDataSource implements DataSource<Stock> {

    private StockSubject = new BehaviorSubject<Stock[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);


    public loading$ = this.loadingSubject.asObservable();

    constructor(
        private stockService: StockService
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<Stock[]> {
        return this.StockSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.StockSubject.complete();
        this.loadingSubject.complete();
    }

    loadStocks(filter= "") {
        this.loadingSubject.next(true);
        var ctx = this;
        this.stockService.getStocks().pipe(
            tap((stocks: Stock[]) => console.log()),
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(function(stocks){
            let stocksFiltered = stocks.filter(x => x.book.name.toLowerCase().includes(filter)  );
            console.log(filter);
            ctx.StockSubject.next(stocks)
        } );
    }
}
