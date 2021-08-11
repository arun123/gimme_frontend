import { Injectable } from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { RoleService } from '@shared/services/role.service';
import { Role } from '@role/role.model';

@Injectable({
    providedIn: 'root'
})
export class RoleDataSource implements DataSource<Role> {

    private roleSubject = new BehaviorSubject<Role[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(
        private roleService: RoleService
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<Role[]> {
        return this.roleSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.roleSubject.complete();
        this.loadingSubject.complete();
    }

    loadRoles() {
        this.loadingSubject.next(true);

        this.roleService.getRoles().pipe(
            tap((roles: Role[]) => console.log()),
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(roles => this.roleSubject.next(roles));
    }
}
