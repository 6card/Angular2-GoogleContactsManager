import { Component } from "@angular/core";
import { Http, Response, URLSearchParams } from "@angular/http";

import { AuthService } from "../services/auth.service";
import { Contact } from "../shared/contacts";

import { Observable } from 'rxjs/Observable';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
    selector: 'contact-list',
    template: `
        <button *ngIf="authenticated" (click)="loadContacts()" class="nav-link btn btn-danger-outline" href="#">Get Contacts</button>                 
        
        <div class="ui list" *ngIf="contacts.length > 0">
            <div class="item" *ngFor="let contact of contacts">                
                <img class="ui avatar image" src="{{contact.avatar}}">
                <div class="content">
                    <a class="header" [routerLink]="['/contact', contact.contactId]">{{contact.title.$t}}</a>                     

                </div>
            </div>
        </div>
    `
})

export class ContactList {

    contacts: Contact[] = [];

    constructor(private authService: AuthService, private http: Http ) {

    }

    get authenticated() {
        return this.authService.isAuthenticated();
    }


    getContacts() : Observable<Contact[]> {
        //&max-results=1000
        let params: URLSearchParams = new URLSearchParams();

        params.set('v', '3.0');
        params.set('alt', 'json');
        params.set('access_token', this.authService.getToken());

        //params.set('max-results', '1000');

        return this.http.get('https://www.google.com/m8/feeds/contacts/default/full', {search: params})
            .map((res:Response) => res.json().feed.entry)
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
            /*
			.subscribe(data => {
			    	this.contacts = Contact.fromJSONArray(data.feed.entry, this.authService.getToken());
			    }, 
                err => {console.error(err);}
            );
            */

    }

    loadContacts() {
        // Get all comments
         this.getContacts()
                .subscribe(
                    contacts => this.contacts = contacts, //Bind to view
                    err => {
                        // Log errors if any
                        console.log(err);
                    });
    }

    

}