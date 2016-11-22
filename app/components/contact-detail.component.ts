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

        <div *ngIf="!authenticated" class="ui error huge message">
            <div class="header">
                Please authenticate first!
            </div>
        </div>

        <div class="item" *ngIf="contact && authenticated">                
            <img class="ui avatar image" src="{{getAvatarItem(contact)}}">
            <div class="content">
                {{contact.title}}                  
                <div class="description">{{contact.primaryPhoneNumber}}</div>
            </div>
        </div>

        <button class="ui primary button" (click)="update()">Update contact</button>

    `
})

export class ContactDetailComponent implements OnInit {

    contact: Contact;
    contactId: number;

    constructor(private authService: AuthService, private contactService: ContactService, private http: Http, private route: ActivatedRoute, private router: Router ) {

    }
    /*
    ngDoCheck() {
        if (this.authenticated && !this.contact)
            this.loadContact(this.contactId);
    }
    */

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

    update() {
        console.log('update start');
        let body = `{"version":"1.0","encoding":"UTF-8","entry":{"xmlns":"http://www.w3.org/2005/Atom","xmlns$batch":"http://schemas.google.com/gdata/batch","xmlns$gd":"http://schemas.google.com/g/2005","xmlns$gContact":"http://schemas.google.com/contact/2008","gd$etag":"\"Rn8-ezVSLyt7I2A9XRdUEEULQg0.\"","id":{"$t":"http://www.google.com/m8/feeds/contacts/1986vk%40gmail.com/base/f77298d479d0b"},"updated":{"$t":"2014-11-27T09:46:37.153Z"},"app$edited":{"xmlns$app":"http://www.w3.org/2007/app","$t":"2014-11-27T09:46:37.153Z"},"category":[{"scheme":"http://schemas.google.com/g/2005#kind","term":"http://schemas.google.com/contact/2008#contact"}],"title":{"$t":"Димон Оскол"},"link":[{"rel":"http://schemas.google.com/contacts/2008/rel#photo","type":"image/*","href":"https://www.google.com/m8/feeds/photos/media/1986vk%40gmail.com/f77298d479d0b?v\u003d3.0"},{"rel":"self","type":"application/atom+xml","href":"https://www.google.com/m8/feeds/contacts/1986vk%40gmail.com/full/f77298d479d0b?v\u003d3.0"},{"rel":"edit","type":"application/atom+xml","href":"https://www.google.com/m8/feeds/contacts/1986vk%40gmail.com/full/f77298d479d0b?v\u003d3.0"}],"gd$name":{"gd$fullName":{"$t":"Димон Оскол"},"gd$familyName":{"$t":"Димон Оскол"}},"gContact$birthday":{"when":"1985-12-04"},"gd$phoneNumber":[{"rel":"http://schemas.google.com/g/2005#mobile","uri":"tel:+7-904-095-24-43","primary":"true","$t":"+79040952443"}],"gContact$groupMembershipInfo":[{"deleted":"false","href":"http://www.google.com/m8/feeds/groups/1986vk%40gmail.com/base/6"}]}}`

        this.contactService.updateContact(this.contactId, body, this.contact.eTag)
                .subscribe(data => {
			    	this.contact =  new Contact(data['entry']);
			    }, 
                err => console.error(err)
            );
    }

}