import { Component, Output, EventEmitter, } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
//import { Contact } from "../shared/contacts";

@Component({
    moduleId: module.id,
    selector: 'contact-form',
    template: `
        <form class="ui form" (ngSubmit)="onSubmit(myForm.value)" [formGroup]="myForm">
            <h4 class="ui dividing header">Contact Manager filer</h4>
                
            <div class="two fields">
                <div class="field" [ngClass]="{'error' : !myForm.controls['maxResults'].valid}">
                    <label>Name</label>
                    <input name="maxResults" placeholder="Max results" type="text" [formControl]="myForm.controls['maxResults']">
                    <div *ngIf="!myForm.controls['maxResults'].valid" class="ui error message">maxResults is invalid</div>
                </div>
                <div class="field">
                    <label>Page</label>
                    <input name="page" placeholder="Page" type="text">
                </div>
            </div>
            <button type="submit" class="ui submit button" [disabled]="submitted">Submit</button>
            
        </form> 
        <div *ngIf="!myForm.valid" class="ui ignored warning message">
            <p>If you are looking for validation you should check out.</p>
        </div>
    `
})

export class ContactFormComponent {
    @Output() formResults: EventEmitter<any> = new EventEmitter();
    myForm: FormGroup;
    submitted = false;

    maxResults: AbstractControl;

    constructor(fb: FormBuilder) {  
        this.myForm = fb.group({  
            'maxResults': ['10', Validators.required]  
        });  
        this.maxResults = this.myForm.controls['maxResults'];
    }

    onSubmit(value: string): void {  
        this.formResults.emit(value['maxResults']);
        //console.log('you submitted value: ', value['maxResults']); 

           
    }
}