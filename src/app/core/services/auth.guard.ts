import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const guardianId = await this.authService.obtenerGuardianId();  // Verificar si hay un guardián autenticado
    //const pacienteId = await this.authService.obtenerPacienteId();

    if (guardianId) {
      // Si hay un guardián autenticado, permitir el acceso
      return true;
    } else {
      // Si no ha iniciado sesión, redirigir a la página de inicio de sesión
      this.router.navigate(['/login']);
      return false;
    }
      /*if (guardianId) {
        if (pacienteId) {
          console.log("caso 1");
          // Si el guardián tiene un paciente, permitir el acceso
          return true;
        } else {
          console.log("caso 2");
          // Si no tiene un paciente, redirigir al registro de paciente
          this.router.navigate(['/register-paciente']);
          return false;
        }
      } else {
        console.log("caso 3");
        // Si no ha iniciado sesión, redirigir a la página de login
        this.router.navigate(['/login']);
        return false;
      }*/
  }
}