import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgLocaleLocalization } from '@angular/common';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';



export interface User {
  firstName: string;
  secondName: string;
  firstSurname: string;
  secondSurname: string;
  emailAddress: string;

}



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
    private fb: FormBuilder,
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    // public flashMensaje FlashMessagesService,
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
        this.router.navigate(['dashboard']);
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
  // register(user: User, password: string) {

  //   return new Promise<any>((resolve, reject) => {
  //     this.afAuth.createUserWithEmailAndPassword(user.emailAddress, password)
  //       .then(async res => {

  //         Object.assign(user, {
  //           'dateOfCreationAccount': new Date(res.user.metadata.creationTime),
  //           'lastSignInTime': new Date(res.user.metadata.lastSignInTime)
  //         });

  //         // Add user to firestore
  //         await this.addUser(res.user.uid, user);

  //         // // Send verification email
  //         // this.sendVerificationEmail();

  //         // // Logout user
  //         // this.logout();

  //         resolve(res);

  //       }, err => reject(err));
  //   });
  // }
  // onFormSubmit() {
  //   const password = this.userForm.get('password').value;

  //   const user: User = {
  //     firstName: this.userForm.get('firstName').value,
  //     secondName: this.userForm.get('secondName').value,
  //     firstSurname: this.userForm.get('firstSurname').value,
  //     secondSurname: this.userForm.get('secondSurname').value,
  //     emailAddress: this.userForm.get('emailAddress').value
  //   };
  //   this.register(user, password)
  //   .then(res => {
  //   }, err => {
  //     console.log(err);
  //   });
  // }
  // async addUser(uid: string, data: User) {
  //   await this.usersCollection.doc(uid).set(data);
  // }
  
}

