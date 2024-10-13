import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { Paciente } from 'src/app/core/models/Paciente';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  guardianNombre: string = '';
  paciente: Paciente = {
    id: '',
    sim: '',
    nombre:'',
    latitud: 0,
    longitud: 0,
    ritmoCardiaco: 0,
    guardianId: ''
  };

  constructor(
    private authService: AuthService,
    private pacienteService: PacienteService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    // Obtener el nombre del guardián (esto puede ser almacenado previamente al iniciar sesión)
    const guardianId = await this.authService.obtenerGuardianId();
    if (guardianId) {
      this.guardianNombre = await this.authService.obtenerNombreGuardian();
      this.obtenerPaciente();
    }
  }

  // Obtener los datos del paciente
  async obtenerPaciente() {
    const pacienteId = await this.authService.obtenerPacienteId();
    this.pacienteService.obtenerPaciente(pacienteId).subscribe(
      (paciente) => {
        this.paciente = paciente;
      },
      async (err) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo obtener la información del paciente',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }

  // Redirigir al monitoreo
  irAMonitoreo() {
    this.router.navigate(['/monitor']);
  }

  // Redirigir a la gestión de zonas seguras
  irAZonasSeguras() {
    this.router.navigate(['/zonas']);
  }

  // Cerrar sesión
  async logout() {
    await this.authService.logout();  // Llamar al método logout del AuthService
    this.router.navigate(['/login']);  // Redirigir al login
  }
}