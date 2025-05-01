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

// Servicio de manejo de citas
export const appointmentService = {
  // Obtener citas próximas
  getUpcomingAppointments: async (): Promise<Appointment[]> => {
    // TODO: Implementar conexión con API real
    // Por ahora, devolvemos un array vacío
    // Cuando la API esté lista, reemplazar con la llamada correspondiente
    return [];
  },

  // Obtener historial de citas
  getAppointmentHistory: async (): Promise<Appointment[]> => {
    // TODO: Implementar conexión con API real
    // Por ahora, devolvemos un array vacío
    // Cuando la API esté lista, reemplazar con la llamada correspondiente
    return [];
  },

  // Cancelar una cita
  cancelAppointment: async (appointmentId: string): Promise<void> => {
    // TODO: Implementar conexión con API real
    console.log(`Pendiente implementar cancelación de cita ${appointmentId}`);
    // Cuando la API esté lista, reemplazar con la llamada correspondiente
  },
}; 