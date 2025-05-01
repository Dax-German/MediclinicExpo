import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import { API_BASE_URL, API_ENDPOINTS, buildUrl } from './endpoints';

// Creación de la instancia personalizada de Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Tipo para errores de la API
export interface ApiError {
  status: number;
  message: string;
  data?: any;
}

// Constantes para claves de almacenamiento
const AUTH_TOKEN_KEY = '@MediClinic:authToken';
const REFRESH_TOKEN_KEY = '@MediClinic:refreshToken';

// Interceptor para añadir token de autenticación a las peticiones
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log de depuración para peticiones
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data
      });
    } catch (error) {
      console.error('Error al obtener token de autenticación:', error);
    }
    return config;
  },
  (error: AxiosError): Promise<never> => {
    console.error('Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Función para refrescar el token
const refreshAuthToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return null;
    }

    // Hacer la petición para refrescar el token sin usar los interceptores
    const response = await axios.post(
      buildUrl(API_ENDPOINTS.AUTH.REFRESH_TOKEN),
      { refreshToken },
      {
        baseURL: API_BASE_URL,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    const { token, refreshToken: newRefreshToken } = response.data;

    // Guardar los nuevos tokens
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

    return token;
  } catch (error) {
    console.error('Error al refrescar el token:', error);
    // Limpiar los tokens almacenados si hay un error
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    return null;
  }
};

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response: AxiosResponse): any => {
    return response.data;
  },
  async (error: AxiosError): Promise<any> => {
    // Verificar si hay respuesta del servidor
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response) {
      // El servidor respondió con un código de estado que cae fuera del rango de 2xx
      const status = error.response.status;
      const data = error.response.data as any;
      
      console.log('apiClient - Error de respuesta:', {
        status,
        url: originalRequest.url,
        method: originalRequest.method,
        data: data,
        headers: originalRequest.headers
      });
      
      // Si el token ha expirado (401), intentar refrescar token
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const newToken = await refreshAuthToken();
          
          if (newToken) {
            // Actualizar el token en la petición original
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            // Reintentar la petición original con el nuevo token
            return axios(originalRequest);
          } else {
            // Redirigir a login (implementar manejo según la arquitectura de la app)
            // Por ejemplo, a través de un evento global o un contexto
            console.warn('Sesión expirada. Redirigiendo a login...');
            // Aquí puedes emitir un evento global o usar un contexto para redirigir
          }
        } catch (refreshError) {
          console.error('Error al refrescar token:', refreshError);
        }
      }
      
      const apiError: ApiError = {
        status,
        message: data?.message || 'Error en la petición',
        data: data
      };
      
      return Promise.reject(apiError);
    }
    
    if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
      const apiError: ApiError = {
        status: 0,
        message: 'Error de conexión. No se pudo conectar con el servidor.'
      };
      return Promise.reject(apiError);
    }
    
    // Error al configurar la petición
    console.error('Error al configurar la petición:', error.message);
    const apiError: ApiError = {
      status: 0,
      message: 'Error al realizar la petición: ' + error.message
    };
    return Promise.reject(apiError);
  }
);

// Función para gestionar el cierre de sesión
export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    // Aquí puedes añadir cualquier otra lógica necesaria para el cierre de sesión
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};

export default apiClient; 