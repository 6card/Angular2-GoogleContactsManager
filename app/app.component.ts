import { Component } from '@angular/core';

import "rxjs/add/operator/map";

@Component({
    selector: 'app',
    templateUrl: './app/app.component.html',
    styleUrls: ['./app/app.component.css']
})
export class AppComponent {
    title: string;

    constructor() {
        this.title = 'Google Contacts Manager';	
    }
}