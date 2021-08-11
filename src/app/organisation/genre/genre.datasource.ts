import { Injectable } from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { RoleService } from '@shared/services/role.service';
import { GenreService } from './genre.service';
import { Genre } from './genre.model';


@Injectable({
    providedIn: 'root'
})
export class GenreDataSource implements DataSource<Genre> {

    private genreSubject = new BehaviorSubject<Genre[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(
        private genreService: GenreService
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<Genre[]> {
        return this.genreSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.genreSubject.complete();
        this.loadingSubject.complete();
    }

    loadGenres() {
        this.loadingSubject.next(true);

        this.genreService.getGenres().pipe(
            tap((genres: Genre[]) => console.log()),
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(genres => this.genreSubject.next(genres));
    }
}
