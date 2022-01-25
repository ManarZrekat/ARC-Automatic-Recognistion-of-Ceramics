import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-testpage',
  templateUrl: './testpage.page.html',
  styleUrls: ['./testpage.page.scss'],
})
export class TestpagePage implements OnInit {

  constructor(private router: Router) { }
  timeInSeconds = 0;
  ngOnInit() {
    this.startCountdown(3);
   // this.startTimer(10000);
  
     
  }
  counter: { min: number, sec: number }



  delay(delay: number) {
    return new Promise(r => {
        setTimeout(r, delay);
    })
}
startCountdown(seconds) {  
  let counter = seconds; 
  const interval = setInterval(() => { 
    counter--; 
    if (counter ==0 ) { 
      this.router.navigateByUrl('login');
    return;
    } 
  }, 1000);
 }


}
