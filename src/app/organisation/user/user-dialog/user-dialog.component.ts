import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UserService } from '@shared/services/user.service';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { User } from '@user/user.model';
import { RoleService } from '@shared/services/role.service';
import { Utilities } from '@shared/components/utilities.component';

@Component({
    selector: 'app-user-dialog',
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
    user: User;
    userForm: FormGroup;
    roles = [];
    type: string;

    constructor(
        private dialogRef: MatDialogRef<UserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: {dialogType: string, user: User},
        private fb: FormBuilder,
        private userService: UserService,
        private utilities: Utilities,
        private roleService: RoleService
    ) { }

    ngOnInit() {
        this.type = this.data.dialogType;
        this.user = this.data.user;

        this.userForm = new FormGroup({
            'email': new FormControl(this.user.email, Validators.required),
            'booklimit':  new FormControl(this.user.bookLimit, Validators.required),
            'roles': new FormArray([]),
            'password': new FormControl('', Validators.required),
            'plainPassword': new FormControl(''),
        });

        this.roleService.getRoles().subscribe(data => {
            data.forEach((role, i) => {
                this.roles.push({ name: role.name, role: role.role});
            });
            this.addCheckboxes(this.user.roles);
        });

    }

    getRoleControls() {
        return (this.userForm.get('roles') as FormArray).controls;
      }

    close() {
        this.dialogRef.close();
    }

    private addCheckboxes(roles = []) {
        this.roles.forEach((o, i) => {
          const control = new FormControl(roles.includes(o.role)); // if first item set to true, else false
          (this.userForm.controls.roles as FormArray).push(control);
        });
      }

    onSubmit() {
        let user = new User;
        // set plain password( required by api) and roles
        this.userForm.value.plainPassword = this.userForm.value.password;
        const selectedRoles = this.userForm.value.roles
            .map((v, i) => (v ? this.roles[i].role : null))
            .filter(v => v !== null);
        this.userForm.value.roles = selectedRoles;
        user = this.userForm.value;

        if( this.data.dialogType === 'Create' ) {
            this.userService.addUser(user).subscribe( result => {
                if( result.id ) {
                    this.utilities.notifySuccess('User', 'added');
                    this.close();
                } else {
                    this.utilities.notifyError('User not added');
                }
                this.dialogRef.close(result);
            });
        } else {
            user.id = this.data.user.id;
            this.userService.updateUser(user).subscribe( result => {
                this.utilities.notifySuccess('User', 'updated');
                this.dialogRef.close(result);
            });
        }
    }
}
