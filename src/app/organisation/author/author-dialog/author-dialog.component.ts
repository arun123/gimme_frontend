import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RoleDialogComponent } from '@org/role/role-dialog/role-dialog.component';
import { Utilities } from '@shared/components/utilities.component';
import { RoleService } from '@shared/services/role.service';
import { Author } from '../author.model';
import { AuthorService } from '../author.service';

@Component({
  selector: 'app-author-dialog',
  templateUrl: './author-dialog.component.html',
  styleUrls: ['./author-dialog.component.scss']
})
export class AuthorDialogComponent implements OnInit {
  author: Author;
  authorForm: FormGroup;


  constructor(
      private dialogRef: MatDialogRef<RoleDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data,
      private fb: FormBuilder,
      private authorService: AuthorService,
      private utilities: Utilities
  ) { 
   }

  ngOnInit() {
      let name = '';
      if( this.data.dialogType === 'Edit' ) {
          name = this.data.author.name;
        
      }
      this.authorForm = new FormGroup({
          'name': new FormControl(name, Validators.required),
      });
  }

  close() {
      this.dialogRef.close();
  }

  onSubmit() {
      let author = new Author;
      author = this.authorForm.value;

      if( this.data.dialogType === 'Create' ) {
          this.authorService.addAuthor(author).subscribe( result => {
              if( result.id ) {
                  this.utilities.notifySuccess('Author', 'added');
                  this.close();
              } else {
                  this.utilities.notifyError('Author not added');
              }
          });
      } else {
          author.id = this.data.author.id;
          this.authorService.updateAuthor(author).subscribe( result => {
              this.utilities.notifySuccess('Author', 'updated');
              this.close();
          });
      }
  }

}
