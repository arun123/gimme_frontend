import { Injectable } from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Book } from './book.model';
import { LeaseHistoryService } from './leaseHistory.service';
import { LeaseHistory } from './leaseHistory.model';


@Injectable({
    providedIn: 'root'
})
export class LeaseHistoryDataSource implements DataSource<LeaseHistory> {

    private leaseHistorySubject = new BehaviorSubject<LeaseHistory[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(
        private leaseHistory: LeaseHistoryService
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<LeaseHistory[]> {
        return this.leaseHistorySubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.leaseHistorySubject.complete();
        this.loadingSubject.complete();
    }

    loadLeaseHistories(user_id) {
        this.loadingSubject.next(true);

        this.leaseHistory.getLeaseHistories(user_id).pipe(
            tap((leaseHistories: LeaseHistory[]) => console.log()),
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(leaseHistories => this.leaseHistorySubject.next(leaseHistories));
    }
}
