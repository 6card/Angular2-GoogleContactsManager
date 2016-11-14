import { Injectable } from "@angular/core";
import {Http, Response, URLSearchParams} from "@angular/http";

import {Observable} from 'rxjs/Rx';

import { AuthService } from "./auth.service";
import { Contact } from "../shared/contacts";

@Injectable()
export class ContactService {

    constructor(private authService: AuthService, private http: Http) {

    }

    getContacts() : Observable<Contact[]> {
        let params: URLSearchParams = new URLSearchParams();

        params.set('v', '3.0');
        params.set('alt', 'json');
        params.set('access_token', this.authService.getToken());

        //params.set('max-results', '1000');

        return this.http.get('https://www.google.com/m8/feeds/contacts/default/full', {search: params})
            .map((res:Response) => res.json())
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

    }

    getContact(id): Observable<Contact> {
        //&max-results=1000
        let params: URLSearchParams = new URLSearchParams();

        params.set('v', '3.0');
        params.set('alt', 'json');
        params.set('access_token', this.authService.getToken());

        return this.http.get('https://www.google.com/m8/feeds/contacts/default/full/'+id, {search: params})
            .map((res:Response) => res.json())
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
			

    }
}