import {Component} from "@angular/core";
import { Http, Response, URLSearchParams } from "@angular/http";

import {AuthService} from "../services/auth.service";
import { Contact } from "../shared/contacts";

@Component({
    selector: 'contact-detail',
    template: `
        123123
    `
})

export class ContactDetail {

    constructor(private authService: AuthService, private http: Http ) {

    }

}