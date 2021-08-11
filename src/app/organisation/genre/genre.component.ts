import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { Utilities } from '@shared/components/utilities.component';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { GenreDialogComponent } from './genre-dialog/genre-dialog.component';
import { GenreDataSource } from './genre.datasource';
import { Genre } from './genre.model';
import { GenreService } from './genre.service';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss']
})
export class GenreComponent implements OnInit {
  dataSource: GenreDataSource;
  displayedColumns: string[] = ['name', 'actions'];

  loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  
  constructor(
      private dialog: MatDialog,
      private genreService: GenreService,
      private utilities: Utilities
  ) { }

  ngOnInit(): void {
      this.dataSource = new GenreDataSource(this.genreService);
      this.dataSource.loadGenres();
  }

  openGenreDialog(dialogType: string, genre?: Genre): void {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = 'auto';
      dialogConfig.height = 'auto';
      dialogConfig.data = {
          dialogType: dialogType,
          genre: genre
      };

      const dialogRef = this.dialog.open(GenreDialogComponent, dialogConfig);   
      
      dialogRef.afterClosed().subscribe(result => {
          this.dataSource.loadGenres();
      });
  }

  onDelete(genre: Genre) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '400px';
  
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(dialogResult => {
          if( dialogResult ) {
              this.loadingSubject.next(true);
              this.genreService.deleteGenre(genre).pipe(
                  catchError(() => of([])),
                  finalize(() => this.loadingSubject.next(false))
              ).subscribe( result => {
                  this.utilities.notifySuccess("Genre", "deleted");
                  this.dataSource.loadGenres();
              });
          }
      });
    }
}
