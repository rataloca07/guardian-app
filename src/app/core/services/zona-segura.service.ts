/*import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ZonaSegura } from '../models/ZonaSegura';
import { AuthService } from './auth.service';  // Importar el servicio de autenticación

@Injectable({
  providedIn: 'root'
})
export class ZonaSeguraService {
  private baseUrl = 'https://localhost:7253/api/zonasegura';  // URL del backend ASP.NET

  constructor(private http: HttpClient, private authService: AuthService) {}


  // Obtener el token JWT y agregarlo al encabezado
  private async getHeaders(): Promise<HttpHeaders> {
    const token = await this.authService.obtenerToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Registrar una nueva zona segura
  registrarZonaSegura(zona: ZonaSegura): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrar`, zona);
  }

  // Verificar si el paciente está fuera de la zona segura
  verificarPacienteFueraDeZona(pacienteId: string, latitud: number, longitud: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/verificar/${pacienteId}`, { params: { latitud: latitud.toString(), longitud: longitud.toString() } });
  }

  // Editar una zona segura
  modificarZonaSegura(zona: ZonaSegura): Observable<any> {
    return this.http.put(`${this.baseUrl}/modificar`, zona);
  }

  // Eliminar una zona segura
  eliminarZonaSegura(zonaId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/eliminar/${zonaId}`);
  }

  // Obtener las zonas seguras de un paciente
obtenerZonasSegurasPorPaciente(pacienteId: string): Observable<ZonaSegura[]> {
    // Obtener el token JWT almacenado
  const token = await this.storage.get('token');

  // Configurar los encabezados para incluir el token JWT
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
    return this.http.get<ZonaSegura[]>(`${this.baseUrl}/paciente/${pacienteId}`);
  }
}*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ZonaSegura } from '../models/ZonaSegura';
import { AuthService } from './auth.service';  // Importar el servicio de autenticación

@Injectable({
  providedIn: 'root'
})
export class ZonaSeguraService {
  //private baseUrl = 'https://localhost:7253/api/zonasegura';  // URL del backend ASP.NET
  private baseUrl = 'https://guardian-service.onrender.com/api/zonasegura';  // URL del backend ASP.NET

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Obtener el token JWT y agregarlo al encabezado
  private async getHeaders(): Promise<HttpHeaders> {
    const token = await this.authService.obtenerToken();
    /*return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });*/
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'  // Añade este encabezado
    });
  }

  // Registrar una nueva zona segura
  registrarZonaSegura(zona: ZonaSegura): Observable<any> {
    console.log("Zona segura enviada: ");
    console.log(zona);
    return new Observable(observer => {
      this.getHeaders().then(headers => {
        this.http.post(`${this.baseUrl}/registrar`, zona, { headers }).subscribe(
          res => {
            observer.next(res);
            observer.complete();
          },
          err => observer.error(err)
        );
      });
    });
  }

  // Verificar si el paciente está fuera de la zona segura
  verificarPacienteFueraDeZona(pacienteId: string, latitud: number, longitud: number): Observable<any> {
    return new Observable(observer => {
      this.getHeaders().then(headers => {
        this.http.get(`${this.baseUrl}/verificar/${pacienteId}`, { 
          headers,
          params: { latitud: latitud.toString(), longitud: longitud.toString() }
        }).subscribe(
          res => {
            observer.next(res);
            observer.complete();
          },
          err => observer.error(err)
        );
      });
    });
  }

  // Modificar una zona segura
  modificarZonaSegura(zona: ZonaSegura): Observable<any> {
    return new Observable(observer => {
      this.getHeaders().then(headers => {
        this.http.put(`${this.baseUrl}/modificar`, zona, { headers }).subscribe(
          res => {
            observer.next(res);
            observer.complete();
          },
          err => observer.error(err)
        );
      });
    });
  }

  // Eliminar una zona segura
  eliminarZonaSegura(zonaId: string): Observable<any> {
    return new Observable(observer => {
      this.getHeaders().then(headers => {
        this.http.delete(`${this.baseUrl}/eliminar/${zonaId}`, { headers }).subscribe(
          res => {
            observer.next(res);
            observer.complete();
          },
          err => observer.error(err)
        );
      });
    });
  }

  // Obtener las zonas seguras de un paciente
  obtenerZonasSegurasPorPaciente(pacienteId: string): Observable<ZonaSegura[]> {
    return new Observable(observer => {
      this.getHeaders().then(headers => {
        this.http.get<ZonaSegura[]>(`${this.baseUrl}/paciente/${pacienteId}`, { headers }).subscribe(
          res => {
            observer.next(res);
            observer.complete();
          },
          err => observer.error(err)
        );
      });
    });
  }
}