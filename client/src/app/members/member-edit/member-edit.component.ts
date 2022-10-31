import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { MembersService } from 'src/app/_services/members.service';
import { AccountService } from './../../_services/account.service';
import { User } from './../../_models/user';
import { Member } from 'src/app/_models/member';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForOf } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  member: Member;
  user: User;
  @HostListener('window:beforeunload',['$event'])  unloadNotification($event: any){
    if (this.editForm.dirty){
      $event.returnValue = true;
    }
  }
  constructor(private accountService: AccountService , private memberService:MembersService, 
    private toastr: ToastrService) {
      this.accountService.currentuser$.pipe(take(1)).subscribe(user=>this.user = user)
   }

  ngOnInit(): void {
    this.loadMember()
  }
  loadMember(){
    this.memberService.getMember(this.user.username).subscribe(member=>{
      this.member=member
    })
  }

  updateMember(){
    this.memberService.updateMember(this.member).subscribe(()=>{
      this.toastr.success("profile updated successfuly")
      this.editForm.reset(this.member)
    })
    console.log(this.member);  
  }

}
