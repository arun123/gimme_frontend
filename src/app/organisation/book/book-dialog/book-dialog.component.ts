import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSelectionList, MAT_DIALOG_DATA } from '@angular/material';
import { Author } from '@org/author/author.model';
import { AuthorService } from '@org/author/author.service';
import { Genre } from '@org/genre/genre.model';
import { GenreService } from '@org/genre/genre.service';
import { RoleDialogComponent } from '@org/role/role-dialog/role-dialog.component';
import { Utilities } from '@shared/components/utilities.component';
import { RoleService } from '@shared/services/role.service';
import { Book } from '../book.model';
import { BookService } from '../book.service';


@Component({
  selector: 'app-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrls: ['./book-dialog.component.scss']
})
export class BookDialogComponent implements OnInit {
  book: Book;
  bookForm: FormGroup;
  authors: Author[];
  genres: Genre[];
  selectedGenres: Genre[];

  constructor(
      private dialogRef: MatDialogRef<RoleDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data,
      private fb: FormBuilder,
      private bookService: BookService,
      private authorService: AuthorService,
      private genreService: GenreService,
      private utilities: Utilities
  ) { 
   }

  ngOnInit() {
      let name = '';
      let author = '';
      this.selectedGenres = [];
      if( this.data.dialogType === 'Edit' && this.data.book ) {
          name = this.data.book.name;          
          author = this.data.book.author;       
          this.selectedGenres = this.data.book.author;       
      }

      this.getAuthors();
      this.getGenres();
      
      this.bookForm = new FormGroup({
          'name': new FormControl(name, Validators.required),
          'author': new FormControl(author, Validators.required),
          'genres': new FormControl(this.selectedGenres, Validators.required)
      });
  }

  getAuthors() {
    this.authorService.getAuthors().subscribe( authors => this.authors = authors );
  }

  getGenres() {
    this.genreService.getGenres().subscribe( genres => this.genres = genres );
  }

  close() {
      this.dialogRef.close();
  }

  onSubmit() {
      let book = new Book;
      book = this.bookForm.value;
      book.genres = this.selectedGenres;

      if( this.data.dialogType === 'Create' ) {
          this.bookService.addBook(book).subscribe( result => {
              if( result.id ) {
                  this.utilities.notifySuccess('book', 'added');
                  this.close();
              } else {
                  this.utilities.notifyError('book not added');
              }
          });
      } else {
          book.id = this.data.book.id;
          book.genres = this.selectedGenres;
          this.bookService.updateBook(book).subscribe( result => {
              this.utilities.notifySuccess('book', 'updated');
              this.close();
          });
      }
  }

    onGenreChanged(genreList: MatSelectionList) {
    this.selectedGenres = genreList.selectedOptions.selected.map(item => item.value);
   }

  compareObjFn(objOne, objTwo) {
        if( objOne && objTwo ) {
            return objOne.id === objTwo.id;
        }
   }

   checkSelected(genreA: any, type: string) {
    if( this.data.dialogType === 'Edit' ) {
        let genres = this.data.book.genres;
        if( genres.find(genre => genre.id === genreA.id  ) ) { 
            return true;
        }
    }
    return false;
}


}
