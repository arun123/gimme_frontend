import { Injectable } from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { RoleService } from '@shared/services/role.service';
import { Author } from './author.model';
import { AuthorService } from './author.service';

@Injectable({
    providedIn: 'root'
})
export class AuthorDataSource implements DataSource<Author> {

    private authorSubject = new BehaviorSubject<Author[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(
        private authorService: AuthorService
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<Author[]> {
        return this.authorSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.authorSubject.complete();
        this.loadingSubject.complete();
    }

    loadAuthors() {
        this.loadingSubject.next(true);

        this.authorService.getAuthors().pipe(
            tap((roles: Author[]) => console.log()),
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(roles => this.authorSubject.next(roles));
    }
}
