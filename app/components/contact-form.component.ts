import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
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
                    <label>Items per page:</label>
                    <select  name="maxResults" placeholder="Max results" type="text" [formControl]="myForm.controls['maxResults']">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
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
        <pagination *ngIf="currentPage" (goToPage)="pageUpdated($event)" [page]="currentPage" [totalItems]="totalContacts" [itemsPerPage]="itemsPerPage"></pagination>
        `
})

export class ContactFormComponent {
    @Output() formResults: EventEmitter<any> = new EventEmitter();

    @Input() totalContacts: number;
    @Input() startIndex: number;
    @Input() currentPage: number;
    @Input() itemsPerPage: number;

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
            'page': ['', Validators.required]
        });  
        //this.maxResults = this.myForm.controls['maxResults'];
    }

    //Hook for URL changes
    ngOnChanges(changes): void {
        //console.log(changes);
        if (this.itemsPerPage)
            this.myForm.controls['maxResults'].setValue(this.itemsPerPage);
        if (this.currentPage)
            this.myForm.controls['page'].setValue(this.currentPage);
        if (this.itemsPerPage && this.currentPage)
            this.pushValues();
    }
    
    /*
    ngOnInit() {
        
        this.activatedRoute.params
        .map(params => params)
        .subscribe((params) => {
            console.log('URL UPDATED');
            if (params['maxResults']) {
                this.itemsPerPage = +params['maxResults'];
                this.myForm.controls['maxResults'].setValue(params['maxResults']);
            }
            if (params['page']) {
                this.currentPage = +params['page'];
                this.myForm.controls['page'].setValue(params['page']);
            }
            console.log(this.currentPage);
        });
        
    }
    */
    
    pushValues(): void {
        let values = this.myForm.value;
        this.formResults.emit(values);
        
        let link = ['/contacts', values];
        this.router.navigate(link);  
    }

    pageUpdated(page: number) {
        //console.log('PAGE UPDATED 2');
        this.currentPage = page;
        this.myForm.controls['page'].setValue(page);

        this.pushValues();
    }
    

    onSubmit(): void {  
        this.pushValues();  
    }
}