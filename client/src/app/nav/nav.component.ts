import { ToastrModule, ToastrService } from 'ngx-toastr';
import { User } from './../_models/user';
import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Route, Router } from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public accountService:AccountService, private router:Router, private toastr:ToastrService) { }
  model:any= {};
   
  ngOnInit(): void {
  }
  login(){
    console.log('model',this.model)
    this.accountService.login(this.model).subscribe(response=>{
      this.router.navigateByUrl('/members')
  },error=>{
    // console.log(error);
    // this.toastr.error(error.error)
  })   
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/')
  }

}
