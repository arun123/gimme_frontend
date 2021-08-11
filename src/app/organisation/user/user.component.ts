
import { Component, OnInit } from '@angular/core';
import { UserDataSource } from './user.datasource';
import { User } from '@user/user.model';
import { UserService } from '@shared/services/user.service';
import { catchError, finalize } from 'rxjs/operators';
import { of, BehaviorSubject } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { Utilities } from '@shared/components/utilities.component';
import { RoleService } from '@shared/services/role.service';
import { AuthService } from '@auth/services/auth.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styles: ['./user.component.scss']
})

export class UserComponent implements OnInit {
    dataSource: UserDataSource;
    displayedColumns: string[] = ['email', 'roles', 'actions'];

    loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    roles = []
    
    constructor(
        private dialog: MatDialog,
        private userService: UserService,
        private utilities: Utilities,
        private roleService: RoleService,
        public authService: AuthService
    ) { }

    ngOnInit(): void {
        this.dataSource = new UserDataSource(this.userService);
        this.dataSource.loadUsers();
        this.roleService.getRoles().subscribe(data => {
            data.forEach((role, i) => {
                this.roles.push({ name: role.name, role: role.role});
            });
        });
    }

    roleName(roles: Array<string>) {
        const _roles = [];
        this.roles.forEach((o, i) => {
            if( roles.includes(o.role) ) {
                _roles.push(o.name);
            }
        });
        return _roles.join(' | ');
    }

    openUserDialog(dialogType: string, user?: User): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = 'auto';
        dialogConfig.height = 'auto';
        dialogConfig.data = {
            dialogType: dialogType,
            user: user ? user : new User
        };
  
        const dialogRef = this.dialog.open(UserDialogComponent, dialogConfig);   
        
        dialogRef.afterClosed().subscribe( result => {
            if( result ) {
                this.dataSource.loadUsers();
            }
        });
    }

    onDelete(disease: User) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '400px';
    
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(dialogResult => {
            if( dialogResult ) {
                this.loadingSubject.next(true);
                this.userService.deleteUser(disease).pipe(
                    catchError(() => of([])),
                    finalize(() => this.loadingSubject.next(false))
                ).subscribe( result => {
                    this.utilities.notifySuccess("User", "deleted");
                    this.dataSource.loadUsers();
                });
            }
        });
      }

}
