import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RoleDialogComponent } from '@org/role/role-dialog/role-dialog.component';
import { Utilities } from '@shared/components/utilities.component';
import { Genre } from '../genre.model';
import { GenreService } from '../genre.service';

@Component({
  selector: 'app-genre-dialog',
  templateUrl: './genre-dialog.component.html',
  styleUrls: ['./genre-dialog.component.scss']
})
export class GenreDialogComponent implements OnInit {
  genre: Genre;
  genreForm: FormGroup;


  constructor(
      private dialogRef: MatDialogRef<GenreDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data,
      private fb: FormBuilder,
      private genreService: GenreService,
      private utilities: Utilities
  ) { 
   }

  ngOnInit() {
      let name = '';
      if( this.data.dialogType === 'Edit' ) {
          name = this.data.genre.name;          

      }
      this.genreForm = new FormGroup({
          'name': new FormControl(name, Validators.required),
      });
  }

  close() {
      this.dialogRef.close();
  }

  onSubmit() {
      let genre = new Genre;
      genre = this.genreForm.value;

      if( this.data.dialogType === 'Create' ) {
          this.genreService.addGenre(genre).subscribe( result => {
              if( result.id ) {
                  this.utilities.notifySuccess('Genre', 'added');
                  this.close();
              } else {
                  this.utilities.notifyError('Genre not added');
              }
          });
      } else {
          genre.id = this.data.genre.id;
          this.genreService.addGenre(genre).subscribe( result => {
              this.utilities.notifySuccess('Genre', 'updated');
              this.close();
          });
      }
  }

}
