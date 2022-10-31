import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  busyReuestCount = 0;
  constructor(private spinnerService: NgxSpinnerService) { }

  busy(){
    this.busyReuestCount++;
    this.spinnerService.show(undefined,{
      type: 'line-scale-party',
      bdColor : 'rgba(255,255,255,0)',
      color: '#333333',
    });
  }
    idel(){
      this.busyReuestCount--;
      if(this.busyReuestCount <= 0){
        this.busyReuestCount = 0 ;
        this.spinnerService.hide();
      }
    }
  
}
