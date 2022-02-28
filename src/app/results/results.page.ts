import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import {  CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { CameraPage } from "../camera/camera.page";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/compat/firestore";
// import {  CameraResultType, CameraSource, Photo } from '@capacitor/camera';

import { ToastController } from "@ionic/angular";
import { FormControl } from "@angular/forms";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { ActionSheetController } from '@ionic/angular';
import { HttpClient} from '@angular/common/http';
import { DashboardPage } from '../dashboard/dashboard.page';
import { UserPhoto,PhotoService } from '../services/photo.service';


import { ActivatedRoute } from '@angular/router';
import { CompileShallowModuleMetadata } from '@angular/compiler';
@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {
  img: any;
  label: string;
  dict = {
    "Jug" :"A jug is a closed vessel, often with one handle, although it can also have two. It is a larger version of the juglet, used for the consumption of liquids, e.g. wine.",
    "Juglet":"A juglet is a small, closed vessel, used for precious liquids/materials. It usually has one handle but can also have two",
    "Bowl":"A bowl is an open curved vessel with a flat or ring base.",
    "Jar":"A jar is a large, closed vessel used for the transportation of large quantities of materials, either liquids (e.g. wine or oil) or solids (e.g. wheat or grains). It can have two or more handles, or none at all. If the base is cone shaped or otherwise not flat, the jar was used for maritime transportation and is often referred to as an Amphora."
  }
  disc : string;
  newdisc : string="";
 

  constructor(
    public httpClient: HttpClient,
    public toastController: ToastController,
    private camera: Camera,
    private router: Router,
    private ionicAuthService: AuthService,
    public actionSheetController: ActionSheetController,
    private route: ActivatedRoute,
    private photoService: PhotoService,
    private http: HttpClient

  ) { }

 
   
 ngOnInit() {
  this.route.queryParams.subscribe(params => {
    this.img = params["image"];
  
    
    
});

  this.sendPostRequest();

 
  console.log();
  console.log(this.disc);

  }

  // adddisc(){
  //   this.newdisc = "<ion-content>"
  // }

  async sendPostRequest() {
    let formData: FormData = new FormData();
  formData.append('file', this.photoService.imgfile);
  
  this.http.post("http://b901-2001-4df7-3-8d4b-c864-d05c-4f3b-3a1a.ngrok.io/predict", formData, {responseType: 'text'}).subscribe(
      data => {
        this.label = data;
        this.disc = this.dict[data];
        console.log("dddd")
          console.log(data); 
      },
      error => {
          console.log(error);
      }
  );
  return this.label
    }


   //bottom tab bar functions
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
