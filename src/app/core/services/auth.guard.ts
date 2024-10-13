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

    if (guardianId) {
      // Si hay un guardián autenticado, permitir el acceso
      return true;
    } else {
      // Si no ha iniciado sesión, redirigir a la página de inicio de sesión
      this.router.navigate(['/login']);
      return false;
    }
  }

  /*async canActivate(): Promise<boolean> {
    
    const isAuthenticated = await this.authService.estaAutenticado();

    if (isAuthenticated) {
      // Si hay un guardián autenticado, permitir el acceso
      return true;
    } else {
      // Si no ha iniciado sesión, redirigir a la página de inicio de sesión
      this.router.navigate(['/login']);
      return false;
    }
  }*/

  
}