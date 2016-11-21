import { Injectable } from "@angular/core";
import {Http, Headers, RequestOptions, Response, URLSearchParams} from "@angular/http";

import {Observable} from 'rxjs/Rx';

import { AuthService } from "./auth.service";
import { Contact } from "../shared/contacts";

@Injectable()
export class ContactService {

    constructor(private authService: AuthService, private http: Http) {

    }

    getContacts(p?: any) : Observable<Contact[]> {
        let params: URLSearchParams = new URLSearchParams();

        params.set('v', '3.0');
        params.set('alt', 'json');
        params.set('access_token', this.authService.getToken());

  
        if(p.maxResults)
            params.set('max-results', p.maxResults);
        
        if (p.page) {
            let startIndex: string = ((p.maxResults * (p.page - 1)) + 1).toString();
            params.set('start-index', startIndex);
        }
        
        //console.log(p);

        //

        return this.http.get('https://www.google.com/m8/feeds/contacts/default/full', {search: params})
            .map((res:Response) => res.json())
            .catch(this.handleError);

    }

    updateContact(id, eTag): Observable<Contact> {
        let params: URLSearchParams = new URLSearchParams();
        let bodyString = JSON.stringify(body); // Stringify payload

        let headers = new Headers(); // ... Set content type to JSON
        headers.append('If-Match', eTag);
        headers.append('GData-Version', '3.0');
        headers.append('Content-Type', 'application/atom+xml');

        params.set('v', '3.0');
        params.set('alt', 'json');
        params.set('access_token', this.authService.getToken());

        let options = new RequestOptions({ search: params, headers: headers }); // Create a request option

        return this.http.put('https://www.google.com/m8/feeds/contacts/default/full/'+id, body, options)
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