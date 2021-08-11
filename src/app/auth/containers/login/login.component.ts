import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    form: FormGroup;
    isFormReady: boolean = false;
    returnUrl: string

    errorMsg:string = '';
    request:any;

    matcher = new MyErrorStateMatcher();

    constructor(
        public authService: AuthService, 
        private formBuilder: FormBuilder, 
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: [''],
            password: ['']
        });

        this.authService.checkHasUsers().subscribe(data => {
            this.authService.hasUsers = data.message > 0;

            if( ! this.authService.hasUsers ) {
                this.form = this.formBuilder.group({
                    username: [''],
                    password: [''],
                    confirmPass: ['']
                }, { validator: this.checkPasswords });
            }

            this.isFormReady = true;
        });

        this.request = { message: 'Please enter your credentials.' };
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
    }

    get f() {
        return this.form.controls; 
    }
    

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        let pass = group.get('password').value;
        let confirmPass = group.get('confirmPass').value;

        return pass === confirmPass ? null : { notSame: true }     
    }

    login() {
        this.errorMsg = '';
        this.request = {
            message: 'Loging in. Please wait...'
        };
        this.authService.login(
            {
                username: this.f.username.value,
                password: this.f.password.value
            }
        )
        .subscribe(data => {
            if( data === true )  {
                // get user data
                this.request = { message: 'Login successfull! Redirecting...' };
                this.authService.user.subscribe(x => {
                    if( x ) {
                        this.router.navigate([this.returnUrl]);
                    }
                });
                // window.location.reload();
            } else if( data.error ) {
                if( data.error.code == 401 ) {
                    this.errorMsg = data.error.message;
                    this.request = null;
                } else {
                    this.errorMsg = `Opps! Something went wrong!`;
                }
            }
        });
    }
    
    register() {
        this.errorMsg = '';
        this.request = {
            message: 'Please wait...'
        };
        this.authService.register(
            {
                username: this.f.username.value,
                password: this.f.password.value
            }
        )
        .subscribe(data => {
            if( data === true )  {
                this.request = { message: 'Register successfull! Redirecting...' };
                this.authService.hasUsers = true;
                this.login();
            } else if( data.error ) {
                this.errorMsg = data.error.message;
                this.request = null;
            }
        });
    }

}
