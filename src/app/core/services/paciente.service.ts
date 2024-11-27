/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paciente } from '../models/Paciente';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private baseUrl = 'https://localhost:7253/api/paciente';  // URL del backend ASP.NET

  constructor(private http: HttpClient) {}

  // Registrar un nuevo paciente
  registrarPaciente(paciente: Paciente): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrar`, paciente);
  }

  // Actualizar la ubicación y ritmo cardiaco del paciente
  actualizarEstadoPaciente(sim: string, latitud: number, longitud: number, ritmoCardiaco: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/actualizar`, { sim, latitud, longitud, ritmoCardiaco });
  }

  // Obtener los datos del paciente desde el backend
obtenerPaciente(pacienteId: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.baseUrl}/obtener/${pacienteId}`);
  }
}*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/Paciente';
import { AuthService } from './auth.service';  // Importar el servicio de autenticación

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  //private baseUrl = 'https://localhost:7253/api/paciente';  // URL del backend ASP.NET
  private baseUrl = 'https://guardian-service.onrender.com/api/paciente';  // URL del backend ASP.NET

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Obtener el token JWT y agregarlo al encabezado
  private async getHeaders(): Promise<HttpHeaders> {
    const token = await this.authService.obtenerToken();
    /*return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });*/
    /*return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'  // Añade este encabezado
    });*/
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  
    // Verifica el valor de los headers antes de enviarlos
    console.log("Headers enviados: ", headers);
  
    return headers;
  }

  // Registrar un nuevo paciente
  registrarPaciente(paciente: Paciente): Observable<any> {
    return new Observable(observer => {
      this.getHeaders().then(headers => {
        this.http.post(`${this.baseUrl}/registrar`, paciente, { headers }).subscribe(
          res => {
            observer.next(res);
            observer.complete();  // Importante para completar el observable
          },
          err => observer.error(err)
        );
      });
    });
  }

  // Actualizar la ubicación y ritmo cardiaco del paciente
  actualizarEstadoPaciente(sim: string, latitud: number, longitud: number, ritmoCardiaco: number): Observable<any> {
    return new Observable(observer => {
      this.getHeaders().then(headers => {
        this.http.post(`${this.baseUrl}/actualizar`, { sim, latitud, longitud, ritmoCardiaco }, { headers }).subscribe(
          res => {
            observer.next(res);
            observer.complete();
          },
          err => observer.error(err)
        );
      });
    });
  }

  // Obtener los datos del paciente desde el backend
  obtenerPaciente(pacienteId: string): Observable<Paciente> {
    return new Observable(observer => {
      this.getHeaders().then(headers => {
        this.http.get<Paciente>(`${this.baseUrl}/obtener/${pacienteId}`, { headers }).subscribe(
          res => {
            console.log("Respuesta obtener paciente: ");
            console.log(res);
            observer.next(res);
            observer.complete();
          },
          err => {
            console.log("Respuesta error obtener paciente: ");
            console.log(err);
            observer.error(err);
          }
        );
      });
    });
  }

// Modificar un paciente
modificarPaciente(paciente: Paciente): Observable<any> {
  return new Observable(observer => {
    this.getHeaders().then(headers => {
      this.http.put(`${this.baseUrl}/modificar`, paciente, { headers }).subscribe(
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