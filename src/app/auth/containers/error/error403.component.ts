import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-403',
    templateUrl: './error403.component.html',
    styleUrls: ['./error.component.scss']
})
export class Error403Component implements OnInit {

    returnUrl: string

    constructor( 
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
    }
}
