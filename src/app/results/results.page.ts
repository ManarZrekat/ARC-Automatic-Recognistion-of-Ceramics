import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { ToastController } from "@ionic/angular";
import { ActionSheetController } from '@ionic/angular';
import { HttpClient} from '@angular/common/http';
import { UserPhoto,PhotoService } from '../services/photo.service';
import { ActivatedRoute } from '@angular/router';

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
  hide:Boolean;
 

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
   this.hide = false;
  this.route.queryParams.subscribe(params => {
    this.img = params["image"];
  
    
    
});

  this.sendPostRequest();

  }

 //Post request sent to the heroku server
  async sendPostRequest() {
    let formData: FormData = new FormData();
  formData.append('file', this.photoService.imgfile);
  
  this.http.post("https://arc-server1.herokuapp.com/predict", formData, {responseType: 'text'}).subscribe(
      data => {
        this.label = data;
        this.disc = this.dict[data];
          this.hide = true;
          
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
