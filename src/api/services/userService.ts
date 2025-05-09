import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { formatRequestData, PaginatedResponse, ProcessedPaginatedResponse, processPaginatedResponse } from '../utils/apiUtils';
import { Specialty } from './appointmentService';
import { User } from './authService';

/**
 * Interfaces para los tipos de datos utilizados en el servicio de usuarios
 */
export interface ProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  [key: string]: any;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ImageData {
  uri: string;
  type?: string;
  name?: string;
}

export interface AvatarResponse {
  avatarUrl: string;
  message?: string;
}

export interface UserFilter {
  role?: 'patient' | 'doctor' | 'admin';
  specialtyId?: string;
  name?: string;
  isActive?: boolean;
}

export interface DoctorProfile extends User {
  specialty?: Specialty;
  specialtyId?: string;
  rating?: number;
  appointmentsCompleted?: number;
  reviews?: any[];
}

/**
 * Servicio para gestionar el perfil y datos del usuario
 */
class UserService {
  /**
   * Obtiene todos los usuarios
   * @param {Record<string, any>} params - Parámetros para filtrar
   * @returns {Promise<ProcessedPaginatedResponse<User>>} - Lista de usuarios
   */
  async getAllUsers(params: Record<string, any> = {}): Promise<ProcessedPaginatedResponse<User>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<User>>(
        API_ENDPOINTS.USERS.GET_ALL,
        { params }
      );
      return processPaginatedResponse<User>(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene un usuario por su ID
   * @param {number} userId - ID del usuario
   * @returns {Promise<User>} - Datos del usuario
   */
  async getUserById(userId: number): Promise<User> {
    try {
      return await apiClient.get<any, User>(API_ENDPOINTS.USERS.GET_BY_ID(userId));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene doctores por especialidad
   * @param {number} specialtyId - ID de la especialidad
   * @returns {Promise<User[]>} - Lista de doctores
   */
  async getDoctorsBySpecialty(specialtyId: number): Promise<User[]> {
    try {
      return await apiClient.get<any, User[]>(
        API_ENDPOINTS.USERS.GET_BY_SPECIALTY(specialtyId)
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene el perfil completo del usuario
   * @returns {Promise<User>} - Datos del perfil
   */
  async getProfile(): Promise<User> {
    try {
      return await apiClient.get<User, User>(API_ENDPOINTS.USERS.PROFILE);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Actualiza el perfil del usuario
   * @param {ProfileData} profileData - Datos a actualizar
   * @returns {Promise<User>} - Perfil actualizado
   */
  async updateProfile(profileData: ProfileData): Promise<User> {
    try {
      // Formatea los datos para eliminar campos vacíos o nulos
      const formattedData = formatRequestData(profileData);
      
      const response = await apiClient.put<ProfileData, User>(
        API_ENDPOINTS.USERS.UPDATE_PROFILE, 
        formattedData
      );
      
      // Actualizar datos locales
      if (response) {
        const currentUserData = await AsyncStorage.getItem('@MediClinic:user');
        if (currentUserData) {
          const userData = JSON.parse(currentUserData) as User;
          const updatedUserData = { ...userData, ...response };
          await AsyncStorage.setItem('@MediClinic:user', JSON.stringify(updatedUserData));
        }
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Cambia la contraseña del usuario
   * @param {PasswordData} passwordData - Datos de contraseña
   * @returns {Promise<{ message: string }>} - Respuesta de la operación
   */
  async changePassword(passwordData: PasswordData): Promise<{ message: string }> {
    try {
      return await apiClient.post<PasswordData, { message: string }>(
        API_ENDPOINTS.USERS.CHANGE_PASSWORD,
        passwordData
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Sube una imagen de perfil
   * @param {ImageData | FormData} imageData - Datos de la imagen o FormData
   * @returns {Promise<AvatarResponse>} - Respuesta con URL de la imagen
   */
  async uploadAvatar(imageData: ImageData | FormData): Promise<AvatarResponse> {
    try {
      let formData: FormData;
      
      if (!(imageData instanceof FormData)) {
        // Crear FormData para envío de archivo
        formData = new FormData();
        formData.append('avatar', {
          uri: imageData.uri,
          type: imageData.type || 'image/jpeg',
          name: imageData.name || 'profile.jpg',
        } as any);
      } else {
        formData = imageData;
      }
      
      // Configuración especial para la solicitud con FormData
      const response = await apiClient.post<FormData, AvatarResponse>(
        API_ENDPOINTS.USERS.UPLOAD_AVATAR, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Actualizar datos locales
      if (response && response.avatarUrl) {
        const currentUserData = await AsyncStorage.getItem('@MediClinic:user');
        if (currentUserData) {
          const userData = JSON.parse(currentUserData) as User;
          userData.avatarUrl = response.avatarUrl;
          await AsyncStorage.setItem('@MediClinic:user', JSON.stringify(userData));
        }
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Almacena la imagen de perfil localmente
   * @param {string} imageUri - URI de la imagen
   * @returns {Promise<void>}
   */
  async saveLocalAvatar(imageUri: string): Promise<void> {
    try {
      await AsyncStorage.setItem('@MediClinic:profileImage', imageUri);
      
      // Actualizar en datos de usuario si existen
      const currentUserData = await AsyncStorage.getItem('@MediClinic:user');
      if (currentUserData) {
        const userData = JSON.parse(currentUserData) as User;
        userData.localAvatarUri = imageUri;
        await AsyncStorage.setItem('@MediClinic:user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error al guardar imagen local:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene la imagen de perfil almacenada localmente
   * @returns {Promise<string|null>} - URI de la imagen
   */
  async getLocalAvatar(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('@MediClinic:profileImage');
    } catch (error) {
      console.error('Error al obtener imagen local:', error);
      return null;
    }
  }
}

export default new UserService(); 