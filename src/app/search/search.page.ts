import { Component, OnDestroy, OnInit } from "@angular/core";
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
import { first, startWith } from "rxjs/operators";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { AlertController, Platform } from "@ionic/angular";
import { Filesystem, Directory } from '@capacitor/filesystem';
import { map, finalize } from "rxjs/operators";
import { Observable, Subscription } from "rxjs";
import { UserPhoto,PhotoService } from '../services/photo.service';
import { ToastController } from "@ionic/angular";
import { FormControl } from "@angular/forms";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { ActionSheetController } from '@ionic/angular';




import { HttpClient} from '@angular/common/http';
import { readFileSync } from "fs";

interface pottery {
  name?: string;
}
@Component({
  
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"],
})
export class SearchPage implements OnInit, OnDestroy {
  public potteryList:  Array<any>;;
  public potteryListBackup:  Array<any>;;
  public  imagephoto:Photo;
  public imageFile:File;
  userDetail: string;
  base64Image: string;
  selectedFile: File = null;
  downloadURL: Observable<string>;

  imageTaken: string;
  searchList: pottery[];
  searchField: FormControl;
  searchSub: Subscription;
  searchKey: string;
  imgData : File;
  imgdata: Photo;

  constructor(
  
    public httpClient: HttpClient,
    public toastController: ToastController,
    private camera: Camera,
    private router: Router,
    private ionicAuthService: AuthService,
    private firestore: AngularFirestore,
    private alertCtrl: AlertController,
    private storage: AngularFireStorage,
    private platform: Platform,
    private photoService: PhotoService,
    private androidPermissions: AndroidPermissions,
    public actionSheetController: ActionSheetController
  ) {
    this.searchField = new FormControl("");
    if (this.platform.is('hybrid')) {
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
      .then(
        (result) => console.log("Has permission?", result.hasPermission),
        (err) =>
          this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.CAMERA
          )
      );
          }
          // if (this.platform.is('hybrid')) {      
    this.androidPermissions
      .requestPermissions([
        this.androidPermissions.PERMISSION.CAMERA
      ])
      .then((res) => console.log("permission res", res))
      .catch((err) =>
        console.log("error requesting permission for camera", err)
      );
    // }
  }

  searchbar(evt){
    this.router.navigateByUrl('search');
  }



  

  ngOnDestroy(): void {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }
  async ngOnInit() {
      this.ionicAuthService.userDetails().subscribe(response => {
      if (response !== null) {
        this.userDetail = response.email;
      } else {
        this.router.navigateByUrl('');
      }
    }, error => {
      console.log(error);
    });
    // search logic
    // this.searchSub = this.searchField.valueChanges
    //   .pipe(startWith(this.searchField.value))
    //   .subscribe((res) => {
    //     this.getSearchResults(res);
    //   });

    this.potteryList = await this.initializeItems();

    await this.photoService.loadSaved();
  }
  async sendPostRequest() {
    let  url = 'http://localhost:3000/api/image';
    const date = new Date().valueOf();
  
    // Replace extension according to your media type
    const imageName = date+ '.png';
    // call method that creates a blob from dataUri
    // const = photo
    const base64 = this.photoService.readAsBase64(await this.photoService.imgfile)
    console.log("a", await this.photoService.imgfile);

    console.log("b", await base64);

    const imageBlob = this.dataURItoBlob(base64);
    
    const imageFile = new File([imageBlob], imageName, { type: 'image/png' })

    let  postData = new FormData();
    postData.append('file', imageFile);
  
    let data:Observable<any> = this.httpClient.post(url,postData);
    data.subscribe((result) => {
      console.log(result);
    });

  }


  dataURItoBlob(dataURI) {
    console.log(dataURI);

    console.log("AAAAAA", JSON.stringify(dataURI).split(',')[2].replace(/=="}/, ''));

    const str= JSON.stringify(dataURI).split(',')[2].replace(/=="}/, '');
    const binary = atob(str);

    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: 'image/png'
    });
  }


  async initializeItems(): Promise<any> {
    const jugsList = await this.firestore.collection('jugs')
    .valueChanges().pipe(first()).toPromise();

    const jugletsList = await this.firestore.collection('juglets')
    .valueChanges().pipe(first()).toPromise();

    const jarsList = await this.firestore.collection('jars')
    .valueChanges().pipe(first()).toPromise();
    
    const bowlsList = await this.firestore.collection('Bowls')
    .valueChanges().pipe(first()).toPromise();

    const merge = jugsList.concat(jugletsList);
    const merge2 = jarsList.concat(bowlsList);
    const potteryList = merge.concat(merge2);


    this.potteryListBackup = potteryList;
    return potteryList;
  }
  search(event) {
    this.searchKey = event.target.value;

    if (this.searchKey === '') {
    } else if (this.searchKey.length > 2) {


      this.potteryListBackup = this.potteryList.filter((currentPottery) => {
        if (currentPottery.tags && this.searchKey) {
          return (currentPottery.tags.includes(this.searchKey) );
         // return (currentPottery.name.toLowerCase().indexOf(this.searchKey.toLowerCase()) > -1 || currentPottery.type.toLowerCase().indexOf(this.searchKey.toLowerCase()) > -1);
          
        }
        // else if (!currentPottery.tags.includes(this.searchKey)){
        //   console.log("no results were found");
        // }
      });
      if(this.potteryListBackup.length == 0){
        //const element: HTMLElement = document.getElementsById('img') as HTMLElement
        //const el = document.getElementsByClassName('img');
        //element.innerHTML += "no results were found"
        console.log("no results were found");

      }

    }
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


  async presentToast(message: string, color: string = "secondary") {
    const toast = await this.toastController.create({
      position: "top",
      color,
      message: message,
      duration: 2000,
    });
    toast.present();
  }
}
