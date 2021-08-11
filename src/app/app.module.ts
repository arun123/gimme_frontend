import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { DataTablesModule } from 'angular-datatables';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { environment } from 'environments/environment';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTable,
  MatTreeModule,
  MAT_DATE_FORMATS,
  MatBadgeModule,
  
} from '@angular/material';

import { Utilities, DATE_FORMAT } from '@shared/components/utilities.component';

// Login Module
import { AuthModule } from '@auth/auth.module';
import { Error403Component } from '@auth/containers/error/error403.component';


// Dashboard Module
import { DashboardComponent } from '@dashboard/dashboard.component';

// Navigation Module
import { NavigationService } from '@nav/navigation.service';
import { MainNavComponent } from '@nav/main-nav/main-nav.component';
import { MenuListItemComponent } from '@nav/menu-list-item/menu-list-item.component';
import { PageNotFoundComponent } from '@nav/page-not-found/page-not-found.component';
import { TopNavComponent } from '@nav/top-nav/top-nav.component';
import { BreadcrumbComponent } from '@nav/breadcrumb/breadcrumb.component';
import { RoleDialogComponent } from '@org/role/role-dialog/role-dialog.component';
import { UserDialogComponent } from '@org/user/user-dialog/user-dialog.component';

import { MessagesComponent } from '@shared/components/messages/messages.component';

import { MomentDateModule } from '@angular/material-moment-adapter'; 
import { UserComponent } from './organisation/user/user.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { RoleComponent } from '@org/role/role.component';
import { RouterModule } from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {InputNumberModule} from 'primeng/inputnumber';
import * as moment from 'moment';
import {CheckboxModule} from 'primeng/checkbox';
import {DropdownModule} from 'primeng/dropdown';
import {TooltipModule} from 'primeng/tooltip';
import { CardModule, ListboxModule, MessageModule, MessagesModule, MultiSelectModule, SidebarModule, TableModule, ToolbarModule } from 'primeng';
import { BookComponent } from './organisation/book/book.component';
import { AuthorComponent } from './organisation/author/author.component';
import { GenreComponent } from './organisation/genre/genre.component';
import { AuthorDialogComponent } from './organisation/author/author-dialog/author-dialog.component';
import { GenreDialogComponent } from '@org/genre/genre-dialog/genre-dialog.component';
import { BookDialogComponent } from '@org/book/book-dialog/book-dialog.component';
import { StockComponent } from './organisation/stock/stock.component';
import { StockDialogComponent } from './organisation/stock/stock-dialog/stock-dialog.component';

@NgModule({
  exports: [
      BrowserModule,
      MatAutocompleteModule,
      MatButtonModule,
      MatButtonToggleModule,
      MatCardModule,
      MatCheckboxModule,
      MatChipsModule,
      MatDatepickerModule,
      MatDialogModule,
      MatExpansionModule,
      MatGridListModule,
      MatIconModule,
      MatInputModule,
      MatListModule,
      MatMenuModule,
      MatPaginatorModule,
      MatProgressBarModule,
      MatProgressSpinnerModule,
      MatRadioModule,
      MatSortModule,
      MatRippleModule,
      MatSelectModule,
      MatSidenavModule,
      MatSlideToggleModule,
      MatSliderModule,
      MatSnackBarModule,
      MatStepperModule,
      MatTabsModule,
      MatTableModule,
      MatToolbarModule,
      MatTooltipModule,
      MatNativeDateModule,
      MatTreeModule,
      MatBadgeModule,
      MomentDateModule,
      TableModule,
      CardModule,
      ButtonModule,
      InputNumberModule,
      MessagesModule,
      MessageModule,
      ToolbarModule,
      MultiSelectModule,
      SidebarModule,
      ListboxModule,
      CheckboxModule,
      DropdownModule,
      TooltipModule,
      NgxMatSelectSearchModule
  ],
  providers: [
    { provide: 'LOCALSTORAGE', useFactory: getLocalStorage },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT }
],
  imports: [],
  declarations: [  ],

})
export class MaterialModule {}

export function getLocalStorage() {
return (typeof window !== "undefined") ? window.localStorage : null;
}


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MainNavComponent,
    TopNavComponent,
    MenuListItemComponent,
    UserComponent,
    RoleComponent,
    UserDialogComponent,
    RoleDialogComponent,
    Error403Component,
    TopNavComponent,
    PageNotFoundComponent,
    BreadcrumbComponent,
    MessagesComponent,
    ConfirmationDialogComponent,
    AuthorComponent,
    BookComponent, 
    GenreComponent,
    AuthorDialogComponent,
    GenreDialogComponent,
    BookDialogComponent,
    StockComponent,
    StockDialogComponent,
    Utilities,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    SimpleNotificationsModule.forRoot(),
    AuthModule,
    AngularFontAwesomeModule,
    DataTablesModule.forRoot(),
    ],
  entryComponents: [
    UserDialogComponent,
    RoleDialogComponent,
    ConfirmationDialogComponent,
    AuthorDialogComponent,
    GenreDialogComponent,
    BookDialogComponent,
    StockDialogComponent
  ],
  providers: [
    NavigationService,
    Utilities
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
