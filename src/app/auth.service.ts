// import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth/';
import { Injectable, NgZone } from '@angular/core';
import "firebase/analytics";
import * as auth from "firebase/auth"
import "firebase/firestore";
import 'firebase/auth';  
import { AngularFirestore } from '@angular/fire/compat/firestore/'; 
import { Router } from "@angular/router";


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
  

  constructor(
    private angularFireAuth: AngularFireAuth,
    public router: Router,  
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private firestore: AngularFirestore
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
}
