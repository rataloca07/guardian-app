/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Guardian } from '../models/Guardian';
import { Observable } from 'rxjs';*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guardian } from '../models/Guardian';
import { Storage } from '@ionic/storage-angular';
import { PushNotifications, Token, PushNotificationSchema, PushNotificationActionPerformed } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private baseUrl = 'https://localhost:7253/api/guardian';  // URL del backend ASP.NET
  private baseUrl = 'https://guardian-service.onrender.com/api/guardian';  // URL del backend ASP.NET

  constructor(private http: HttpClient, private storage: Storage) {
    this.init();  // Inicializar el almacenamiento al crear el servicio
  }

  // Inicializar Ionic Storage
  async init() {
    await this.storage.create();
  }

  // Registrar un nuevo guardián
  registrarGuardian(guardian: Guardian): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrar`, guardian);
  }

  // Iniciar sesión del guardián y almacenar los datos en el almacenamiento local
  /*login(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${this.baseUrl}/login`, { email, password }).subscribe(
        async (res: any) => {
          // Guardar los datos del guardián y el paciente en el almacenamiento local
          await this.storage.set('guardianId', res.guardianId);
          await this.storage.set('pacienteId', res.pacienteId);
          await this.storage.set('guardianNombre', res.guardianNombre);
          observer.next(res);
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }*/

  /*async login(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${this.baseUrl}/login`, { email, password }).subscribe(
        async (res: any) => {
          await this.storage.set('guardianId', res.guardianId);
          await this.storage.set('pacienteId', res.pacienteId);
          await this.storage.set('guardianNombre', res.guardianNombre);  // Almacenar el nombre del guardián
          observer.next(res);
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }*/

    /*login(email: string, password: string): Observable<any> {
        return new Observable(observer => {
          this.http.post(`${this.baseUrl}/login`, { email, password }).subscribe(
            async (res: any) => {
              await this.storage.set('guardianId', res.guardianId);
              await this.storage.set('token', res.token);  // Almacenar el nombre del guardián
              await this.storage.set('pacienteId', res.pacienteId);
              await this.storage.set('guardianNombre', res.guardianNombre);  // Almacenar el nombre del guardián
              
              observer.next(res);
            },
            (err) => {
              observer.error(err);
            }
          );
        });
      }*/
        /*login(email: string, password: string): Observable<any> {
          return new Observable(observer => {
            this.http.post(`${this.baseUrl}/login`, { email, password }).subscribe(
              async (res: any) => {
                // Guardar datos del guardián
                await this.storage.set('guardianId', res.guardianId);
                await this.storage.set('token', res.token);
                await this.storage.set('pacienteId', res.pacienteId);
                await this.storage.set('guardianNombre', res.guardianNombre);
        
                // Después de iniciar sesión, obtener el token de dispositivo de PushNotifications
                PushNotifications.addListener('registration', async (token: Token) => {
                  console.log('Token de registro de dispositivo obtenido: ', token.value);
                  
                  // Actualizar el token del dispositivo en el backend
                  this.actualizarTokenDispositivo(res.guardianId, token.value).subscribe(() => {
                    console.log('Token de dispositivo actualizado correctamente');
                  }, (err) => {
                    console.error('Error al actualizar el token de dispositivo', err);
                  });
                });
        
                observer.next(res);
              },
              (err) => {
                observer.error(err);
              }
            );
          });
        }*/
          login(email: string, password: string): Observable<any> {
            return new Observable(observer => {
              this.http.post(`${this.baseUrl}/login`, { email, password }).subscribe(
                async (res: any) => {
                  // Guardar datos del guardián
                  await this.storage.set('guardianId', res.guardianId);
                  await this.storage.set('token', res.token);
                  await this.storage.set('pacienteId', res.pacienteId);
                  await this.storage.set('guardianNombre', res.guardianNombre);
          
                  // Asegurarte de que el dispositivo esté registrado
                  PushNotifications.requestPermissions().then(result => {
                    if (result.receive === 'granted') {
                      // Registramos el dispositivo para obtener el token
                      PushNotifications.register();
                      
                      // Ahora esperamos la obtención del token
                      PushNotifications.addListener('registration', async (token: Token) => {
                        console.log('Token de registro de dispositivo obtenido: ', token.value);
                        
                        // Actualizar el token del dispositivo en el backend
                        this.actualizarTokenDispositivo(res.guardianId, token.value).subscribe(() => {
                          console.log('Token de dispositivo actualizado correctamente');
                        }, (err) => {
                          console.error('Error al actualizar el token de dispositivo', err);
                        });
                      });
                    } else {
                      console.error('Permiso para recibir notificaciones denegado');
                    }
                  });
          
                  observer.next(res);
                },
                (err) => {
                  observer.error(err);
                }
              );
            });
          }

  // Obtener el ID del guardián desde el almacenamiento
  async obtenerGuardianId(): Promise<string> {
    return await this.storage.get('guardianId');
  }

  // Obtener el ID del paciente desde el almacenamiento
  async obtenerPacienteId(): Promise<string> {
    return await this.storage.get('pacienteId');
  }

  // Obtener el nombre del guardián almacenado
async obtenerNombreGuardian(): Promise<string> {
    return await this.storage.get('guardianNombre');
  }

  async obtenerToken(): Promise<string> {
    return await this.storage.get('token');
  }
  
  /*async logout() {
    // Limpiar todo el almacenamiento local (incluye guardianId, pacienteId, etc.)
    await this.storage.clear();
  }*/
    async logout() {
      // Obtener el ID del guardián
      const guardianId = await this.obtenerGuardianId();
      
      if (guardianId) {
        // Eliminar el token del dispositivo en el backend
        this.eliminarTokenDispositivo(guardianId).subscribe(() => {
          console.log('Token de dispositivo eliminado correctamente');
        }, (err) => {
          console.error('Error al eliminar el token de dispositivo', err);
        });
      }
    
      // Limpiar el almacenamiento local
      await this.storage.clear();
    }

  async estaAutenticado(): Promise<boolean> {
    const guardianId = await this.storage.get('guardianId');
    return !!guardianId; // Retorna true si guardianId existe, false si no
  }

  // Método para actualizar el token del dispositivo
  actualizarTokenDispositivo(guardianId: string, token: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/actualizarTokenDispositivo`, { guardianId, token });
  }

  // Método para eliminar el token del dispositivo
  eliminarTokenDispositivo(guardianId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/eliminarTokenDispositivo/${guardianId}`);
  }

}
