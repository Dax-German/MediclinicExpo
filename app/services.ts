export interface Appointment {
  id: string;
  date: string;
  startTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'noshow';
  specialty?: {
    id: string;
    name: string;
  };
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    specialty: string;
  };
  duration?: number; // Duración de la cita en minutos (solo para citas completadas)
}

// Servicio de manejo de citas (simulado)
export const appointmentService = {
  // Obtener citas próximas
  getUpcomingAppointments: async (): Promise<Appointment[]> => {
    // Simular llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            date: '2024-08-14',
            startTime: '10:00',
            status: 'scheduled',
            specialty: {
              id: '8',
              name: 'Cardiología',
            },
            doctor: {
              id: '101',
              firstName: 'Juan',
              lastName: 'Pérez',
              specialty: 'Cardiología',
            },
          },
          {
            id: '2',
            date: '2024-08-21',
            startTime: '15:30',
            status: 'scheduled',
            specialty: {
              id: '1',
              name: 'Medicina general',
            },
            doctor: {
              id: '102',
              firstName: 'Ana',
              lastName: 'Gómez',
              specialty: 'Medicina general',
            },
          },
        ]);
      }, 1000);
    });
  },

  // Obtener historial de citas
  getAppointmentHistory: async (): Promise<Appointment[]> => {
    // Simular llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '3',
            date: '2024-07-10',
            startTime: '09:30',
            status: 'completed',
            specialty: {
              id: '6',
              name: 'Dermatología',
            },
            doctor: {
              id: '103',
              firstName: 'Carlos',
              lastName: 'Martínez',
              specialty: 'Dermatología',
            },
            duration: 25,
          },
          {
            id: '4',
            date: '2024-06-22',
            startTime: '16:00',
            status: 'cancelled',
            specialty: {
              id: '7',
              name: 'Traumatología',
            },
            doctor: {
              id: '104',
              firstName: 'Roberto',
              lastName: 'Sánchez',
              specialty: 'Traumatología',
            },
          },
          {
            id: '5',
            date: '2024-05-05',
            startTime: '11:15',
            status: 'noshow',
            specialty: {
              id: '1',
              name: 'Medicina general',
            },
            doctor: {
              id: '105',
              firstName: 'Laura',
              lastName: 'Pérez',
              specialty: 'Medicina general',
            },
          },
        ]);
      }, 1000);
    });
  },

  // Cancelar una cita
  cancelAppointment: async (appointmentId: string): Promise<void> => {
    // Simular llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Cita ${appointmentId} cancelada`);
        resolve();
      }, 1000);
    });
  },
}; 