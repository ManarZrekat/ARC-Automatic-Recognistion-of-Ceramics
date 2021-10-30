// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { initializeApp } from "firebase/app";
export const environment = {
  production: false,
  firebaseConfig: {
  apiKey: "AIzaSyB8SnRd8ioFtgVc8iDc9jJYzvsyTJ3cVek",
  authDomain: "projectarc2021-eeed8.firebaseapp.com",
  projectId: "projectarc2021-eeed8",
  storageBucket: "projectarc2021-eeed8.appspot.com",
  messagingSenderId: "790876039800",
  appId: "1:790876039800:web:2203ffa5bda5b23a5f9b8d"
  }
};

// const app = initializeApp(firebaseConfig);
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
