/**
 * Definición centralizada de todos los endpoints de la API
 * Esto evita el uso de strings mágicos y facilita cambios globales
 */

// URL base del API - ajústala según tu entorno
export const API_BASE_URL = 'http://localhost:8080';

export interface AuthEndpoints {
  LOGIN: string;
  REGISTER: string;
  FORGOT_PASSWORD: string;
  RESET_PASSWORD: string;
  REFRESH_TOKEN: string;
}

export interface UsersEndpoints {
  GET_ALL: string;
  GET_BY_ID: (id: number) => string;
  UPDATE: (id: number) => string;
  DELETE: (id: number) => string;
  PROFILE: string;
  UPDATE_PROFILE: string;
  CHANGE_PASSWORD: string;
  UPLOAD_AVATAR: string;
}

export interface AppointmentsEndpoints {
  GET_ALL: string;
  GET_BY_PATIENT: (patientId: number) => string;
  GET_BY_DOCTOR: (doctorId: number) => string;
  CREATE: string;
  UPDATE: (id: number) => string;
  FILTER: (params: {
    startDate?: string;
    endDate?: string;
    status?: string;
    physicalLocationId?: number;
  }) => string;
  GET_UPCOMING: string;
  GET_HISTORY: string;
  DETAILS: (id: string) => string;
  CANCEL: (id: string) => string;
  RESCHEDULE: (id: string) => string;
}

export interface SpecialtiesEndpoints {
  GET_ALL: string;
  GET_BY_ID: (id: number) => string;
  CREATE: string;
  UPDATE: (id: number) => string;
  DELETE: (id: number) => string;
  DETAILS: (id: string) => string;
  DOCTORS: (specialtyId: string) => string;
}

export interface AppointmentTypesEndpoints {
  GET_ALL: string;
  GET_BY_SPECIALTY: (specialtyId: number) => string;
  CREATE: string;
  UPDATE: (id: number) => string;
  DELETE: (id: number) => string;
}

export interface AvailabilityEndpoints {
  GET_ALL: string;
  GET_BY_DOCTOR: (doctorId: number) => string;
  GET_AVAILABLE_SLOTS: (params: {
    doctorId: number;
    appointmentTypeId: number;
    startDate?: string;
    endDate?: string;
  }) => string;
  CREATE: string;
  DELETE: (id: number) => string;
}

export interface PhysicalLocationsEndpoints {
  GET_ALL: string;
  GET_BY_ID: (id: number) => string;
  CREATE: string;
  UPDATE: (id: number) => string;
  DELETE: (id: number) => string;
}

export interface NotificationsEndpoints {
  GET_ALL: string;
  MARK_AS_READ: (id: string) => string;
  MARK_ALL_AS_READ: string;
  SETTINGS: string;
}

export interface RemindersEndpoints {
  GET_ALL: string;
  GET_BY_ID: (id: number) => string;
  GET_BY_APPOINTMENT: (appointmentId: number) => string;
  GET_BY_RECEIVER: (receiverId: number) => string;
  CREATE: string;
  UPDATE: (id: number) => string;
  DELETE: (id: number) => string;
}

export interface DoctorsEndpoints {
  AVAILABILITY: (doctorId: string) => string;
}

export interface ApiEndpoints {
  AUTH: AuthEndpoints;
  USERS: UsersEndpoints;
  APPOINTMENTS: AppointmentsEndpoints;
  SPECIALTIES: SpecialtiesEndpoints;
  APPOINTMENT_TYPES: AppointmentTypesEndpoints;
  AVAILABILITY: AvailabilityEndpoints;
  PHYSICAL_LOCATIONS: PhysicalLocationsEndpoints;
  NOTIFICATIONS: NotificationsEndpoints;
  REMINDERS: RemindersEndpoints;
  DOCTORS: DoctorsEndpoints;
}

export const API_ENDPOINTS: ApiEndpoints = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  
  // Usuarios
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: (id: number) => `/users/${id}`,
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/avatar',
  },
  
  // Citas médicas
  APPOINTMENTS: {
    GET_ALL: '/appointments',
    GET_BY_PATIENT: (patientId: number) => `/appointments/patient/${patientId}`,
    GET_BY_DOCTOR: (doctorId: number) => `/appointments/doctor/${doctorId}`,
    CREATE: '/appointments',
    UPDATE: (id: number) => `/appointments/${id}`,
    FILTER: (params) => {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.status) queryParams.append('status', params.status);
      if (params.physicalLocationId) queryParams.append('physicalLocationId', params.physicalLocationId.toString());
      
      return `/appointments?${queryParams.toString()}`;
    },
    GET_UPCOMING: '/appointments/upcoming',
    GET_HISTORY: '/appointments/history',
    DETAILS: (id: string) => `/appointments/${id}`,
    CANCEL: (id: string) => `/appointments/${id}/cancel`,
    RESCHEDULE: (id: string) => `/appointments/${id}/reschedule`,
  },
  
  // Especialidades médicas
  SPECIALTIES: {
    GET_ALL: '/specialties',
    GET_BY_ID: (id: number) => `/specialties/${id}`,
    CREATE: '/specialties',
    UPDATE: (id: number) => `/specialties/${id}`,
    DELETE: (id: number) => `/specialties/${id}`,
    DETAILS: (id: string) => `/specialties/${id}`,
    DOCTORS: (specialtyId: string) => `/specialties/${specialtyId}/doctors`,
  },
  
  // Tipos de citas
  APPOINTMENT_TYPES: {
    GET_ALL: '/appointment-types',
    GET_BY_SPECIALTY: (specialtyId: number) => `/appointment-types/specialty/${specialtyId}`,
    CREATE: '/appointment-types',
    UPDATE: (id: number) => `/appointment-types/${id}`,
    DELETE: (id: number) => `/appointment-types/${id}`,
  },
  
  // Disponibilidad
  AVAILABILITY: {
    GET_ALL: '/availabilities',
    GET_BY_DOCTOR: (doctorId: number) => `/availabilities/doctor/${doctorId}`,
    GET_AVAILABLE_SLOTS: (params) => {
      const queryParams = new URLSearchParams();
      queryParams.append('doctorId', params.doctorId.toString());
      queryParams.append('appointmentTypeId', params.appointmentTypeId.toString());
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      
      return `/availabilities/slots?${queryParams.toString()}`;
    },
    CREATE: '/availabilities',
    DELETE: (id: number) => `/availabilities/${id}`,
  },
  
  // Ubicaciones físicas
  PHYSICAL_LOCATIONS: {
    GET_ALL: '/physical-locations',
    GET_BY_ID: (id: number) => `/physical-locations/${id}`,
    CREATE: '/physical-locations',
    UPDATE: (id: number) => `/physical-locations/${id}`,
    DELETE: (id: number) => `/physical-locations/${id}`,
  },
  
  // Notificaciones
  NOTIFICATIONS: {
    GET_ALL: '/notifications',
    MARK_AS_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_AS_READ: '/notifications/read-all',
    SETTINGS: '/notifications/settings',
  },
  
  // Recordatorios
  REMINDERS: {
    GET_ALL: '/reminders',
    GET_BY_ID: (id: number) => `/reminders/${id}`,
    GET_BY_APPOINTMENT: (appointmentId: number) => `/reminders/appointment/${appointmentId}`,
    GET_BY_RECEIVER: (receiverId: number) => `/reminders/receiver/${receiverId}`,
    CREATE: '/reminders',
    UPDATE: (id: number) => `/reminders/${id}`,
    DELETE: (id: number) => `/reminders/${id}`,
  },

  // Doctores
  DOCTORS: {
    AVAILABILITY: (doctorId: string) => `/doctors/${doctorId}/availability`,
  },
};

// Utilidad para construir URLs completas
export const buildUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

export default API_ENDPOINTS;