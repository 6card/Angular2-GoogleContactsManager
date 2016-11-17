import { Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Pagination } from "./pagination.component"

//import { Contact } from "../shared/contacts";

function maxValueValidator(maxValue: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const value = control.value;

    if (value > maxValue)
        return null;
    else
        return {'maxValue': {maxValue}} 
        
        
  };
}

@Component({
    moduleId: module.id,
    selector: 'contact-form',
    template: `
        <form class="ui form segment" [ngClass]="{'error' : !myForm.valid}" (ngSubmit)="onSubmit()" [formGroup]="myForm">
            <h4 class="ui dividing header">Contact Manager filer</h4>
                
            <div class="two fields">
                <div class="field" [ngClass]="{'error' : !myForm.controls['maxResults'].valid}">
                    <label>Name</label>
                    <input name="maxResults" placeholder="Max results" type="text" [formControl]="myForm.controls['maxResults']">
                </div>
                <div class="field">
                    <label>Page</label>
                    <input name="page" placeholder="Page" type="text" [formControl]="myForm.controls['page']">
                </div>
            </div>
            <button type="submit" class="ui primary submit button" [disabled]="submitted">Submit</button>

            <div *ngIf="!myForm.valid" class="ui error message">
                <ul>If you are looking for validation you should check out.</ul>
            </div>

        </form>
        <pagination (goToPage)="pageUpdated($event)" [page]="2" [totalItems]="totalContacts" [itemsPerPage]="itemsPerPage"></pagination>
        `
})

export class ContactFormComponent implements OnInit {
    @Output() formResults: EventEmitter<any> = new EventEmitter();

    @Input() totalContacts: number;
    page: number;
    itemsPerPage: number;

    myForm: FormGroup;
    submitted = false;

    //maxResults: AbstractControl;

    constructor(
        private fb: FormBuilder,
        private router: Router,
		private activatedRoute: ActivatedRoute
    ) {  
        this.myForm = fb.group({  
            'maxResults': ['10', Validators.required],
            'page': ['1', Validators.required]
        });  
        //this.maxResults = this.myForm.controls['maxResults'];
    }

    pageUpdated(page: number) {
        this.page = page;
        this.myForm.controls['page'].setValue(page);

        let values = <any[]>this.myForm.value;
        this.formResults.emit(values);
        
        let link = ['/contacts', values];
        this.router.navigate(link); 
    }

    
    ngOnInit() {
        this.activatedRoute.params
        .map(params => params)
        .subscribe((params) => {
            this.itemsPerPage = params['maxResults'];
            this.myForm.controls['maxResults'].setValue(params['maxResults']);
            this.page = params['page'];
            this.myForm.controls['page'].setValue(params['page']);
        });
        //this.formResults.emit(this.myForm.value);
    }
    

    onSubmit(): void {  
        //console.log(this.myForm);
        let values = <any[]>this.myForm.value;
        this.formResults.emit(values);
        
        let link = ['/contacts', values];
        this.router.navigate(link);        

        
        console.log('This page: ' + this.page); 

        //http://localhost:3000/dashboard;typeObject=1;urlParent=parent1;power=Super%20Flexible   
    }
}