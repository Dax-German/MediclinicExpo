import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig
} from 'axios';

// URL base de la API
const BASE_URL: string = 'https://mediclinic-api.com/api/v1';

// Creación de la instancia personalizada de Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Tipo para errores de la API
interface ApiError {
  status: number;
  message: string;
  data?: any;
}

// Interceptor para añadir token de autenticación a las peticiones
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const token = await AsyncStorage.getItem('@MediClinic:authToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error al obtener token de autenticación:', error);
    }
    return config;
  },
  (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response: AxiosResponse): any => {
    return response.data;
  },
  async (error: AxiosError): Promise<never> => {
    // Verificar si hay respuesta del servidor
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response) {
      // El servidor respondió con un código de estado que cae fuera del rango de 2xx
      const status = error.response.status;
      const data = error.response.data as any;
      
      // Si el token ha expirado (401), intentar refrescar token
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Implementar lógica para refrescar token si existe
          const refreshToken = await AsyncStorage.getItem('@MediClinic:refreshToken');
          if (refreshToken) {
            // Aquí iría la lógica para obtener un nuevo token
            // ...
            
            // Reintentar la petición original con el nuevo token
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('Error al refrescar token:', refreshError);
          // Redirigir a login
          // Esto podría mejorarse usando un evento global o un contexto
        }
      }
      
      return Promise.reject({
        status,
        message: data?.message || 'Error en la petición',
        data: data
      } as ApiError);
    }
    
    if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
      return Promise.reject({
        status: 0,
        message: 'Error de conexión. No se pudo conectar con el servidor.'
      } as ApiError);
    }
    
    // Error al configurar la petición
    console.error('Error al configurar la petición:', error.message);
    return Promise.reject({
      status: 0,
      message: 'Error al realizar la petición: ' + error.message
    } as ApiError);
  }
);

export default apiClient; 