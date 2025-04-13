/**
 * Configuración de la API para la aplicación MediClinic
 */

// URL base para las peticiones a la API
export const API_URL = 'https://api.mediclinic.com';

// Tiempo de espera para las peticiones en milisegundos (10 segundos)
export const API_TIMEOUT = 10000;

// Cabeceras comunes para todas las peticiones
export const API_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Usuarios
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
  },
  
  // Especialidades
  SPECIALTIES: {
    LIST: '/specialties',
    DETAIL: (id: string) => `/specialties/${id}`,
  },
  
  // Médicos
  DOCTORS: {
    LIST: '/doctors',
    DETAIL: (id: string) => `/doctors/${id}`,
    BY_SPECIALTY: (specialtyId: string) => `/specialties/${specialtyId}/doctors`,
  },
  
  // Citas
  APPOINTMENTS: {
    LIST: '/appointments',
    DETAIL: (id: string) => `/appointments/${id}`,
    CREATE: '/appointments',
    UPDATE: (id: string) => `/appointments/${id}`,
    CANCEL: (id: string) => `/appointments/${id}/cancel`,
  },
  
  // Alertas
  ALERTS: {
    LIST: '/alerts',
    MARK_READ: (id: string) => `/alerts/${id}/read`,
    MARK_ALL_READ: '/alerts/read-all',
  },
};

// Configuración para peticiones fetch
export const fetchConfig = (token?: string) => {
  const headers = {
    ...API_HEADERS,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
  
  return {
    headers,
    timeout: API_TIMEOUT,
  };
};

// Controlador de errores para peticiones a la API
export const handleApiError = (error: any) => {
  if (error.response) {
    // La petición se realizó y el servidor respondió con un código de estado
    // que no está en el rango 2xx
    return {
      status: error.response.status,
      message: error.response.data.message || 'Error en la petición',
      data: error.response.data,
    };
  } else if (error.request) {
    // La petición se realizó pero no se recibió respuesta
    return {
      status: 0,
      message: 'No se pudo conectar con el servidor',
      data: null,
    };
  } else {
    // Algo sucedió al configurar la petición que desencadenó un error
    return {
      status: 0,
      message: error.message || 'Error desconocido',
      data: null,
    };
  }
}; 