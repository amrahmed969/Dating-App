import { Member } from './../_models/member';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl+'users')
  }
  getMember(username:string){
    return this.http.get<Member>(this.baseUrl+'users/'+ username)
  }
}
