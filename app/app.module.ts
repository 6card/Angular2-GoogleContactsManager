import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RouterModule }   from '@angular/router';


import { AppComponent }   from './app.component';
import { Login } from "./components/login.component";
import { ContactList } from "./components/contact-list.component"
import { ContactDetail } from "./components/contact-detail.component"

import {AuthService} from "./services/auth.service";
import {WindowService} from "./services/window.service";
import {ContactService} from "./services/contact.service";



@NgModule({
  imports:      [ 
    BrowserModule, 
    FormsModule, 
    HttpModule,
    RouterModule.forRoot([      
      {
        path: '',
        redirectTo: '/contacts',
        pathMatch: 'full'
      },
      {
        path: 'contacts',
        component: ContactList
      },
      {
        path: 'contact/:id',
        component: ContactDetail
      }
    ])
  ],
  declarations: [ AppComponent, Login, ContactList, ContactDetail ],
  bootstrap:    [ AppComponent ],
  providers: [ AuthService, WindowService, ContactService ],
})
export class AppModule { }