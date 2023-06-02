import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  template: '<ion-app><ion-router-outlet></ion-router-outlet></ion-app>',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isAppInitialized: boolean;

  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      this.isAppInitialized = true;
    });
  }
}
