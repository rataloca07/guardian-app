import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { ZonaSeguraService } from 'src/app/core/services/zona-segura.service';
import { ZonaSegura } from 'src/app/core/models/ZonaSegura';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-zonas',
  templateUrl: './zonas.page.html',
  styleUrls: ['./zonas.page.scss'],
})
export class ZonasPage implements OnInit {
  map: any;
  zonasSeguras: ZonaSegura[] = [];
  nuevaZona: ZonaSegura = {
    id: '',
    latitudCentro: 0,
    longitudCentro: 0,
    radio: 100, // Radio inicial por defecto
    descripcion: '',
    pacienteId: ''
  };
  marcador: any;
  circulo: any;
  pacienteId: string = "";

  constructor(
    private zonaSeguraService: ZonaSeguraService,
    private alertController: AlertController,
    private authService: AuthService  // Para obtener el ID del paciente
  ) {}

  async ngOnInit() {
    this.pacienteId = await this.authService.obtenerPacienteId();  // Obtener el ID del paciente dinámicamente
    this.initializeMap();
    this.obtenerZonasSeguras();
  }

  ionViewDidEnter() {
    // Forzar el redimensionamiento del mapa cuando la vista está completamente cargada
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);  // Llamar a invalidateSize para ajustar el mapa correctamente
  }

  // Inicializar el mapa con Leaflet
  initializeMap() {
    this.map = L.map('mapaZonas').setView([-12.046374, -77.042793], 14);  // Centrar en una ubicación por defecto

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Al hacer clic en el mapa, agregar marcador y círculo de zona
    this.map.on('click', (e: any) => {
      this.nuevaZona.latitudCentro = e.latlng.lat;
      this.nuevaZona.longitudCentro = e.latlng.lng;

      if (this.marcador) {
        this.map.removeLayer(this.marcador);
      }

      var iconoMarcador = L.icon({
        iconUrl: 'assets/icon/marker-icon.png',
        iconSize: [25, 41]
    });

      //this.marcador = L.marker(e.latlng).addTo(this.map);
      this.marcador = L.marker(e.latlng,{icon: iconoMarcador} ).addTo(this.map);

      if (this.circulo) {
        this.map.removeLayer(this.circulo);
      }

      this.circulo = L.circle(e.latlng, {
        color: 'blue',
        fillColor: '#30a3dc',
        fillOpacity: 0.5,
        radius: this.nuevaZona.radio
      }).addTo(this.map);
    });
  }

  // Obtener las zonas seguras del paciente y mostrarlas en el mapa
  obtenerZonasSeguras() {
    this.zonaSeguraService.obtenerZonasSegurasPorPaciente(this.pacienteId).subscribe((zonas) => {
      this.zonasSeguras = zonas;

      this.limpiarZonasDelMapa();

      zonas.forEach((zona) => {
        L.circle([zona.latitudCentro, zona.longitudCentro], {
          color: 'green',
          fillColor: '#7FFF00',
          fillOpacity: 0.5,
          radius: zona.radio
        }).addTo(this.map);
      });
    });
  }

  // Limpiar todas las zonas seguras del mapa
  limpiarZonasDelMapa() {
    this.map.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Circle) {
        this.map.removeLayer(layer);
      }
    });
  }

  // Guardar la nueva zona segura
  async guardarZonaSegura() {
    if (!this.marcador) {
      // Si no hay un marcador, mostrar alerta
      const alerta = await this.alertController.create({
        header: 'Advertencia',
        message: 'Primero toca el mapa para la ubicación de la nueva zona segura.',
        buttons: ['OK']
      });
      await alerta.present();
      return;  // Detener la ejecución del método si no hay marcador
    }
    const alert = await this.alertController.create({
      header: 'Guardar Zona Segura',
      inputs: [
        {
          name: 'descripcion',
          type: 'text',
          placeholder: 'Descripción de la zona'
        },
        {
          name: 'radio',
          type: 'number',
          value: this.nuevaZona.radio,  // Valor por defecto
          min: 5,
          max: 5000,
          placeholder: 'Radio en metros (min 5m, max 5000m)'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Guardar',
          handler: (data) => {
            const descripcionIngresada = data.descripcion;
            const radioIngresado = data.radio;

            // Validar que la descripción no esté vacía
            if (!descripcionIngresada || descripcionIngresada.trim().length === 0) {
              this.mostrarAlerta('Error', 'La descripción no puede estar vacía.');
              return;
            }

            // Validar que el radio esté en el rango permitido
            if (radioIngresado < 5 || radioIngresado > 5000) {
              this.mostrarAlerta('Error', 'El radio debe estar entre 5 y 5000 metros.');
              return;
            }

            this.nuevaZona.descripcion = descripcionIngresada;
            this.nuevaZona.radio = radioIngresado;
            this.nuevaZona.pacienteId = this.pacienteId;  // Asignar dinámicamente el ID del paciente
            this.registrarZonaSegura();
          }
        }
      ]
    });
    await alert.present();
  }

  // Mostrar una alerta
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Llamada para registrar la nueva zona segura en el servicio
  registrarZonaSegura() {
    this.zonaSeguraService.registrarZonaSegura(this.nuevaZona).subscribe(() => {
      // Después de registrar la zona, actualizar las zonas seguras
      this.obtenerZonasSeguras();
    });
  }

  // Editar una zona segura
  async editarZonaSegura(zona: ZonaSegura, event: Event) {
    event.stopPropagation();  // Evitar que se abra la ventana de eliminación al mismo tiempo
    const alert = await this.alertController.create({
      header: 'Editar Zona Segura',
      inputs: [
        {
          name: 'descripcion',
          type: 'text',
          value: zona.descripcion,
          placeholder: 'Descripción de la zona'
        },
        {
          name: 'radio',
          type: 'number',
          value: zona.radio,
          placeholder: 'Radio en metros',
          min: 2,
          max: 5000
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Guardar',
          handler: (data) => {
            const descripcionIngresada = data.descripcion;
            const radioIngresado = data.radio;

            // Validar que la descripción no esté vacía
            if (!descripcionIngresada || descripcionIngresada.trim().length === 0) {
              this.mostrarAlerta('Error', 'La descripción no puede estar vacía.');
              return;
            }

            // Validar que el radio esté en el rango permitido
            if (radioIngresado < 2 || radioIngresado > 5000) {
              this.mostrarAlerta('Error', 'El radio debe estar entre 2 y 5000 metros.');
              return;
            }

            zona.descripcion = descripcionIngresada;
            zona.radio = radioIngresado;
            this.modificarZonaSegura(zona);
          }
        }
      ]
    });
    await alert.present();
  }

  // Llamada para modificar la zona segura en el servicio
  modificarZonaSegura(zona: ZonaSegura) {
    this.zonaSeguraService.modificarZonaSegura(zona).subscribe(() => {
      // Actualizar las zonas seguras después de la modificación
      this.obtenerZonasSeguras();
    });
  }

  // Eliminar una zona segura
  async eliminarZonaSegura(zona: ZonaSegura) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Deseas eliminar esta zona segura?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.zonaSeguraService.eliminarZonaSegura(zona.id).subscribe(() => {
              // Actualizar las zonas seguras después de eliminar una zona
              this.obtenerZonasSeguras();
            });
          }
        }
      ]
    });
    await alert.present();
  }
}