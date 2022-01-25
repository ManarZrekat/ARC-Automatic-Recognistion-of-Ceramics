import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  emailInput: string;

  constructor(private authSvc: AuthService, private router: Router) {}
  ngOnInit() {
  }
  async onResetPassword() {
    try {
      await this.authSvc.resetPassword(this.emailInput);
      this.router.navigate(['/login']);
    } catch (error) {
      console.log('Error->', error);
    }
  }
}