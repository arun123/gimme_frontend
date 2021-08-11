import { Injectable } from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { UserService } from '@shared/services/user.service';
import { User } from '@user/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserDataSource implements DataSource<User> {

    private userSubject = new BehaviorSubject<User[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(
        private userService: UserService
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<User[]> {
        return this.userSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.userSubject.complete();
        this.loadingSubject.complete();
    }

    loadUsers() {
        this.loadingSubject.next(true);

        this.userService.getUsers().pipe(
            tap((users: User[]) => console.log()),
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(users => this.userSubject.next(users));
    }
}
