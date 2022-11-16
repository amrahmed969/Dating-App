import { Route, Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AccountService } from './../_services/account.service';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../_models/user';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter()
  model:any={};
  registerForm: FormGroup;
  maxDate: Date ;
  validationErrors: string[] = [];


  constructor(private accountService:AccountService, private toastr:ToastrService,
     private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.intializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -18)
  }
   
  intializeForm(){
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password:['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      comfirmPassword: ['',[Validators.required,this.matchValue('password')]]
    })
    this.registerForm.controls.password.valueChanges.subscribe(()=>{
      this.registerForm.controls.comfirmPassword.updateValueAndValidity();
    })
  }
  matchValue(matchTo: string) : ValidatorFn {
    return (control:AbstractControl) =>{
      return control?.value === control?.parent?.controls[matchTo].value ? null : {IsMatching:true}
    }
  }
  
  register(){
    this.accountService.register(this.registerForm.value).subscribe(response=>{
      this.router.navigateByUrl('/members')
    },error=>{
      this.validationErrors = error;
    })
    
  }
  cancel(){
    this.cancelRegister.emit(false);
  }

}
