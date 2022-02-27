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
  
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"],
})
export class DashboardPage implements OnInit, OnDestroy {
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
  label: string;

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
    private http: HttpClient,
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
  // async sendPostRequest() {
  //   let  url = 'http://192.168.1.20:8989/predict';
  //   const date = new Date().valueOf();
  
  //   // Replace extension according to your media type
  //   const imageName = date+ '.png';
  //   // call method that creates a blob from dataUri
  //   // const = photo
  //   const base64 = this.photoService.readAsBase64(await this.photoService.imgfile)
  //   console.log("a", await this.photoService.imgfile);

  //   console.log("b", await base64);

  //   const imageBlob = this.dataURItoBlob(base64);
    
  //   const imageFile = new File([imageBlob], imageName, { type: 'image/png' })

  //   let  postData = new FormData();
  //   postData.append('file', imageFile);
  
  //   let data:Observable<any> = this.httpClient.post(url,postData);
  //   data.subscribe((result) => {
  //     console.log(result);
  //   });

  // }


  async sendPostRequest() {
    let formData: FormData = new FormData();
  formData.append('file', this.photoService.imgfile);
  
  this.http.post("http://localhost:8989/predict", formData, {responseType: 'text'}).subscribe(
      data => {
        this.label = data;
          console.log(data); 
      },
      error => {
          console.log(error);
      }
  );
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




  public async returnFileImage(camphoto: Photo) {
    // "hybrid" will detect Cordova or Capacitor
   if (this.platform.is('hybrid')) {
     // Read the file into base64 format
     const file = await Filesystem.readFile({
       path: camphoto.path
     });
 
     return file;
   }
   else {
     // Fetch the photo, read as a blob, then convert to base64 format
     const response = await fetch(camphoto.webPath);
     const blob = await response.blob();
 
     return await this.photoService.convertBlobToBase64(blob) as string;
     
   }
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


    //this.potteryListBackup = potteryList;
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

//Camera
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
  };

  // takeSnap() {
  //   this.camera.getPicture(this.options).then(
  //     (imageData) => {
  //       // this.camera.DestinationType.FILE_URI gives file URI saved in local
  //       // this.camera.DestinationType.DATA_URL gives base64 URI
  //       let base64Image = "data:image/jpeg;base64," + imageData;
  //       // this.capturedSnapURL = base64Image;
  //     },
  //     (err) => {
  //       console.log(err);
  //       // Handle error
  //     }
  //   );
  // }
  async uploadImage() {
    try {
      const image = await this.photoService.getFromGallery();
      this.imagephoto=image;
      // this.imageFile=this.returnFileImage(image);
      // console.log(this.imagephoto.webPath);
      console.log(image);
      if (image) {
        const converted = await this.photoService.readAsBase64(image);
        this.imageTaken = converted;
      }
    } catch (error) {
      // check the error content.
      console.log("user cancelled the operation.");
      this.presentToast("user cancelled the operation");
    }
    return;
  }

  async takePhoto() {
    if (this.platform.is("cordova")) {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };

      this.camera.getPicture(options).then(
        (imageData) => {
          // imageData is either a base64 encoded string or a file URI
          this.base64Image = "data:image/jpeg;base64," + imageData;
        },
        (err) => {
          // Handle error
          console.error(err);
        }
      );
    }else{
      try {
        const image = await this.photoService.addNewToGallery();
        
        console.log(image);
        if (image) {
          const converted = await this.photoService.readAsBase64(image);
          this.imageTaken = converted;
          console.log("here")
        }
      } catch (error) {
        // check the error content.
        console.log("user cancelled the operation.");
        this.presentToast("user cancelled the operation", "warning");
      }
    }
  // }
  // catch (e) {
  //   console.log('no photo');
  // }

  }
  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }


  // upload(): void {
  //   var currentDate = Date.now();
  //   const file: any = this.base64ToImage(this.base64Image);
  //   const filePath = `Images/${currentDate}`;
  //   const fileRef = this.storage.ref(filePath);

  //   const task = this.storage.upload(`Images/${currentDate}`, file);
  //   task
  //     .snapshotChanges()
  //     .pipe(
  //       finalize(() => {
  //         this.downloadURL = fileRef.getDownloadURL();
  //         this.downloadURL.subscribe((downloadURL) => {
  //           if (downloadURL) {
  //             this.showSuccesfulUploadAlert();
  //           }
  //           console.log(downloadURL);
  //         });
  //       })
  //     )
  //     .subscribe((url) => {
  //       if (url) {
  //         console.log(url);
  //       }
  //     });
  // }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
          }
      }]
    });
    await actionSheet.present();
  }

  async showSuccesfulUploadAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: "basic-alert",
      header: "Uploaded",
      subHeader: "Image uploaded successful to Firebase storage",
      message: "Check Firebase storage.",
      buttons: ["OK"],
    });

    await alert.present();
  }

  // base64ToImage(dataURI) {
  //   const fileDate = dataURI.split(",");
  //   // const mime = fileDate[0].match(/:(.*?);/)[1];
  //   const byteString = atob(fileDate[1]);
  //   const arrayBuffer = new ArrayBuffer(byteString.length);
  //   const int8Array = new Uint8Array(arrayBuffer);
  //   for (let i = 0; i < byteString.length; i++) {
  //     int8Array[i] = byteString.charCodeAt(i);
  //   }
  //   const blob = new Blob([arrayBuffer], { type: "image/png" });
  //   return blob;
  // }

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
