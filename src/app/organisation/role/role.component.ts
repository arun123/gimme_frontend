
import { Component, OnInit } from '@angular/core';
import { RoleDataSource } from './role.datasource';
import { Role } from '@role/role.model';
import { RoleService } from '@shared/services/role.service';
import { catchError, finalize } from 'rxjs/operators';
import { of, BehaviorSubject } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { Utilities } from '@shared/components/utilities.component';

@Component({
    selector: 'app-role',
    templateUrl: './role.component.html',
    styles: ['./role.component.scss']
})

export class RoleComponent implements OnInit {
    dataSource: RoleDataSource;
    displayedColumns: string[] = ['name', 'role', 'actions'];

    loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    
    constructor(
        private dialog: MatDialog,
        private roleService: RoleService,
        private utilities: Utilities
    ) { }

    ngOnInit(): void {
        this.dataSource = new RoleDataSource(this.roleService);
        this.dataSource.loadRoles();
    }

    openRoleDialog(dialogType: string, role?: Role): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = 'auto';
        dialogConfig.height = 'auto';
        dialogConfig.data = {
            dialogType: dialogType,
            role: role
        };
  
        const dialogRef = this.dialog.open(RoleDialogComponent, dialogConfig);   
        
        dialogRef.afterClosed().subscribe(result => {
            this.dataSource.loadRoles();
        });
    }

    onDelete(disease: Role) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '400px';
    
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(dialogResult => {
            if( dialogResult ) {
                this.loadingSubject.next(true);
                this.roleService.deleteRole(disease).pipe(
                    catchError(() => of([])),
                    finalize(() => this.loadingSubject.next(false))
                ).subscribe( result => {
                    this.utilities.notifySuccess("Role", "deleted");
                    this.dataSource.loadRoles();
                });
            }
        });
      }

}
