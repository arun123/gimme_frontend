import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { NavItem } from '../nav-item.model';
import { NavigationService } from '../navigation.service';

import { AuthService } from '@auth/services/auth.service';
import { User } from '@user/user.model';

@Component({
    selector: 'app-menu-list-item',
    templateUrl: './menu-list-item.component.html',
    styles: [`
        .sub-menu {
            background-color: #e7e7e7;
        }
        .sub-menu:hover {
            background-color: #ccc;
        }
    `],
    animations: [
        trigger('indicatorRotate', [
            state('collapsed', style({transform: 'rotate(0deg)'})),
            state('expanded', style({transform: 'rotate(180deg)'})),
            transition('expanded <=> collapsed',
            animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
            ),
        ])
    ]
})

export class MenuListItemComponent implements OnInit {

    expanded: boolean;
    @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
    @Input() item: NavItem;
    @Input() depth: number;
    @Input() isParent: boolean;
    user: User;
    rolesAccess: Object = {};
  
    constructor(
        public navService: NavigationService, 
        public router: Router, 
        private authService: AuthService
    ) {
        if( this.depth === undefined ) {
            this.depth = 0;
        }

        this.user = this.authService.getUser;
    }

    ngOnInit() {
        this.navService.currentUrl.subscribe((url: string) => {
            if (this.item.route && url) {
                this.expanded = url.indexOf(`/${this.item.route}`) === 0;
                this.ariaExpanded = this.expanded;
            }
        });
    }

    onItemSelected(item: NavItem) {
        if( !item.children || !item.children.length ) {
          this.router.navigate(['/admin', item.route]);
        //  this.navService.closeNav();
        }
        if( item.children && item.children.length ) {
          this.expanded = !this.expanded;
        }
    }

    inRoles(item: NavItem) {
        if( this.user ) {
            const roles = this.user.roles;

            if( ! roles ) return false;
            
            // if roles has ROLE_ADMIN return true
            if( roles.includes('ROLE_ADMIN') ) return true;

            const name = item.name ? item.name : '';

            if( item.children ) {
                return item.children.some(child => this.inRoles(child));
            } else if( item.crud ) {
                return item.crud.some(child => this.inRoles(child));
            }

            return this.user.access.includes(name);
        }

        return false;
    }
}
