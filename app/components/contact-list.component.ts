import { Component } from "@angular/core";
import { Http, Response, URLSearchParams } from "@angular/http";

import { AuthService } from "../services/auth.service";
import { ContactService } from "../services/contact.service";
import { Contact } from "../shared/contacts";

import { Observable } from 'rxjs/Observable';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Component({
    selector: 'contact-list',
    template: `
        <button *ngIf="authenticated" (click)="loadContacts()" class="nav-link btn btn-danger-outline" href="#">Get Contacts</button>                 
        
        <div class="ui list" *ngIf="contacts.length > 0">
            <div class="item" *ngFor="let contact of contacts">                
                <img class="ui avatar image" src="{{getAvatarItem(contact)}}">
                <div class="content">
                    <a class="header" [routerLink]="['/contact', contact.contactId]">{{contact.title}}</a>                     
                    <div class="description">{{contact.primaryPhoneNumber}}</div>
                </div>
            </div>
        </div>
    `
})

export class ContactListComponent {

    contacts: Contact[] = [];

    constructor(private authService: AuthService, private contactService: ContactService, private http: Http ) {

    }

    get authenticated() {
        return this.authService.isAuthenticated();
    }

    loadContacts() {
        // Get all comments
         this.contactService.getContacts()
                .subscribe(
                    data => this.contacts = data['feed']['entry'].map(item => new Contact(item)), //Bind to view
                    err => console.log(err));
        console.log(this.contacts);
    }

    getAvatarItem(contact: Contact) {
        let photoLink: string = '/images/no_avatar.png';
        
        if (contact.photoLink !== undefined)
            return this.contactService.getAvatarUrl(contact.photoLink);
        else
            return photoLink;
    }

    

}