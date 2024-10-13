//import { Component, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';

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
    private loadingController: LoadingController
  ) {}

  async login() {
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
  }

  // Nueva función para redirigir a la página de registro
  irARegister() {
    this.router.navigate(['/register']);
  }
}