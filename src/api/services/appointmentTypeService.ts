import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { ApiError, PaginatedResponse, ProcessedPaginatedResponse, processPaginatedResponse } from '../utils/apiUtils';
import { Specialty } from './appointmentService';

/**
 * Interfaces para los tipos de datos utilizados en tipos de citas
 */
export interface AppointmentType {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number; // en minutos
  price?: number;
  specialtyId: string;
  specialty?: Specialty;
  isGeneral?: boolean;
  isActive?: boolean;
  [key: string]: any;
}

/**
 * Servicio para gestionar los tipos de citas médicas
 */
class AppointmentTypeService {
  /**
   * Obtiene todos los tipos de citas
   * @param {Record<string, any>} params - Parámetros de consulta
   * @returns {Promise<ProcessedPaginatedResponse<AppointmentType>>} - Lista de tipos de citas
   */
  async getAllAppointmentTypes(params: Record<string, any> = {}): Promise<ProcessedPaginatedResponse<AppointmentType>> {
    try {
      // Validar parámetros de consulta si existen
      if (params.page && (isNaN(params.page) || params.page < 1)) {
        throw {
          status: 400,
          message: 'El número de página debe ser un valor numérico mayor a 0'
        } as ApiError;
      }
      
      if (params.limit && (isNaN(params.limit) || params.limit < 1)) {
        throw {
          status: 400,
          message: 'El límite de resultados debe ser un valor numérico mayor a 0'
        } as ApiError;
      }
      
      const response = await apiClient.get<any, PaginatedResponse<AppointmentType>>(
        API_ENDPOINTS.APPOINTMENT_TYPES.GET_ALL,
        { params }
      );
      
      // Validar respuesta
      if (!response || !response.data) {
        throw {
          status: 404,
          message: 'No se encontraron tipos de cita'
        } as ApiError;
      }
      
      return processPaginatedResponse<AppointmentType>(response);
    } catch (error: any) {
      console.error('Error en getAllAppointmentTypes:', error);
      
      // Personalizar mensajes de error
      if (error.status === 401) {
        throw {
          status: 401,
          message: 'No tiene autorización para acceder a los tipos de cita'
        } as ApiError;
      } else if (error.status === 404) {
        throw {
          status: 404,
          message: 'No se encontraron tipos de cita'
        } as ApiError;
      } else if (error.status >= 500) {
        throw {
          status: error.status,
          message: 'Error del servidor al obtener tipos de cita'
        } as ApiError;
      }
      
      throw error;
    }
  }
  
  /**
   * Obtiene tipos de citas por especialidad
   * @param {string} specialtyId - ID de la especialidad
   * @param {Record<string, any>} params - Parámetros adicionales
   * @returns {Promise<ProcessedPaginatedResponse<AppointmentType>>} - Lista filtrada de tipos de citas
   */
  async getAppointmentTypesBySpecialty(
    specialtyId: string,
    params: Record<string, any> = {}
  ): Promise<ProcessedPaginatedResponse<AppointmentType>> {
    try {
      // Validar ID de especialidad
      if (!specialtyId || specialtyId.trim() === '') {
        throw {
          status: 400,
          message: 'Se requiere un ID de especialidad válido'
        } as ApiError;
      }
      
      const response = await apiClient.get<any, PaginatedResponse<AppointmentType>>(
        API_ENDPOINTS.APPOINTMENT_TYPES.GET_BY_SPECIALTY(specialtyId),
        { params }
      );
      
      // Validar respuesta
      if (!response || !response.data) {
        throw {
          status: 404,
          message: `No se encontraron tipos de cita para la especialidad con ID ${specialtyId}`
        } as ApiError;
      }
      
      return processPaginatedResponse<AppointmentType>(response);
    } catch (error: any) {
      console.error(`Error en getAppointmentTypesBySpecialty para especialidad ${specialtyId}:`, error);
      
      // Personalizar mensajes de error
      if (error.status === 400) {
        throw {
          status: 400,
          message: 'ID de especialidad no válido'
        } as ApiError;
      } else if (error.status === 404) {
        throw {
          status: 404,
          message: `No se encontraron tipos de cita para la especialidad seleccionada`
        } as ApiError;
      } else if (error.status >= 500) {
        throw {
          status: error.status,
          message: 'Error del servidor al obtener tipos de cita'
        } as ApiError;
      }
      
      throw error;
    }
  }
  
  /**
   * Obtiene un tipo de cita específico por su ID
   * @param {string} id - ID del tipo de cita
   * @returns {Promise<AppointmentType>} - Detalles del tipo de cita
   */
  async getAppointmentTypeById(id: string): Promise<AppointmentType> {
    try {
      // Validar ID
      if (!id || id.trim() === '') {
        throw {
          status: 400,
          message: 'Se requiere un ID de tipo de cita válido'
        } as ApiError;
      }
      
      const response = await apiClient.get<any, AppointmentType>(`/appointment-types/${id}`);
      
      // Validar respuesta
      if (!response) {
        throw {
          status: 404,
          message: `No se encontró el tipo de cita con ID ${id}`
        } as ApiError;
      }
      
      return response;
    } catch (error: any) {
      console.error(`Error en getAppointmentTypeById para ID ${id}:`, error);
      
      // Personalizar mensajes de error
      if (error.status === 400) {
        throw {
          status: 400,
          message: 'ID de tipo de cita no válido'
        } as ApiError;
      } else if (error.status === 404) {
        throw {
          status: 404,
          message: `No se encontró el tipo de cita solicitado`
        } as ApiError;
      } else if (error.status >= 500) {
        throw {
          status: error.status,
          message: 'Error del servidor al obtener el tipo de cita'
        } as ApiError;
      }
      
      throw error;
    }
  }
  
  /**
   * Crea un nuevo tipo de cita
   * @param {AppointmentType} appointmentTypeData - Datos del tipo de cita
   * @returns {Promise<AppointmentType>} - Tipo de cita creado
   */
  async createAppointmentType(appointmentTypeData: Omit<AppointmentType, 'id'>): Promise<AppointmentType> {
    try {
      return await apiClient.post<Omit<AppointmentType, 'id'>, AppointmentType>(
        API_ENDPOINTS.APPOINTMENT_TYPES.CREATE,
        appointmentTypeData
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Actualiza un tipo de cita existente
   * @param {string} id - ID del tipo de cita
   * @param {Partial<AppointmentType>} appointmentTypeData - Datos a actualizar
   * @returns {Promise<AppointmentType>} - Tipo de cita actualizado
   */
  async updateAppointmentType(
    id: string,
    appointmentTypeData: Partial<AppointmentType>
  ): Promise<AppointmentType> {
    try {
      return await apiClient.put<Partial<AppointmentType>, AppointmentType>(
        API_ENDPOINTS.APPOINTMENT_TYPES.UPDATE(id),
        appointmentTypeData
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Elimina un tipo de cita
   * @param {string} id - ID del tipo de cita
   * @returns {Promise<{ message: string }>} - Respuesta de confirmación
   */
  async deleteAppointmentType(id: string): Promise<{ message: string }> {
    try {
      return await apiClient.delete<any, { message: string }>(
        API_ENDPOINTS.APPOINTMENT_TYPES.DELETE(id)
      );
    } catch (error) {
      throw error;
    }
  }
}

export default new AppointmentTypeService(); 