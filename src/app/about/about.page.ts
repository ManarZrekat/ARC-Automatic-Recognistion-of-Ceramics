import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import "./about.page.scss";

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(private router: Router, private ionicAuthService: AuthService) {
    
   }

  ngOnInit() {
  }
  signOut() {
    this.ionicAuthService
      .signoutUser()
      .then((res) => {
        this.router.navigateByUrl("login");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  home(){
    this.router.navigateByUrl("dashboard");
  }
  about(){
    this.router.navigateByUrl("about");
  }

}
