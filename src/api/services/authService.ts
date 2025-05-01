import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';

/**
 * Interfaces para los tipos de datos utilizados en autenticación
 */
export interface LoginCredentials {
  documentType: string;
  documentNumber: string;
  password: string;
}

export interface RegisterUserData {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  phone?: string;
  address?: string;
  gender: string;
  role?: string;
  defaultSchedule?: boolean;
  specialtyId?: number;
  physicalLocationId?: number;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthTokens {
  token: string;
  refreshToken?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  localAvatarUri?: string;
  [key: string]: any;
}

export interface AuthResponse extends AuthTokens {
  user?: User;
}

/**
 * Servicio para gestionar la autenticación y sesiones
 */
class AuthService {
  /**
   * Inicia sesión con tipo y número de documento
   * @param {LoginCredentials} credentials - Credenciales de inicio de sesión
   * @returns {Promise<AuthResponse>} - Datos del usuario y token
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('AuthService.login - Enviando credenciales al servidor:', JSON.stringify(credentials, null, 2));
      
      const response = await apiClient.post<AuthResponse, AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      console.log('AuthService.login - Respuesta recibida del servidor');
      
      // Guardar tokens y datos básicos del usuario en AsyncStorage
      if (response.token) {
        await AsyncStorage.setItem('@MediClinic:authToken', response.token);
        
        if (response.refreshToken) {
          await AsyncStorage.setItem('@MediClinic:refreshToken', response.refreshToken);
        }
        
        if (response.user) {
          await AsyncStorage.setItem('@MediClinic:user', JSON.stringify(response.user));
        }
      }
      
      return response;
    } catch (error) {
      console.error('AuthService.login - Error al intentar iniciar sesión:', error);
      throw error;
    }
  }
  
  /**
   * Registra un nuevo usuario
   * @param {RegisterUserData} userData - Datos del usuario
   * @returns {Promise<AuthResponse>} - Respuesta del registro
   */
  async register(userData: RegisterUserData): Promise<AuthResponse> {
    try {
      return await apiClient.post<AuthResponse, AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Solicita recuperación de contraseña
   * @param {string} email - Correo electrónico
   * @returns {Promise<{ message: string }>} - Respuesta del proceso
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      return await apiClient.post<{ message: string }, { message: string }>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD, 
        { email }
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Restablece la contraseña con el token enviado
   * @param {ResetPasswordData} resetData - Datos para restablecer
   * @returns {Promise<{ message: string }>} - Respuesta del proceso
   */
  async resetPassword(resetData: ResetPasswordData): Promise<{ message: string }> {
    try {
      return await apiClient.post<{ message: string }, { message: string }>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD, 
        resetData
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Refresca el token de autenticación
   * @returns {Promise<AuthTokens>} - Nuevo token
   */
  async refreshToken(): Promise<AuthTokens> {
    try {
      const refreshToken = await AsyncStorage.getItem('@MediClinic:refreshToken');
      
      if (!refreshToken) {
        throw new Error('No hay token de refresco disponible');
      }
      
      const response = await apiClient.post<AuthTokens, AuthTokens>(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN, 
        { refreshToken }
      );
      
      // Actualizar tokens en AsyncStorage
      if (response.token) {
        await AsyncStorage.setItem('@MediClinic:authToken', response.token);
        
        if (response.refreshToken) {
          await AsyncStorage.setItem('@MediClinic:refreshToken', response.refreshToken);
        }
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Cierra la sesión del usuario
   * @returns {Promise<void>}
   */
  async logout(): Promise<void> {
    try {
      console.log('AuthService.logout - Iniciando cierre de sesión');
      
      // Obtener todas las claves
      const allKeys = await AsyncStorage.getAllKeys();
      
      // Identificar claves relacionadas con la sesión y el perfil
      const keysToRemove = allKeys.filter(key => 
        key.startsWith('@MediClinic:') && 
        (key.includes('Token') || 
         key.includes('user') || 
         key.includes('profile'))
      );
      
      console.log('AuthService.logout - Claves a eliminar:', keysToRemove);
      
      // Limpiar datos de sesión en AsyncStorage
      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
      }
      
      // Opcionalmente, notificar al backend sobre el cierre de sesión
      // No hacemos nada con la respuesta, lo importante es limpiar localmente
      try {
        await apiClient.post('/auth/logout');
      } catch (logoutError) {
        console.warn('Error al notificar logout al servidor:', logoutError);
      }
      
      console.log('AuthService.logout - Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }
  
  /**
   * Verifica si el usuario tiene una sesión activa
   * @returns {Promise<boolean>}
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('@MediClinic:authToken');
      return !!token;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      return false;
    }
  }
  
  /**
   * Obtiene los datos del usuario actualmente logueado
   * @returns {Promise<User|null>}
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem('@MediClinic:user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  }
}

export default new AuthService(); 