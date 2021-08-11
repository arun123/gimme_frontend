import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { Utilities } from '@shared/components/utilities.component';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthorDialogComponent } from './author-dialog/author-dialog.component';
import { AuthorDataSource } from './author.datasource';
import { Author } from './author.model';
import { AuthorService } from './author.service';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
})
export class AuthorComponent implements OnInit {
  dataSource: AuthorDataSource;
  displayedColumns: string[] = ['name', 'actions'];

  loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  
  constructor(
      private dialog: MatDialog,
      private authorService: AuthorService,
      private utilities: Utilities
  ) { }

  ngOnInit(): void {
      this.dataSource = new AuthorDataSource(this.authorService);
      this.dataSource.loadAuthors();
  }

  openAuthorDialog(dialogType: string, author?: Author): void {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = 'auto';
      dialogConfig.height = 'auto';
      dialogConfig.data = {
          dialogType: dialogType,
          author: author
      };

      const dialogRef = this.dialog.open(AuthorDialogComponent, dialogConfig);   
      
      dialogRef.afterClosed().subscribe(result => {
          this.dataSource.loadAuthors();
      });
  }

  onDelete(author: Author) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '400px';
  
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(dialogResult => {
          if( dialogResult ) {
              this.loadingSubject.next(true);
              this.authorService.deleteAuthor(author).pipe(
                  catchError(() => of([])),
                  finalize(() => this.loadingSubject.next(false))
              ).subscribe( result => {
                  this.utilities.notifySuccess("Author", "deleted");
                  this.dataSource.loadAuthors();
              });
          }
      });
    }

}
