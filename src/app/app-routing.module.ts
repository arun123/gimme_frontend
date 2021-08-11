import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from '@auth/containers/login/login.component';
import { AuthGuard } from '@auth/guards/auth.guard';
import { UserGuard } from '@auth/guards/user.guard';
import { UserComponent } from '@org/user/user.component';
import { RoleComponent } from '@org/role/role.component';
import { Error403Component } from '@auth/containers/error/error403.component';
import { BookComponent } from '@org/book/book.component';
import { AuthorComponent } from '@org/author/author.component';
import { GenreComponent } from '@org/genre/genre.component';
import { StockComponent } from '@org/stock/stock.component';



const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
      path: 'login',
      component: LoginComponent,
      canActivate: [AuthGuard]
  },

  {
    path: 'admin',
    canActivate: [UserGuard],
    canActivateChild: [UserGuard],
    children: [
        { 
            path: 'dashboard', 
            component: DashboardComponent,
            data: {
                accessName: 'dashboard'
            }
        },
      { 
        path: 'users',
        component: UserComponent,
        data: {
            accessName: 'admin.users.view'
        }
    },
    { 
        path: 'roles',
        component: RoleComponent,
        data: {
            accessName: 'admin.roles'
        }
    },
    { 
      path: 'books',
      component: BookComponent,
      data: {
          accessName: 'books'
      }
  },
  { 
    path: 'authors',
    component: AuthorComponent,
    data: {
        accessName: 'authors'
    }
},
{ 
  path: 'genres',
  component: GenreComponent,
  data: {
      accessName: 'genres'
  }
},
{ 
    path: 'stocks',
    component: StockComponent,
    data: {
        accessName: 'stocks'
    }
  },


    { 
        path: '403',
        component: Error403Component 
    },
      ]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
