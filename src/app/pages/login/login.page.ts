//import { Component, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { NgZone  } from '@angular/core'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private zone: NgZone // Inyectar ChangeDetectorRef
  ) {}

  /*async ionViewWillEnter() {
    // Limpiar el almacenamiento local al entrar a la vista de login
    await this.authService.logout();
  }*/

  /*async login() {
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...'
    });
    await loading.present();

    this.authService.login(this.email, this.password).subscribe(
      async (res) => {
        console.log('Login successful:', res);
        await loading.dismiss();

        await this.authService.estaAutenticado();

        this.router.navigateByUrl('/home').then(
          () => console.log('Navigation successful'),
          (err) => console.error('Navigation error:', err)
        );
      },
      async (err) => {
        console.error('Login error:', err);
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Credenciales incorrectas',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }*/
    /*async login() {
      const loading = await this.loadingController.create({
        message: 'Iniciando sesión...'
      });
      await loading.present();
  
      this.authService.login(this.email, this.password).subscribe(
        async (res) => {
          console.log('Login successful:', res);
          await loading.dismiss();
  
          const isAuthenticated = await this.authService.estaAutenticado();
          if (isAuthenticated) {
            // Verificar si el guardián tiene un paciente asociado
            const pacienteId = await this.authService.obtenerPacienteId();
            this.zone.run(() => {
              if (pacienteId) {
                // Redirigir a la vista principal (home)
                this.router.navigateByUrl('/home').then(
                  () => console.log('Navigation to Home successful'),
                  (err) => console.error('Navigation error:', err)
                );
              } else {
                // Redirigir a la vista de registro de paciente si no tiene paciente
                this.router.navigateByUrl('/register-paciente').then(
                  () => console.log('Navigation to Register Paciente successful'),
                  (err) => console.error('Navigation error:', err)
                );
              }
            });
          }
        },
        async (err) => {
          console.error('Login error:', err);
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Credenciales incorrectas',
            buttons: ['OK']
          });
          await alert.present();
        }
      );
    }*/
      async login() {
        const loading = await this.loadingController.create({
          message: 'Iniciando sesión...'
        });
        await loading.present();
    
        this.authService.login(this.email, this.password).subscribe(
          async (res) => {
            console.log('Login successful:', res);
            await loading.dismiss();
    
            // Revisar si el guardián tiene un paciente asociado
            const pacienteId = await this.authService.obtenerPacienteId();
            if (pacienteId) {
              // Redirigir a la vista principal si hay un paciente
              this.router.navigateByUrl('/home');
            } else {
              // Redirigir a la vista de registro de paciente si no tiene paciente
              this.router.navigateByUrl('/register-paciente');
            }
    
          },
          async (err) => {
            console.error('Login error:', err);
            await loading.dismiss();
            const alert = await this.alertController.create({
              header: 'Error',
              message: 'Credenciales incorrectas',
              buttons: ['OK']
            });
            await alert.present();
          }
        );
      }
  // Nueva función para redirigir a la página de registro
  irARegister() {
    this.router.navigate(['/register']);
  }
}
