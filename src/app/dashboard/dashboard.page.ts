import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { CameraPage } from '../camera/camera.page';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { first } from 'rxjs/operators';
import { AngularFireStorage } from "@angular/fire/compat/storage"
import { AlertController, Platform } from '@ionic/angular';
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  public potteryList: any[];
  public potteryListBackup: any[];
  userDetail: string;
  base64Image: string;
  selectedFile: File = null;
  downloadURL: Observable<string>;

  constructor(
    private camera: Camera,
    private router: Router,
    private ionicAuthService: AuthService,
    private firestore: AngularFirestore,
    private alertCtrl: AlertController,
    private storage: AngularFireStorage,
    private platform:Platform
  ) { }
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
    this.potteryList = await this.initializeItems();
  }
  
  ionChange(event){
    console.log(event)
  }
 
  async initializeItems(): Promise<any> {
    const potteryList = await this.firestore.collection('jugs')
      .valueChanges().pipe(first()).toPromise();
    this.potteryListBackup = potteryList;
    return potteryList;
  }
  async filterList(evt) {
    this.potteryList = await this.initializeItems();
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm) {
      return;
    }
  
    this.potteryList = this.potteryList.filter(currentPottery => {
      if (currentPottery.name && searchTerm) {
        console.log(currentPottery);
        return (currentPottery.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || currentPottery.type.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

   options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  
  takeSnap() {
    this.camera.getPicture(this.options).then((imageData) => {
      // this.camera.DestinationType.FILE_URI gives file URI saved in local
      // this.camera.DestinationType.DATA_URL gives base64 URI
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      // this.capturedSnapURL = base64Image;
    }, (err) => {
      console.log(err);
      // Handle error
    });
  }
  async takePhoto(sourceType: number) {
    if(this.platform.is('cordova')){
    
    
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
      console.error(err);
    });
  }
  }

  upload(): void {
    var currentDate = Date.now();
    const file: any = this.base64ToImage(this.base64Image);
    const filePath = `Images/${currentDate}`;
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(`Images/${currentDate}`, file);
    task.snapshotChanges()
      .pipe(finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe(downloadURL => {
          if (downloadURL) {
            this.showSuccesfulUploadAlert();
          }
          console.log(downloadURL);
        });
      })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

  async showSuccesfulUploadAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'basic-alert',
      header: 'Uploaded',
      subHeader: 'Image uploaded successful to Firebase storage',
      message: 'Check Firebase storage.',
      buttons: ['OK']
    });

    await alert.present();
  }

  base64ToImage(dataURI) {
    const fileDate = dataURI.split(',');
    // const mime = fileDate[0].match(/:(.*?);/)[1];
    const byteString = atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    return blob;
  }




  signOut() {
    this.ionicAuthService.signoutUser()
      .then(res => {
        this.router.navigateByUrl('login');
      })
      .catch(error => {
        console.log(error);
      });
  }
}
