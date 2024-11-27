/*import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { Guardian } from 'src/app/core/models/Guardian';
import { Paciente } from 'src/app/core/models/Paciente';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  nombreGuardian: string = '';
  email: string = '';
  password: string = '';
  nombrePaciente: string = '';
  simPaciente: string = '';

  constructor(
    private authService: AuthService,
    private pacienteService: PacienteService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  async registrar() {
    const loading = await this.loadingController.create({
      message: 'Registrando...'
    });
    await loading.present();

    const nuevoGuardian: Guardian = {
      id: '',
      nombre: this.nombreGuardian,
      email: this.email,
      password: this.password
    };

    // Registrar el guardián primero
    this.authService.registrarGuardian(nuevoGuardian).subscribe(
      async (res) => {
        const paciente: Paciente = {
          id: '',
          sim: this.simPaciente,
          nombre:'',
          latitud: 0,
          longitud: 0,
          ritmoCardiaco: 0,
          guardianId: res.guardianId  // Asociar al guardián registrado
        };

        // Registrar el paciente asociado al guardián
        this.pacienteService.registrarPaciente(paciente).subscribe(
          async () => {
            await loading.dismiss();
            const alert = await this.alertController.create({
              header: 'Éxito',
              message: 'Registro completado exitosamente',
              buttons: ['OK']
            });
            await alert.present();
            this.router.navigate(['/login']);  // Redirigir al inicio de sesión
          },
          async (err) => {
            await loading.dismiss();
            const alert = await this.alertController.create({
              header: 'Error',
              message: 'Error al registrar al paciente',
              buttons: ['OK']
            });
            await alert.present();
          }
        );
      },
      async (err) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Error al registrar el guardián',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }
}*/
import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Guardian } from 'src/app/core/models/Guardian';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  nombreGuardian: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  async registrar() {
    const loading = await this.loadingController.create({
      message: 'Registrando guardián...'
    });
    await loading.present();

    const nuevoGuardian: Guardian = {
      id: '',
      nombre: this.nombreGuardian,
      email: this.email,
      password: this.password,
      tokenDispositivo: ''
    };

    // Registrar el guardián
    console.log("Datos enviados:", nuevoGuardian);
    this.authService.registrarGuardian(nuevoGuardian).subscribe(
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Guardían registrado correctamente',
          buttons: ['OK']
        });
        await alert.present();
        // Redirigir a la vista de registro de paciente
        this.router.navigate(['/register-paciente']);
      },
      async (err) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Error al registrar el guardián',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }

  // Regresar a la vista de login
  irALogin() {
    this.router.navigate(['/login']);
  }
}