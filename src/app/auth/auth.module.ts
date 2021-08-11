import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './containers/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatToolbarModule, MatCardModule } from '@angular/material';
import { AuthGuard } from '@auth/guards/auth.guard';
import { AuthService } from '@auth/services/auth.service';
import { UserGuard } from '@auth/guards/user.guard';
import { TokenInterceptor } from '@auth/token.interceptor';


@NgModule({
    declarations: [LoginComponent],
    providers: [
        AuthGuard,
        AuthService,
        UserGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
    ],
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatToolbarModule,
        MatCardModule
    ]
})
export class AuthModule { }
