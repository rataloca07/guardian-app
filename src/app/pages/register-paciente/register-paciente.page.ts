/*import { Component } from '@angular/core';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { Paciente } from 'src/app/core/models/Paciente';
import { AuthService } from 'src/app/core/services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-paciente',
  templateUrl: './register-paciente.page.html',
  styleUrls: ['./register-paciente.page.scss'],
})
export class RegisterPacientePage {
  nombrePaciente: string = '';
  simPaciente: string = '';

  constructor(
    private pacienteService: PacienteService,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  async registrarPaciente() {
    const loading = await this.loadingController.create({
      message: 'Registrando paciente...'
    });
    await loading.present();

    const guardianId = await this.authService.obtenerGuardianId();

    const nuevoPaciente: Paciente = {
      id: '',
      sim: this.simPaciente,
      nombre: this.nombrePaciente,
      latitud: 0,
      longitud: 0,
      ritmoCardiaco: 0,
      guardianId: guardianId
    };

    console.log('Datos del paciente a registrar:', nuevoPaciente);
    // Registrar el paciente
    this.pacienteService.registrarPaciente(nuevoPaciente).subscribe(
      async () => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Paciente registrado correctamente',
          buttons: ['OK']
        });
        await alert.present();
        this.router.navigate(['/home']);  // Redirigir a home
      },
      async (err) => {
        console.error('Error registro paciente:', err);
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Error al registrar el paciente',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }
}*/
import { Component } from '@angular/core';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { Paciente } from 'src/app/core/models/Paciente';
import { AuthService } from 'src/app/core/services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-paciente',
  templateUrl: './register-paciente.page.html',
  styleUrls: ['./register-paciente.page.scss'],
})
export class RegisterPacientePage {
  nombrePaciente: string = '';
  simPaciente: string = '';

  constructor(
    private pacienteService: PacienteService,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  async registrarPaciente() {
    const loading = await this.loadingController.create({
      message: 'Registrando paciente...'
    });
    await loading.present();

    const guardianId = await this.authService.obtenerGuardianId();

    const nuevoPaciente: Paciente = {
      id: '',
      sim: this.simPaciente,
      nombre: this.nombrePaciente,
      latitud: 0,
      longitud: 0,
      ritmoCardiaco: 0,
      guardianId: guardianId
    };

    console.log('Datos del paciente a registrar:', nuevoPaciente);
    
    // Registrar el paciente
    this.pacienteService.registrarPaciente(nuevoPaciente).subscribe(
      async (res: any) => {
        // Guardar el PacienteId en el storage
        //await this.authService.guardarPacienteId(res.pacienteId);
        if (res.pacienteId) {
          await this.authService.guardarPacienteId(res.pacienteId);
        }
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Paciente registrado correctamente',
          buttons: ['OK']
        });
        await alert.present();

        // Redirigir a home
        this.router.navigate(['/home']);
      },
      async (err) => {
        console.error('Error registro paciente:', err);
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Error al registrar el paciente',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}