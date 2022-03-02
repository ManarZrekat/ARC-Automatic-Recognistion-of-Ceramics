import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { Camera } from "@ionic-native/camera/ngx";
//import { SplashScreen } from "@ionic-native/splash-screen";

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
import { ServiceWorkerModule } from '@angular/service-worker';



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
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
 
  providers: [
   // SplashScreen,
    Camera,
    PhotoService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AndroidPermissions
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
