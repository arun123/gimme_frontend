import { Component, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { iconsList } from '@assets/mat-icons-list';
import { environment } from 'environments/environment';
import { AuthService } from '@auth/services/auth.service';
import { NavItem } from '../nav-item.model';
import { NavigationService } from '../navigation.service';
import { User } from '@user/user.model';
import { accessList } from '@auth/models/access.list';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[NavigationService],
})
export class MainNavComponent implements AfterViewInit {
  @ViewChild('appDrawer', {static: false}) appDrawer: ElementRef;
  icons: string[] = iconsList;
  user: User;
  loggedIn: boolean;
  navItems = [];
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
      map(result => result.matches)
  );
 // version: string = environment.version || '1.0';

  constructor( 
      private breakpointObserver: BreakpointObserver, 
      private navigationService: NavigationService ,
      private authService: AuthService
  ) {
      if(this.authService.user)
      {
          this.authService.user.subscribe(x => this.user = x);
      }
      
      this.navItems = accessList;
  }

  isLoggedIn() {
      return this.authService.isLoggedIn();
  }

  ngAfterViewInit() {
      this.navigationService.appDrawer = this.appDrawer;
  }
}
