// Tipos
import apiServices from '../../src/api/services';

// Importaciones de tipos desde los servicios
import {
    Appointment,
    Doctor,
    Specialty
} from '../../src/api/services/appointmentService';

import {
    RegisterUserData as ApiRegisterData,
    AuthResponse,
    LoginCredentials,
    User
} from '../../src/api/services/authService';

import {
    Notification
} from '../../src/api/services/notificationService';

// Definición de tipos locales necesarios
export interface Alert {
  id: string;
  title: string;
  description: string;
  date: string;
  isRead: boolean;
  type: 'appointment' | 'result' | 'reminder' | 'system';
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  gender: string;
  role?: string;
  defaultSchedule?: boolean;
  specialtyId?: number;
  physicalLocationId?: number;
}

// Re-exportamos los tipos para mantener compatibilidad
export type { Appointment, AuthResponse, Doctor, LoginCredentials, Specialty, User };

// Funciones wrapper para usar los servicios existentes en src/api/services
// Estos métodos se mantienen para no romper código existente

// Servicio de citas
export const appointmentService = {
  // Obtener próximas citas
  getUpcomingAppointments: async (): Promise<Appointment[]> => {
    try {
      // Obtiene los appointment con estado "scheduled"
      const response = await apiServices.appointments.getUpcomingAppointments({
        status: 'scheduled',
        limit: 20,
      });
      return response.items || [];
    } catch (error) {
      console.error('Error al obtener próximas citas:', error);
      return [];
    }
  },

  // Obtener historial de citas
  getAppointmentHistory: async (): Promise<Appointment[]> => {
    try {
      // Obtiene los appointment con estado "completed", "cancelled" o "noshow"
      const response = await apiServices.appointments.getAppointmentHistory({
        status: 'completed,cancelled,noshow',
        limit: 20,
      });
      return response.items || [];
    } catch (error) {
      console.error('Error al obtener historial de citas:', error);
      return [];
    }
  },

  // Obtener detalles de una cita por ID
  getAppointmentById: async (id: string): Promise<Appointment | null> => {
    try {
      return await apiServices.appointments.getAppointmentDetails(id);
    } catch (error) {
      console.error(`Error al obtener cita con ID ${id}:`, error);
      return null;
    }
  },

  // Cancelar una cita
  cancelAppointment: async (id: string): Promise<boolean> => {
    try {
      await apiServices.appointments.cancelAppointment(id);
      return true;
    } catch (error) {
      console.error(`Error al cancelar cita con ID ${id}:`, error);
      return false;
    }
  },

  // Programar una nueva cita
  scheduleAppointment: async (appointmentData: any): Promise<Appointment> => {
    try {
      return await apiServices.appointments.createAppointment(appointmentData);
    } catch (error) {
      console.error('Error al programar nueva cita:', error);
      throw error;
    }
  }
};

// Servicio de especialidades
export const specialtyService = {
  // Obtener todas las especialidades
  getAllSpecialties: async (): Promise<Specialty[]> => {
    try {
      const response = await apiServices.specialties.getAllSpecialties();
      return response.items || [];
    } catch (error) {
      console.error('Error al obtener especialidades:', error);
      throw error;
    }
  },

  // Obtener especialidad por ID
  getSpecialtyById: async (id: string): Promise<Specialty | null> => {
    try {
      return await apiServices.specialties.getSpecialtyDetails(id);
    } catch (error) {
      console.error(`Error al obtener especialidad con ID ${id}:`, error);
      return null;
    }
  }
};

// Servicio de alertas
export const alertService = {
  // Obtener todas las alertas (adaptamos Notification a Alert para compatibilidad)
  getAllAlerts: async (userId: number): Promise<Alert[]> => {
    try {
      const response = await apiServices.notifications.getAllNotifications({
        userId: userId.toString()
      });
      
      // Convertir de Notification a Alert
      return (response.items || []).map((notification: Notification) => ({
        id: notification.id,
        title: notification.title || '',
        description: notification.message || '',
        date: notification.createdAt,
        isRead: notification.read,
        type: notification.type as any
      }));
    } catch (error) {
      console.error('Error al obtener alertas:', error);
      throw error;
    }
  },

  // Marcar alerta como leída
  markAlertAsRead: async (id: string): Promise<boolean> => {
    try {
      await apiServices.notifications.markAsRead(id);
      return true;
    } catch (error) {
      console.error(`Error al marcar alerta con ID ${id} como leída:`, error);
      return false;
    }
  }
};

// Servicio de autenticación
export const authService = {
  // Iniciar sesión
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      return await apiServices.auth.login(credentials);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  },

  // Registrar nuevo usuario
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      // Ya no necesitamos adaptar el formato, pues el RegisterData ya coincide con ApiRegisterData
      const registerData: ApiRegisterData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        documentType: userData.documentType,
        documentNumber: userData.documentNumber,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        passwordConfirmation: userData.passwordConfirmation,
        gender: userData.gender,
        role: userData.role,
        defaultSchedule: userData.defaultSchedule,
        specialtyId: userData.specialtyId,
        physicalLocationId: userData.physicalLocationId
      };
      
      return await apiServices.auth.register(registerData);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  },

  // Enviar enlace para restablecer contraseña
  requestPasswordReset: async (email: string): Promise<boolean> => {
    try {
      await apiServices.auth.forgotPassword(email);
      return true;
    } catch (error) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      return false;
    }
  }
};

// API Config y Auth Service también serían añadidos aquí
// pero por simplicidad, este es un ejemplo básico 