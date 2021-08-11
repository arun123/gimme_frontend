import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../navigation.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { AuthService } from '@auth/services/auth.service';
import { User } from '@user/user.model';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  setMinWidth$: Observable<boolean>;
  user: User;

  constructor(
      public navigationService: NavigationService,
      private router: Router,
      private route: ActivatedRoute,
      public authService: AuthService,
  ) { }

  ngOnInit() {
      this.getTopNavWidth();
      // this.user = this.authService.getUser;
      if(this.authService.user) 
      {
          this.authService.user.subscribe(x => this.user = x);
      }
      
  }

  getTopNavWidth() {
      this.setMinWidth$ = this.router.events.pipe(
          filter( e => e instanceof NavigationEnd),
          map(() => this.route),
          map(route => {
              while( route.firstChild ) {
                  route = route.firstChild;
              }
              return route;
          }),
          mergeMap(route => route.data),
          map(data => data.hasOwnProperty('setMinWidth') ? data.setMinWidth : false),
      )
  }
}
