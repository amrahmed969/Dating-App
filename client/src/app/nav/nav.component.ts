import { User } from './../_models/user';
import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public accountService:AccountService) { }
  model:any= {};
   
  ngOnInit(): void {
  }
  login(){
    //console.log('model',this.model)
    this.accountService.login(this.model).subscribe(response=>{
      console.log(response);
  },error=>{
    console.log(error);
  })   
  }

  logout(){
    this.accountService.logout();
  }

}
