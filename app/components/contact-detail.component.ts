import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Response, URLSearchParams } from "@angular/http";

import { AuthService } from "../services/auth.service";
import { Contact } from "../shared/contacts";

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'contact-detail',
    template: `
        <div class="ui list" *ngIf="contact !== undefined ">
            <div class="item">                

                <div class="content">
                    {{contact.title}}                  
                     <div class="description">{{contact.getPrimaryPhoneNumber()}}</div>
                </div>
            </div>
        </div>
    `
})

export class ContactDetail implements OnInit  {

    contact: Contact;
    contactId: string;
    constructor(private authService: AuthService, private http: Http, private route: ActivatedRoute ) {

    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.contactId = params['id']; // (+) converts string 'id' to a number
            this.getContact(this.contactId);
        });
    }

    getContact(id) {
        //&max-results=1000
        let params: URLSearchParams = new URLSearchParams();

        params.set('v', '3.0');
        params.set('alt', 'json');
        params.set('access_token', this.authService.getToken());

        this.http.get('https://www.google.com/m8/feeds/contacts/default/full/'+id, {search: params})
            .map((res:Response) => res.json())
			.subscribe(data => {
			    	//this.contact =  new Contact(data.entry, this.authService.getToken());
			    }, 
                err => {console.error(err);}
            );
        console.log(this.contact);
    }

}