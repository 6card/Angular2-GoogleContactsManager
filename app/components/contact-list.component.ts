import { Component, OnChanges, OnInit } from "@angular/core";
import { Http, Response, URLSearchParams } from "@angular/http";
import { ActivatedRoute } from '@angular/router';

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
        <div *ngIf="!authenticated" class="ui error huge message">
            <div class="header">
                Please authenticate first!
            </div>
        </div>

        <contact-form (formResults)="formUpdated($event)" [totalContacts]="totalContacts" [startIndex]="startIndex" [currentPage]="currentPage" [itemsPerPage]="itemsPerPage"></contact-form>  

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

export class ContactListComponent implements OnChanges {

    contacts: Contact[] = [];

    totalContacts: number;
    itemsPerPage: number;
    startIndex: number;

    currentPage: number;

     ngOnInit() {
        
        this.activatedRoute.params
        .map(params => params)
        .subscribe((params) => {
            //console.log('URL UPDATED');
            if (params['maxResults']) {
                this.itemsPerPage = +params['maxResults'];
            }
            if (params['page']) {
                this.currentPage = +params['page'];
            }
            //console.log(this.currentPage);
        });
        
    }


    formUpdated(params: any) {
        
        if (this.authenticated) this.loadContacts(params);
        else console.log('NOT AUTORIZED!');
    }

    constructor(private authService: AuthService, private contactService: ContactService, private http: Http, private activatedRoute: ActivatedRoute ) {

    }

    get authenticated() {
        return this.authService.isAuthenticated();
    }

    ngOnChanges(changes) {
        console.log('UPDATED LIST');
	}

    loadContacts(params?: any) {
        // Get all comments
         this.contactService.getContacts(params)
                .subscribe(
                    data => {
                            this.contacts = data['feed']['entry'].map(item => new Contact(item));
                            //this.itemsPerPage = data['feed']['openSearch$itemsPerPage']['$t'];
                            this.startIndex = data['feed']['openSearch$startIndex']['$t'];
                            this.totalContacts = data['feed']['openSearch$totalResults']['$t'];                            
                    }, //Bind to view
                    err => console.log(err));
    }

    getAvatarItem(contact: Contact) {
        let photoLink: string = '/images/no_avatar.png';
        
        if (contact.photoLink !== undefined)
            return this.contactService.getAvatarUrl(contact.photoLink);
        else
            return photoLink;
    }

    

}