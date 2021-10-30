import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { CameraPage } from '../camera/camera.page';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  public potteryList: any[];
  public potteryListBackup: any[];
  userDetail: string;

  constructor(
    private camera: Camera,
    private router: Router,
    private ionicAuthService: AuthService,
    private firestore: AngularFirestore
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
