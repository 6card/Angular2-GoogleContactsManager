import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Response, URLSearchParams } from "@angular/http";

import { AuthService } from "../services/auth.service";
import { ContactService } from "../services/contact.service";
import { Contact } from "../shared/contacts";

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'contact-detail',
    template: `
        <div class="ui list" *ngIf="contact">
            <div class="item">                

                <div class="content">
                    {{contact.title}}                  
                     <div class="description">phone</div>
                </div>
            </div>
        </div>
        <button (click)="consoleShow()" class="nav-link btn btn-danger-outline" href="#">CONSOLE!!!</button>                 
        
    `
})

export class ContactDetail implements OnInit  {

    contact: Contact;
    contactId: string;
    constructor(private authService: AuthService, private contactService: ContactService, private http: Http, private route: ActivatedRoute ) {

    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.contactId = params['id']; // (+) converts string 'id' to a number
            this.loadContact(this.contactId);
        });
    }

    loadContact(id) {
        // Get all comments
         this.contactService.getContact(id)
                .subscribe(data => {
			    	this.contact =  new Contact(data['entry'], this.authService.getToken());
			    }, 
                err => {console.error(err);}
            );
    }

    consoleShow() {
        console.log(this.contact);
    }

    

}