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
            .catch(this.handleError);

    }

    getContact(id): Observable<Contact> {
        let params: URLSearchParams = new URLSearchParams();

        params.set('v', '3.0');
        params.set('alt', 'json');
        params.set('access_token', this.authService.getToken());

        return this.http.get('https://www.google.com/m8/feeds/contacts/default/full/'+id, {search: params})
            .map((res:Response) => res.json())
            .catch(this.handleError);
    }

    getAvatarUrl(uri: string) {
        return this.updateQueryStringParameter(uri, 'access_token', this.authService.getToken());
    }

    private updateQueryStringParameter(uri, key, value) {
        let re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        let separator = uri.indexOf('?') !== -1 ? "&" : "?";
        
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
        /*
        let separator = uri.indexOf('?') !== -1 ? "&" : "?";
        let stringValues = '';
        for (var k in key_value){
            if (key_value.hasOwnProperty(k)) {
                stringValues += k + "=" + key_value[k]
            }
        } 
        return uri + separator + stringValues;
        */
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}