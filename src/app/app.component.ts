import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PushNotificationService } from './core/services/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform, private pushService: PushNotificationService) {
    this.initializeApp();
  }

  async ngOnInit() {
    // Inicializar notificaciones push
    this.pushService.initializePushNotifications();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Inicializar servicios adicionales si es necesario
    });
  }
}
