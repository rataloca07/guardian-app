import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { Paciente } from 'src/app/core/models/Paciente';
import { AuthService } from 'src/app/core/services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-editar-paciente',
  templateUrl: './editar-paciente.page.html',
  styleUrls: ['./editar-paciente.page.scss'],
})
export class EditarPacientePage implements OnInit {
  paciente: Paciente = {
    id: '',
    sim: '',
    nombre: '',
    latitud: 0,
    longitud: 0,
    ritmoCardiaco: 0,
    guardianId: ''
  };

  constructor(
    private pacienteService: PacienteService,
    private authService: AuthService,  // Inyectar el AuthService para obtener el pacienteId
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    const pacienteId = await this.authService.obtenerPacienteId();
    console.log('Paciente ID obtenido:', pacienteId); // Verifica si obtenemos un pacienteId
    if (pacienteId) {
      await this.cargarPaciente(pacienteId);
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se encontró un paciente asociado',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
  
  async cargarPaciente(pacienteId: string) {
    const loading = await this.loadingController.create({
      message: 'Cargando datos del paciente...'
    });
    await loading.present();
  
    this.pacienteService.obtenerPaciente(pacienteId).subscribe(
      async (paciente) => {
        console.log('Datos del paciente obtenidos:', paciente); // Verifica si obtenemos los datos del paciente
        this.paciente = paciente;  // Asignar los datos del paciente al modelo
        await loading.dismiss();
      },
      async (err) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudieron cargar los datos del paciente',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }

  // Guardar los cambios del paciente
async guardarCambios() {
  const loading = await this.loadingController.create({
    message: 'Guardando cambios...'
  });
  await loading.present();

  this.pacienteService.modificarPaciente(this.paciente).subscribe(
    async () => {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Cambios guardados correctamente',
        buttons: ['OK']
      });
      await alert.present();
      this.router.navigate(['/home']);  // Redirigir a la página principal
    },
    async (err) => {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudieron guardar los cambios',
        buttons: ['OK']
      });
      await alert.present();
    }
  );
}
}