import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from "./auth.service";
import { Platforms } from '@ionic/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent  {
  constructor(
    public authService: AuthService
  ) {}
}
