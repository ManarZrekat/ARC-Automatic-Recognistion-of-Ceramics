import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { Camera } from "@ionic-native/camera/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";

// import { StatusBar } from '@ionic-native/status-bar';
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { environment } from "src/environments/environment";
import { HttpClientModule } from '@angular/common/http';
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireModule } from "@angular/fire/compat";
import { StoreModule } from "@ngrx/store";
import { AuthService } from "./auth.service";

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/compat/firestore";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { PhotoService } from "./services/photo.service";

import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
// import '../../providers/auth-service/auth-service';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';



const firebaseConfig = [
  AngularFireAuthModule,
  AngularFireModule.initializeApp(environment.firebaseConfig), // Your config
];

@NgModule({

  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    StoreModule.forRoot({}, {}),
  ],
  providers: [
    SplashScreen,
    Camera,
    PhotoService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AndroidPermissions
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
