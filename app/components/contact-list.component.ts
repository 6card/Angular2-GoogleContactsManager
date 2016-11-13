import {Component} from "@angular/core";
import { Http, Response, URLSearchParams } from "@angular/http";

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
    token: string;
    constructor(obj: Object, token: string) {
        this.title = obj['title']['$t'];
        this.phoneNumbers = PhoneNumber.fromJSONArray(obj['gd$phoneNumber']);
        
        this.links = obj['link'];

        this.token = token;
    }

    get avatar() {
        let photoLink: string = '/images/no_avatar.png';
        let token = this.token; 
        this.links.forEach(function(item, i) {
            if (item['rel'] == RELS['photo'] && item['gd$etag'] !== undefined) {
                photoLink =  Contact.updateQueryStringParameter(item['href'], 'access_token', token); 
            }                
                //              
        });

        //console.log()
        return photoLink;
    }

    static updateQueryStringParameter(uri, key, value) {
        let re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        let separator = uri.indexOf('?') !== -1 ? "&" : "?";
        
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
        
    }

    getPrimaryPhoneNumber() {
        if (this.phoneNumbers.length > 0)
            return this.phoneNumbers[0].title;
    }

    static fromJSONArray(array: Array<Object>, token: string): Contact[] {
        return array.map(obj => new Contact(obj, token));
    }
}

@Component({
    selector: 'contact-list',
    template: `
        <button *ngIf="authenticated" (click)="getContacts()" class="nav-link btn btn-danger-outline" href="#">Get Contacts</button>                 
        
        <div class="ui list" *ngIf="contacts.length > 0">
            <div class="item" *ngFor="let contact of contacts">                
                <img class="ui avatar image" src="{{contact.avatar}}">
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