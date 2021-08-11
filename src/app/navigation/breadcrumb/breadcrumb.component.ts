import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnChanges {
    @Input() item: string;
    @Input() items: Array<string>;

    breadcrumbs: Array<any> = [];
    constructor( 
        private authService: AuthService
    ) {
        
    }

    ngOnChanges() {
        if( ! this.items ) return;
        
        this.breadcrumbs = [];

        this.items.forEach( item => {
            let _items = item.split(':');
            this.breadcrumbs.push({
                name: _items[0],
                path: _items[1] ? _items[1] : ''
            });
        });
    }
}
