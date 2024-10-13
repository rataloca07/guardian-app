import { Component, OnInit, OnDestroy } from '@angular/core';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { ZonaSeguraService } from 'src/app/core/services/zona-segura.service';
import { Paciente } from 'src/app/core/models/Paciente';
import { ZonaSegura } from 'src/app/core/models/ZonaSegura';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service'; 
import * as L from 'leaflet';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.page.html',
  styleUrls: ['./monitor.page.scss'],
})
export class MonitorPage implements OnInit, OnDestroy {
  paciente: Paciente = {
    id: '',
    sim: '',
    nombre: '',
    latitud: 0,
    longitud: 0,
    ritmoCardiaco: 0,
    guardianId: ''
  };
  zonasSeguras: ZonaSegura[] = [];
  map: any;
  ritmoCardiaco: number = 0;
  marker: any;
  intervalId: any;

  constructor(
    private pacienteService: PacienteService,
    private zonaSeguraService: ZonaSeguraService,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.initializeMap();
    await this.obtenerPaciente();
    this.obtenerZonasSeguras();  // Cargar las zonas seguras al iniciar
  }

  ionViewWillEnter() {
    // Cada vez que se acceda a la vista de monitoreo, se inicia la actualización automática cada 10 segundos
    this.obtenerPaciente();
    this.obtenerZonasSeguras();  // Asegurar que las zonas seguras se actualicen
    this.intervalId = setInterval(() => {
      this.actualizarMonitoreo();
    }, 10000);  // Actualización cada 10 segundos
  }

  ionViewDidEnter() {
    // Forzar el redimensionamiento del mapa cuando la vista está completamente cargada
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);  // Llamar a invalidateSize para ajustar el mapa correctamente
  }

  ionViewWillLeave() {
    // Cuando el usuario salga de la vista, detendremos las actualizaciones
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  ngOnDestroy() {
    // Limpiar el intervalo cuando el componente se destruya (precaución adicional)
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Inicializar el mapa con Leaflet
  initializeMap() {
    this.map = L.map('map').setView([-12.046374, -77.042793], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  // Obtener los datos del paciente dinámicamente usando AuthService
  async obtenerPaciente() {
    const pacienteId = await this.authService.obtenerPacienteId();  // Obtener el ID del paciente de manera dinámica
    this.pacienteService.obtenerPaciente(pacienteId).subscribe((data) => {
      this.paciente = data;
      this.ritmoCardiaco = data.ritmoCardiaco;

      // Actualizar la posición del marcador en el mapa
      if (this.marker) {
        this.marker.setLatLng([data.latitud, data.longitud]);
      } else {
        this.marker = L.marker([data.latitud, data.longitud]).addTo(this.map);
        this.map.setView([data.latitud, data.longitud], 16);  // Centrar el mapa en la ubicación del paciente
      }
    });
  }

  // Obtener las zonas seguras del paciente y dibujarlas en el mapa
  obtenerZonasSeguras() {
    this.authService.obtenerPacienteId().then((pacienteId) => {
      this.zonaSeguraService.obtenerZonasSegurasPorPaciente(pacienteId).subscribe((zonas) => {
        this.zonasSeguras = zonas;

        // Limpiar las zonas anteriores del mapa
        this.clearZonasSegurasEnMapa();

        // Dibujar las zonas seguras en el mapa
        zonas.forEach((zona) => {
          L.circle([zona.latitudCentro, zona.longitudCentro], {
            color: 'green',
            fillColor: '#7FFF00',
            fillOpacity: 0.5,
            radius: zona.radio
          }).addTo(this.map);
        });
      });
    });
  }

  // Método para limpiar zonas seguras previas del mapa
  clearZonasSegurasEnMapa() {
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Circle) {
        this.map.removeLayer(layer);
      }
    });
  }

  // Actualización de monitoreo: ritmo cardíaco y posición
  actualizarMonitoreo() {
    this.obtenerPaciente();  // Volver a obtener los datos actualizados del paciente
  }
}