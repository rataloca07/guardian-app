export interface Guardian {
    id: string;
    email: string;
    password: string;
    nombre: string;
    tokenDispositivo?: string;  // Para recibir notificaciones push
  }