import { Component, OnInit, DoCheck } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Response, URLSearchParams } from "@angular/http";

import { AuthService } from "../services/auth.service";
import { ContactService } from "../services/contact.service";
import { Contact } from "../shared/contacts";

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'contact-detail',
    template: `

        <div class="item" *ngIf="contact && authenticated">                
            <img class="ui avatar image" src="{{getAvatarItem(contact)}}">
            <div class="content">
                {{contact.title}}                  
                <div class="description">{{contact.primaryPhoneNumber}}</div>
            </div>
        </div>

    `
})

export class ContactDetailComponent implements OnInit, DoCheck {

    contact: Contact;
    contactId: number;

    constructor(private authService: AuthService, private contactService: ContactService, private http: Http, private route: ActivatedRoute, private router: Router ) {

    }

    ngDoCheck() {
        if (this.authenticated && !this.contact)
            this.loadContact(this.contactId);
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.contactId = params['id'];
            if (this.authenticated)
                this.loadContact(this.contactId);
        });        
    }


    get authenticated() {
        return this.authService.isAuthenticated();
    }

    loadContact(id) {
         this.contactService.getContact(id)
                .subscribe(data => {
			    	this.contact =  new Contact(data['entry']);
			    }, 
                err => console.error(err)
            );
    }

    getAvatarItem(contact: Contact) {
        let photoLink: string = '/images/no_avatar.png';
        
        if (contact.photoLink !== undefined)
            return this.contactService.getAvatarUrl(contact.photoLink);
        else
            return photoLink;
    }

}