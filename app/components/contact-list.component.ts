import {Component} from "@angular/core";
import { Http, Response } from "@angular/http";

import {AuthService} from "../services/auth.service";

const RELS = {
    "photo": "http://schemas.google.com/contacts/2008/rel#photo",
}

class PhoneNumber {
    title: string; //"84956054561"
    primary: boolean; //"true"
    rel: string; //"http://schemas.google.com/g/2005#mobile"
    uri: string; //"tel:+7-495-605-45-61"

    

    constructor(obj: Object) {
        this.title = obj['$t'];
        this.rel = obj['rel'];
        this.uri = obj['uri'];
    }

    static fromJSONArray(array: Array<Object>): PhoneNumber[] {
        if(typeof array !== 'undefined') 
            return array.map(obj => new PhoneNumber(obj));
        else
            return [];
    }

    
}

class Contact {
    title: string;
    phoneNumbers: PhoneNumber[];

    links: any[]; 

    constructor(obj: Object) {
        this.title = obj['title']['$t'];
        this.phoneNumbers = PhoneNumber.fromJSONArray(obj['gd$phoneNumber']);
        
        this.links = obj['link'];
    }

    get avatar() {
        let photoArray;
        this.links.forEach(function(item, i) {
            if (item['rel'] == RELS['photo'] )
            photoArray = item;
        });
        console.log()
        return photoArray;
    }

    getPrimaryPhoneNumber() {
        if (this.phoneNumbers.length > 0)
            return this.phoneNumbers[0].title;
    }

    static fromJSONArray(array: Array<Object>): Contact[] {
        return array.map(obj => new Contact(obj));
    }
}

@Component({
    selector: 'contact-list',
    template: `
        <button *ngIf="authenticated" (click)="getContacts()" class="nav-link btn btn-danger-outline" href="#">Get Contacts</button>                 
        
        <div class="ui list" *ngIf="contacts.length > 0">
            <div class="item" *ngFor="let contact of contacts">
                {{contact.avatar}}
                <img class="ui avatar image" src="/images/no_avatar.png">
                <div class="content">
                    <a class="header">{{contact.title}}</a>                     
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
        this.http.get('https://www.google.com/m8/feeds/contacts/default/full?v=3.0&max-results=1000&alt=json&access_token='+this.authService.getToken())
            .map((res:Response) => res.json())
			.subscribe(data => {
			    	this.contacts = Contact.fromJSONArray(data.feed.entry);
			    }, 
                err => {console.error(err);}
            );
        console.log(this.contacts);
    }

    

}