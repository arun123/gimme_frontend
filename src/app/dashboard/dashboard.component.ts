import { Component, OnInit } from '@angular/core';
import { count, map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { StockService } from '@org/stock/stock.service';
import { Utilities } from '@shared/components/utilities.component';
import { StockDataSource } from '@org/stock/stock.datasource';
import { Stock } from '@org/stock/stock.model';
import { LeaseHistory } from '@org/book/leaseHistory.model';
import { User } from '@org/user/user.model';
import { AuthService } from '@auth/services/auth.service';
import { LeaseHistoryService } from '@org/book/leaseHistory.service';
import { LeaseHistoryDataSource } from '@org/book/leaseHistory.datasource';
import * as moment from 'moment';
import { StockComponent } from '@org/stock/stock.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent   {
  /** Based on the screen size, switch from standard to one column per row */
  stocks: Stock[];
  user: User;
  dataSource: StockDataSource;
  displayedColumns: string[] = ['name', 'author','genre', 'stock', 'actions'];
  dataSourceLH: LeaseHistoryDataSource
  displayedColumnsLH: string[] = ['name', 'author','genre', 'dueDate','returned', 'actions'];


  constructor(
    private dialog: MatDialog,
    private stockService: StockService,
    private authService: AuthService,
    private leaseService: LeaseHistoryService,
    private utilities: Utilities
  ) { }

  ngOnInit(): void {
    if(this.authService.user) 
    {
        this.authService.user.subscribe(x => this.user = x);
    }

    this.dataSourceLH = new LeaseHistoryDataSource(this.leaseService);
    this.dataSourceLH.loadLeaseHistories(this.user.id);

    this.dataSource = new StockDataSource(this.stockService);
    this.dataSource.loadStocks();



  }


  leaseBook(stock){
    let leaseHistory = new LeaseHistory();
    leaseHistory.stock = stock;
    leaseHistory.lessee = this.user;

    this.leaseService.addLeaseHistory(leaseHistory).subscribe( result => {
      if( result.id ) {
          this.utilities.notifySuccess('book', 'leased');
          this.dataSource.loadStocks();
          this.dataSourceLH.loadLeaseHistories(this.user.id);
         // this.close();
      } else {
          this.utilities.notifyError("you have reached your limit please return some books to lease");
      }
  });

  }

  returnBook(leaseHistory){

    leaseHistory.returned = true;

    this.leaseService.updateLeaseHistory(leaseHistory).subscribe( result => {
      if( result.id ) {
          this.utilities.notifySuccess('book', 'returned');
          this.dataSource.loadStocks();
          this.dataSourceLH.loadLeaseHistories(this.user.id);
         // this.close();
      } else {
          this.utilities.notifyError('Could not process');
      }
  });

  }


    available(stock){
      let leased = stock.leaseHistories.filter(x=> x.returned == null );
      var count = 0;
      if(leased)
      {
        console.log(leased);
        leased.forEach(element => {
          count++;
        });
      }
      return stock.count - count;

    }

    getDate(date)
    {
      return moment(date).format('DD-MM-YYYY');
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;

      this.dataSource.loadStocks(filterValue.trim().toLowerCase());
    } 

}
