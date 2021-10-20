import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgLocaleLocalization } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


  userForm: FormGroup;
  successMsg = '';
  errorMsg = '';

  // eslint-disable-next-line @typescript-eslint/naming-convention
  error_msg = {
    email: [
      {
        type: 'required',
        message: 'Provide email.'
      },
      {
        type: 'pattern',
        message: 'Email is not valid.'
      }
    ],
    password: [
      {
        type: 'required',
        message: 'Password is required.'
      },
      {
        type: 'minlength',
        message: 'Password length should be 6 characters long.'
      }
    ],
    Confirm_password: [
      {
        type: 'required',
        message: 'Confirm Password is required.'
      },
      {
        type: 'minlength',
        message: 'Password length should be 6 characters long.'
      }
    ],
    first_name: [
      {
        type: 'required',
        message: 'first name is required.'
      }
    ],
    last_name: [
      {
        type: 'required',
        message: 'last name is required.'
      }
    ],
  };

  constructor(
    private router: Router,
    private ionicAuthService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
      Confirm_password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required,
        // this.matchingPasswords('password', 'Confirm_password')
      ])),
      first_name: new FormControl('', Validators.compose([
        Validators.required
      ])),
      last_name: new FormControl('', Validators.compose([
        Validators.required
      ]))},{
      validator: this.matchingPasswords(`password`, `Confirm_password`)

      });
    
  }

  signUp(value) {
    this.ionicAuthService.createUser(value)
      .then((response) => {
        this.errorMsg = '';
        this.successMsg = 'New user created.';
      }, error => {
        this.errorMsg = error.message;
        this.successMsg = '';
      });
  }

  goToLogin() {
    this.router.navigateByUrl('login');
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
        
      }
    }
  }

}
