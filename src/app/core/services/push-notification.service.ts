/*import { Injectable } from '@angular/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { AuthService } from './auth.service';  // Asegúrate de tener acceso a AuthService para obtener el guardián

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(private authService: AuthService) {}

  // Inicializar notificaciones push
  initializePushNotifications() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.error('El permiso para recibir notificaciones push fue denegado.');
      }
    });

    // Obtener el token del dispositivo
    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('Token de registro obtenido correctamente: ', token.value);
      console.log('Push registration success, token: ' + token.value);

      // Aquí debemos enviar el token al backend para asociarlo con el guardián
      const guardianId = await this.authService.obtenerGuardianId();  // Obtener el ID del guardián
      this.authService.actualizarTokenDispositivo(guardianId, token.value).subscribe(() => {
        console.log('Token de dispositivo guardado exitosamente');
      }, (err) => {
        console.log('No se pudo obtener token para notificaciones push');
        console.error('Error al guardar el token de dispositivo', err);
      });
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received: ', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Push action performed: ', action);
    });
  }
}*/

/*import { Injectable } from '@angular/core';
import { PushNotifications, Token, PushNotificationSchema } from '@capacitor/push-notifications';
import { ToastController } from '@ionic/angular';
import { AuthService } from './auth.service';  // Asegúrate de tener acceso a AuthService para obtener el guardián

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(
    private authService: AuthService,
    private toastController: ToastController  // Inyección de ToastController
  ) {}

  // Inicializar notificaciones push
  initializePushNotifications() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.error('El permiso para recibir notificaciones push fue denegado.');
      }
    });

    // Obtener el token del dispositivo
    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('Token de registro obtenido correctamente: ', token.value);
      console.log('Push registration success, token: ' + token.value);

      // Aquí debemos enviar el token al backend para asociarlo con el guardián
      const guardianId = await this.authService.obtenerGuardianId();  // Obtener el ID del guardián
      this.authService.actualizarTokenDispositivo(guardianId, token.value).subscribe(() => {
        console.log('Token de dispositivo guardado exitosamente');
      }, (err) => {
        console.log('No se pudo obtener token para notificaciones push');
        console.error('Error al guardar el token de dispositivo', err);
      });
    });

    // Listener para manejar la notificación cuando se recibe
    PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {
      console.log('Push received: ', notification);

      // Mostrar la notificación en el dispositivo
      const titulo = notification.title || 'Notificación';
      const mensaje = notification.body || 'Has recibido una nueva notificación.';
      await this.mostrarNotificacion(titulo, mensaje);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Push action performed: ', action);
    });
  }

  // Método para mostrar una notificación visual cuando se reciba una notificación push
  async mostrarNotificacion(titulo: string, mensaje: string) {
    const toast = await this.toastController.create({
      header: titulo,       // Título de la notificación
      message: mensaje,     // Cuerpo de la notificación
      duration: 5000,       // Duración en milisegundos
      position: 'top',      // Posición del toast en la pantalla
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await toast.present(); // Muestra la notificación
  }
}*/
/*import { Injectable } from '@angular/core';
import { PushNotifications, Token, PushNotificationSchema, PushNotificationActionPerformed } from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Inicializar notificaciones push
  initializePushNotifications() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.error('El permiso para recibir notificaciones push fue denegado.');
      }
    });


    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('Token de registro obtenido correctamente: ', token.value);
  
      // Obtener el ID del guardián y actualizar el token
      const guardianId = await this.authService.obtenerGuardianId();
      
      // Verificamos si el guardianId existe
      if (guardianId) {
        console.log('Enviando token actualizado al backend');
        this.authService.actualizarTokenDispositivo(guardianId, token.value).subscribe(() => {
          console.log('Token de dispositivo guardado exitosamente');
        }, (err) => {
          console.error('Detalles del error:', JSON.stringify(err.error));
          console.log('Error al guardar el token de dispositivo', err);
        });
      } else {
        console.error('No se encontró un guardianId, no se puede actualizar el token');
      }
    });

    // Listener para cuando se recibe una notificación push
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push received: ', notification);
    });

    // Listener para cuando el usuario toca la notificación push
    PushNotifications.addListener('pushNotificationActionPerformed', (action: PushNotificationActionPerformed) => {
      console.log('Push action performed: ', action);
      
      // Navegar a la vista de monitorización al tocar la notificación
      this.router.navigate(['/monitor']).then(() => {
        console.log('Navegando a la vista de monitorización');
      }).catch(err => {
        console.error('Error navegando a la vista de monitorización', err);
      });
    });
  }
}*/

import { Injectable } from '@angular/core';
import { PushNotifications, Token, PushNotificationSchema, PushNotificationActionPerformed } from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AlertController } from '@ionic/angular'; // Importar AlertController

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController // Inyectar AlertController
  ) {}

  // Inicializar notificaciones push
  initializePushNotifications() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.error('El permiso para recibir notificaciones push fue denegado.');
      }
    });

    // Obtener el token del dispositivo y actualizarlo en el backend
    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('Token de registro obtenido correctamente: ', token.value);
  
      // Obtener el ID del guardián y actualizar el token
      const guardianId = await this.authService.obtenerGuardianId();
      
      if (guardianId) {
        console.log('Enviando token actualizado al backend');
        this.authService.actualizarTokenDispositivo(guardianId, token.value).subscribe(() => {
          console.log('Token de dispositivo guardado exitosamente');
        }, (err) => {
          console.error('Detalles del error:', JSON.stringify(err.error));
          console.error('Error al guardar el token de dispositivo', err);
        });
      } else {
        console.error('No se encontró un guardianId, no se puede actualizar el token');
      }
    });

    // Listener para cuando se recibe una notificación push
    /*PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {
      console.log('Push received: ', notification);
      
      // Mostrar una alerta en caso de que la notificación indique que el paciente está fuera de la zona segura
      const alert = await this.alertController.create({
        header: 'Alerta',
        message: notification.body, // Mensaje de la notificación
        buttons: ['OK']
      });

      await alert.present();
    });*/

    PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {
      console.log('Push received: ', notification);

      // Mostrar una alerta en caso de que la notificación indique que el paciente está fuera de la zona segura
      const alert = await this.alertController.create({
        header: 'Alerta',
        message: notification.body, // Mensaje de la notificación
        buttons: [
          {
            text: 'OK',
            handler: () => {
              // Navegar a la vista de monitorización al hacer clic en OK
              this.router.navigate(['/monitor']).then(() => {
                console.log('Navegando a la vista de monitorización');
              }).catch(err => {
                console.error('Error navegando a la vista de monitorización', err);
              });
            }
          }
        ]
      });

      await alert.present();
    });

    // Listener para cuando el usuario toca la notificación push
    PushNotifications.addListener('pushNotificationActionPerformed', (action: PushNotificationActionPerformed) => {
      console.log('Push action performed: ', action);
      
      // Navegar a la vista de monitorización al tocar la notificación
      this.router.navigate(['/monitor']).then(() => {
        console.log('Navegando a la vista de monitorización');
      }).catch(err => {
        console.error('Error navegando a la vista de monitorización', err);
      });
    });
  }
}

