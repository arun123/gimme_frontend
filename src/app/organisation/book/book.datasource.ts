import { Injectable } from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Book } from './book.model';
import { BookService } from './book.service';


@Injectable({
    providedIn: 'root'
})
export class BookDataSource implements DataSource<Book> {

    private bookSubject = new BehaviorSubject<Book[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(
        private bookService: BookService
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<Book[]> {
        return this.bookSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.bookSubject.complete();
        this.loadingSubject.complete();
    }

    loadBooks() {
        this.loadingSubject.next(true);

        this.bookService.getBooks().pipe(
            tap((books: Book[]) => console.log()),
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(books => this.bookSubject.next(books));
    }
}
