// import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth/';
import { Injectable, NgZone } from '@angular/core';
import "firebase/analytics";
import * as auth from "firebase/auth"
import "firebase/firestore";
import 'firebase/auth';  
import { AngularFirestore } from '@angular/fire/compat/firestore/'; 
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { FormGroup} from '@angular/forms';



export interface User {
  firstName: string;
  lastName: string;
  emailAddress: string;
}

@Injectable({
  providedIn: 'root',
})



export class AuthService {
  userData: any;
  currentUser: any;
  userForm: FormGroup;
  public userdetails=[];

  

  constructor(
    private angularFireAuth: AngularFireAuth,
    public router: Router,  
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private firestore: AngularFirestore,
    private _cookieService: CookieService,
    ) {
      this.angularFireAuth.authState.subscribe(user => {
        if (user) {
          this.userData = user; // Setting up user data in userData var
          localStorage.setItem('user', JSON.stringify(this.userData));
          JSON.parse(localStorage.getItem('user'));
        } else {
          localStorage.setItem('user', null);
          JSON.parse(localStorage.getItem('user'));
        }
      })
    }

    // getAuth()
    // .createUser({
    //   email: 'user@example.com',
    //   emailVerified: false,
    //   phoneNumber: '+11234567890',
    //   password: 'secretPassword',
    //   displayName: 'John Doe',
    //   photoURL: 'http://www.example.com/12345678/photo.png',
    //   disabled: false,
    // })
    // .then((userRecord) => {
    //   // See the UserRecord reference doc for the contents of userRecord.
    //   console.log('Successfully created new user:', userRecord.uid);
    // })
    // .catch((error) => {
    //   console.log('Error creating new user:', error);
    // });
  createUser(value) {
    const password = value.password;
    const user: User = {
      firstName: value.first_name,
      lastName: value.last_name,
      emailAddress: value.email
    };
    return new Promise<any>((resolve, reject) => {
      this.angularFireAuth
        .createUserWithEmailAndPassword(value.email, value.password)
        .then(
          async res => {

            Object.assign(user, {
              'dateOfCreationAccount': new Date(res.user.metadata.creationTime),
              'lastSignInTime': new Date(res.user.metadata.lastSignInTime)
            });
  
            // Add user to firestore
            await this.addUser(res.user.uid, user);
  
            resolve(res);
  
          }, err => reject(err));
      });
          
    }
  

  async addUser(uid: string, data: User) {
    // await this.users.doc(uid).set(data);
 
    this.firestore.collection('users').doc(uid).set(data);
  
    
  }

  signinUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.firestore.collection(`users`).snapshotChanges().subscribe((data) => {
        this.userdetails =  data.map(async e => {
         if ( e.payload.doc.data()["emailAddress"]== value.email){
           console.log("AAA", e.payload.doc.data()["firstName"]);
           this._cookieService.set("user_email", e.payload.doc.data()['emailAddress']);
           this._cookieService.set("user_name", e.payload.doc.data()['firstName']);
           return {id: e.payload.doc.id, firstName: e.payload.doc.data()["firstName"], lastName: e.payload.doc.data()["lastName"], emailAddress: e.payload.doc.data()["emailAddress"]};
         }
        })
     })
      this.angularFireAuth
        .signInWithEmailAndPassword(value.email, value.password)
        .then(
          (res) => resolve(res),
          (err) => reject(err)
        );
      
    });
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.angularFireAuth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
    }).catch((error) => {
      window.alert(error)
    })
  }

  signoutUser() {
    return new Promise<void>((resolve, reject) => {
      if (this.angularFireAuth.currentUser) {
        this._cookieService.delete('user_email','/');
        this._cookieService.delete('user_name','/');
        this._cookieService.deleteAll('/','xyz.net');
        console.log("KKKKKKKKKK");
        
        this.angularFireAuth
          .signOut()
          .then(() => {
            console.log('Sign out');
            resolve();
          })
          .catch(() => {
            reject();
          });
      }
    });
  }

  userDetails() {
    return this.angularFireAuth.user;
  }

  // async userinit(email) {
  //   this.firestore.collection(`users`).snapshotChanges().subscribe((data) => {
  //      this.userdetails =  data.map(async e => {
  //       if ( e.payload.doc.data()["emailAddress"]== email){
  //         console.log("AAA", e.payload.doc.data()["firstName"]);
  //         this._cookieService.set("user_email", e.payload.doc.data()['emailAddress']);
  //         this._cookieService.set("user_name", e.payload.doc.data()['firstName']);
  //         return {id: e.payload.doc.id, firstName: e.payload.doc.data()["firstName"], lastName: e.payload.doc.data()["lastName"], emailAddress: e.payload.doc.data()["emailAddress"]};
  //       }
  //      })
  //   })
  //   const data= await this.userdetails;    
  //     return data;
  // };
}

