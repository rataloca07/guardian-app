/*import { Component, OnInit } from '@angular/core';
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
}*/
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
    nombre: '',
    latitud: 0,
    longitud: 0,
    ritmoCardiaco: 0,
    guardianId: ''
  };
  intervalId: any;

  constructor(
    private authService: AuthService,
    private pacienteService: PacienteService,
    private router: Router,
    private alertController: AlertController
  ) {}

  /*async ngOnInit() {
    const guardianId = await this.authService.obtenerGuardianId();
    if (guardianId) {
      this.guardianNombre = await this.authService.obtenerNombreGuardian();
      this.obtenerPaciente();
    }
  }*/

    async ngOnInit() {
      const guardianId = await this.authService.obtenerGuardianId();
      if (guardianId) {
        this.guardianNombre = await this.authService.obtenerNombreGuardian();
        this.obtenerPaciente();
        
        // Iniciar el intervalo para actualizar los datos del paciente cada 5 segundos
        this.intervalId = setInterval(() => {
          this.obtenerPaciente();
        }, 5000); // Actualizar cada 5 segundos
      }
    }
  
    ngOnDestroy() {
      // Limpiar el intervalo cuando el componente se destruya
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    }

  // Obtener los datos del paciente asociado al guardián
  async obtenerPaciente() {
    const pacienteId = await this.authService.obtenerPacienteId();
    console.log('PacienteId obtenido en home:', pacienteId); // Agrega este log

    if (!pacienteId) {
      // Si no hay paciente asociado, redirigir al registro de paciente
      this.router.navigate(['/register-paciente']);
      return;
    }

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

  // Redirigir a la vista de monitoreo del paciente
  irAMonitoreo() {
    this.router.navigate(['/monitor']);
  }

  // Redirigir a la vista de gestión de zonas seguras
  irAZonasSeguras() {
    this.router.navigate(['/zonas']);
  }

  // Redirigir a la vista de modificación del paciente
  irAModificarPaciente() {
    this.router.navigate(['/modificar-paciente']); // Redirigir a la vista de modificación de paciente
  }

  irAEditarPaciente() {
    if (this.paciente.id) {
      // Redirigir a la vista de editar paciente pasando el pacienteId
      this.router.navigate(['/editar-paciente'], { queryParams: { pacienteId: this.paciente.id } });
    }
  }
  
  // Redirigir a la vista de registrar paciente si no hay un paciente asociado
  irARegistrarPaciente() {
    this.router.navigate(['/registrar-paciente']);
  }

  // Cerrar sesión del guardián
  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}