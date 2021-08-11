import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { Utilities } from '@shared/components/utilities.component';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { StockDialogComponent } from './stock-dialog/stock-dialog.component';
import { StockDataSource } from './stock.datasource';
import { Stock } from './stock.model';
import { StockService } from './stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {

  dataSource: StockDataSource
  displayedColumns: string[] = ['name','stock', 'actions'];

  loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  
  constructor(
      private dialog: MatDialog,
      private stockService: StockService,
      private utilities: Utilities
  ) { }

  ngOnInit(): void {
      this.dataSource = new StockDataSource(this.stockService);
      this.dataSource.loadStocks();
  }

  openStockDialog(dialogType: string, stock?: Stock): void {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = 'auto';
      dialogConfig.height = 'auto';
      dialogConfig.data = {
          dialogType: dialogType,
          stock: stock
      };

      const dialogRef = this.dialog.open(StockDialogComponent, dialogConfig);   
      
      dialogRef.afterClosed().subscribe(result => {
          this.dataSource.loadStocks();
      });
  }

  onDelete(stock: Stock) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '400px';
  
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(dialogResult => {
          if( dialogResult ) {
              this.loadingSubject.next(true);
              this.stockService.deleteStock(stock).pipe(
                  catchError(() => of([])),
                  finalize(() => this.loadingSubject.next(false))
              ).subscribe( result => {
                  this.utilities.notifySuccess("Stock", "deleted");
                  this.dataSource.loadStocks();
              });
          }
      });
    }
}
