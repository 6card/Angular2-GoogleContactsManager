import {Component} from "@angular/core";
import { Http, Response, URLSearchParams } from "@angular/http";

import {AuthService} from "../services/auth.service";
import { Contact } from "../shared/contacts";

@Component({
    selector: 'contact-list',
    template: `
        <button *ngIf="authenticated" (click)="getContacts()" class="nav-link btn btn-danger-outline" href="#">Get Contacts</button>                 
        
        <div class="ui list" *ngIf="contacts.length > 0">
            <div class="item" *ngFor="let contact of contacts">                
                <img class="ui avatar image" src="{{contact.avatar}}">
                <div class="content">
                    <a class="header" [routerLink]="['/contact', contact.contactId]">{{contact.title}}</a>                     
                     <div class="description">{{contact.getPrimaryPhoneNumber()}}</div>
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


    getContacts() {
        //&max-results=1000
        let params: URLSearchParams = new URLSearchParams();

        params.set('v', '3.0');
        params.set('alt', 'json');
        params.set('access_token', this.authService.getToken());

        params.set('max-results', '1000');

        this.http.get('https://www.google.com/m8/feeds/contacts/default/full', {search: params})
            .map((res:Response) => res.json())
			.subscribe(data => {
			    	this.contacts = Contact.fromJSONArray(data.feed.entry, this.authService.getToken());
			    }, 
                err => {console.error(err);}
            );
        console.log(this.contacts);
    }

    

}