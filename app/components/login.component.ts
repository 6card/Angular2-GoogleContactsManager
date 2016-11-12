//These first 3 lines will be deprecated by the final release
import {Component} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {Http} from "@angular/http";

@Component({
    selector: 'login',
    template: `
        
            <a *ngIf="!authenticated" (click)="doLogin()" class="item">Login</a>
            <a *ngIf="authenticated" (click)="doLogout()" class="item">Logout {{userName}}</a>
        
    `
})
export class Login {
	

	
    constructor(private authService: AuthService, private http: Http) {
    }

    get authenticated() {
        return this.authService.isAuthenticated();
    }

    doLogin() {
        this.authService.doLogin();
    }

    doLogout() {
        this.authService.doLogout();
    }

    get userName() {
        return this.authService.getUserName();
    }
	
}

