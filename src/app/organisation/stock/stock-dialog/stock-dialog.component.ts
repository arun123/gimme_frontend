import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Book } from '@org/book/book.model';
import { BookService } from '@org/book/book.service';
import { Utilities } from '@shared/components/utilities.component';
import { Stock } from '../stock.model';
import { StockService } from '../stock.service';

@Component({
  selector: 'app-stock-dialog',
  templateUrl: './stock-dialog.component.html',
  styleUrls: ['./stock-dialog.component.scss']
})
export class StockDialogComponent implements OnInit {
  books: Book[];
  stockForm: FormGroup;


  constructor(
      private dialogRef: MatDialogRef<StockDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data,
      private fb: FormBuilder,
      private bookService: BookService,
      private stockService: StockService,
      private utilities: Utilities
  ) { 
   }

  ngOnInit() {
      let book = '';
      let count =0;
      if( this.data.dialogType === 'Edit' && this.data.stock ) {        
          book = this.data.stock.book;       
          count = this.data.stock.count;       
      }

      this.getBooks();

      this.stockForm = new FormGroup({
          'book': new FormControl(book, Validators.required),
          'count': new FormControl(count, Validators.required),
      });
  }

  getBooks() {
    this.bookService.getBooks().subscribe( books => this.books = books );
  }

  close() {
      this.dialogRef.close();
  }

  onSubmit() {
      let stock = new Stock;
      stock = this.stockForm.value;


      if( this.data.dialogType === 'Create' ) {
          this.stockService.addStock(stock).subscribe( result => {
              if( result.id ) {
                  this.utilities.notifySuccess('stock', 'added');
                  this.close();
              } else {
                  this.utilities.notifyError('stock not added');
              }
          });
      } else {
          stock.id = this.data.stock.id;

          this.stockService.updateStock(stock).subscribe( result => {
              this.utilities.notifySuccess('stock', 'updated');
              this.close();
          });
      }
  }

  compareObjFn(objOne, objTwo) {
        if( objOne && objTwo ) {
            return objOne.id === objTwo.id;
        }
   }

}
