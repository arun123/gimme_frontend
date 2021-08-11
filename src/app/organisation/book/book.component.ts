import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { Utilities } from '@shared/components/utilities.component';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { BookDialogComponent } from './book-dialog/book-dialog.component';
import { BookDataSource } from './book.datasource';
import { Book } from './book.model';
import { BookService } from './book.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  dataSource: BookDataSource
  displayedColumns: string[] = ['name', 'actions'];

  loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  
  constructor(
      private dialog: MatDialog,
      private bookService: BookService,
      private utilities: Utilities
  ) { }

  ngOnInit(): void {
      this.dataSource = new BookDataSource(this.bookService);
      this.dataSource.loadBooks();
  }

  openBookDialog(dialogType: string, book?: Book): void {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = 'auto';
      dialogConfig.height = 'auto';
      dialogConfig.data = {
          dialogType: dialogType,
          book: book
      };

      const dialogRef = this.dialog.open(BookDialogComponent, dialogConfig);   
      
      dialogRef.afterClosed().subscribe(result => {
          this.dataSource.loadBooks();
      });
  }

  onDelete(Book: Book) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '400px';
  
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(dialogResult => {
          if( dialogResult ) {
              this.loadingSubject.next(true);
              this.bookService.deleteBook(Book).pipe(
                  catchError(() => of([])),
                  finalize(() => this.loadingSubject.next(false))
              ).subscribe( result => {
                  this.utilities.notifySuccess("Book", "deleted");
                  this.dataSource.loadBooks();
              });
          }
      });
    }

}
