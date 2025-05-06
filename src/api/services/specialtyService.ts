import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { ApiError, PaginatedResponse, ProcessedPaginatedResponse, processPaginatedResponse } from '../utils/apiUtils';
import { Doctor, Specialty } from './appointmentService';
import { AppointmentType } from './appointmentTypeService';

/**
 * Servicio para gestionar las especialidades médicas
 */
class SpecialtyService {
  /**
   * Obtiene todas las especialidades médicas
   * @param {Record<string, any>} params - Parámetros de consulta (filtros, paginación)
   * @returns {Promise<ProcessedPaginatedResponse<Specialty>>} - Lista de especialidades y metadata
   */
  async getAllSpecialties(params: Record<string, any> = {}): Promise<ProcessedPaginatedResponse<Specialty>> {
    try {
      // Validar parámetros de consulta
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
      
      const response = await apiClient.get<any, PaginatedResponse<Specialty>>(
        API_ENDPOINTS.SPECIALTIES.GET_ALL, 
        { params }
      );
      
      // Validar la respuesta
      if (!response || !response.data) {
        throw {
          status: 404,
          message: 'No se encontraron especialidades médicas'
        } as ApiError;
      }
      
      return processPaginatedResponse<Specialty>(response);
    } catch (error: any) {
      console.error('Error en getAllSpecialties:', error);
      
      // Personalizar mensajes de error basados en los códigos HTTP
      if (error.status === 401) {
        throw {
          status: 401,
          message: 'No tiene autorización para acceder a las especialidades médicas'
        } as ApiError;
      } else if (error.status === 403) {
        throw {
          status: 403,
          message: 'No tiene permisos suficientes para ver las especialidades médicas'
        } as ApiError;
      } else if (error.status === 404) {
        throw {
          status: 404,
          message: 'No se encontraron especialidades médicas'
        } as ApiError;
      } else if (error.status >= 500) {
        throw {
          status: error.status,
          message: 'Error del servidor al obtener especialidades médicas'
        } as ApiError;
      }
      
      // Si es un error diferente, usamos el mensaje original
      throw error;
    }
  }
  
  /**
   * Obtiene el detalle de una especialidad médica
   * @param {string} specialtyId - ID de la especialidad
   * @returns {Promise<Specialty>} - Detalles de la especialidad
   */
  async getSpecialtyDetails(specialtyId: string): Promise<Specialty> {
    try {
      // Validar ID de la especialidad
      if (!specialtyId || specialtyId.trim() === '') {
        throw {
          status: 400,
          message: 'El ID de la especialidad es requerido'
        } as ApiError;
      }
      
      const response = await apiClient.get<any, Specialty>(API_ENDPOINTS.SPECIALTIES.DETAILS(specialtyId));
      
      // Validar respuesta
      if (!response) {
        throw {
          status: 404,
          message: `No se encontró la especialidad con ID ${specialtyId}`
        } as ApiError;
      }
      
      return response;
    } catch (error: any) {
      console.error(`Error en getSpecialtyDetails para ID ${specialtyId}:`, error);
      
      // Personalizar mensajes de error
      if (error.status === 400) {
        throw {
          status: 400,
          message: 'Identificador de especialidad no válido'
        } as ApiError;
      } else if (error.status === 404) {
        throw {
          status: 404,
          message: `No se encontró la especialidad con ID ${specialtyId}`
        } as ApiError;
      } else if (error.status === 401) {
        throw {
          status: 401,
          message: 'No tiene autorización para ver los detalles de esta especialidad'
        } as ApiError;
      } else if (error.status >= 500) {
        throw {
          status: error.status,
          message: 'Error del servidor al obtener detalles de la especialidad'
        } as ApiError;
      }
      
      throw error;
    }
  }
  
  /**
   * Obtiene los médicos de una especialidad específica
   * @param {string} specialtyId - ID de la especialidad
   * @param {Record<string, any>} params - Parámetros adicionales (filtros, paginación)
   * @returns {Promise<ProcessedPaginatedResponse<Doctor>>} - Lista de médicos y metadata
   */
  async getDoctorsBySpecialty(
    specialtyId: string, 
    params: Record<string, any> = {}
  ): Promise<ProcessedPaginatedResponse<Doctor>> {
    try {
      // Validar ID de la especialidad
      if (!specialtyId || specialtyId.trim() === '') {
        throw {
          status: 400,
          message: 'El ID de la especialidad es requerido'
        } as ApiError;
      }
      
      const response = await apiClient.get<any, PaginatedResponse<Doctor>>(
        API_ENDPOINTS.SPECIALTIES.DOCTORS(specialtyId),
        { params }
      );
      
      // Validar respuesta
      if (!response || !response.data) {
        throw {
          status: 404,
          message: `No se encontraron médicos para la especialidad con ID ${specialtyId}`
        } as ApiError;
      }
      
      return processPaginatedResponse<Doctor>(response);
    } catch (error: any) {
      console.error(`Error en getDoctorsBySpecialty para especialidad ${specialtyId}:`, error);
      
      // Personalizar mensajes de error
      if (error.status === 400) {
        throw {
          status: 400,
          message: 'Identificador de especialidad no válido'
        } as ApiError;
      } else if (error.status === 404) {
        throw {
          status: 404,
          message: `No se encontraron médicos para la especialidad con ID ${specialtyId}`
        } as ApiError;
      } else if (error.status >= 500) {
        throw {
          status: error.status,
          message: 'Error del servidor al obtener médicos de la especialidad'
        } as ApiError;
      }
      
      throw error;
    }
  }
  
  /**
   * Busca especialidades por nombre
   * @param {string} query - Texto a buscar
   * @param {Record<string, any>} params - Parámetros adicionales
   * @returns {Promise<ProcessedPaginatedResponse<Specialty>>} - Resultados de la búsqueda
   */
  async searchSpecialties(
    query: string, 
    params: Record<string, any> = {}
  ): Promise<ProcessedPaginatedResponse<Specialty>> {
    try {
      // Validar consulta de búsqueda
      if (!query || query.trim() === '') {
        throw {
          status: 400,
          message: 'Se requiere un texto para realizar la búsqueda'
        } as ApiError;
      }
      
      const response = await apiClient.get<any, PaginatedResponse<Specialty>>(
        API_ENDPOINTS.SPECIALTIES.GET_ALL, 
        { params: { ...params, search: query } }
      );
      
      return processPaginatedResponse<Specialty>(response);
    } catch (error: any) {
      console.error(`Error en searchSpecialties para consulta "${query}":`, error);
      
      // Personalizar mensajes de error
      if (error.status === 400) {
        throw {
          status: 400,
          message: 'Consulta de búsqueda no válida'
        } as ApiError;
      } else if (error.status >= 500) {
        throw {
          status: error.status,
          message: 'Error del servidor al buscar especialidades'
        } as ApiError;
      }
      
      throw error;
    }
  }
  
  /**
   * Obtiene las especialidades populares o destacadas
   * @param {Record<string, any>} params - Parámetros adicionales
   * @returns {Promise<ProcessedPaginatedResponse<Specialty>>} - Lista de especialidades destacadas
   */
  async getFeaturedSpecialties(
    params: Record<string, any> = {}
  ): Promise<ProcessedPaginatedResponse<Specialty>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<Specialty>>(
        API_ENDPOINTS.SPECIALTIES.GET_ALL, 
        { params: { ...params, featured: true } }
      );
      
      // Validar respuesta
      if (!response || !response.data) {
        throw {
          status: 404,
          message: 'No se encontraron especialidades destacadas'
        } as ApiError;
      }
      
      return processPaginatedResponse<Specialty>(response);
    } catch (error: any) {
      console.error('Error en getFeaturedSpecialties:', error);
      
      // Personalizar mensajes de error
      if (error.status === 404) {
        throw {
          status: 404,
          message: 'No se encontraron especialidades destacadas'
        } as ApiError;
      } else if (error.status >= 500) {
        throw {
          status: error.status,
          message: 'Error del servidor al obtener especialidades destacadas'
        } as ApiError;
      }
      
      throw error;
    }
  }
  
  /**
   * Obtiene información sobre los tipos de cita disponibles para una especialidad
   * @param {string} specialtyId - ID de la especialidad
   * @returns {Promise<AppointmentType[]>} - Tipos de cita disponibles
   */
  async getAppointmentTypes(specialtyId: string): Promise<AppointmentType[]> {
    try {
      // Validar ID de la especialidad
      if (!specialtyId || specialtyId.trim() === '') {
        throw {
          status: 400,
          message: 'El ID de la especialidad es requerido'
        } as ApiError;
      }
      
      const response = await apiClient.get<any, AppointmentType[]>(`/specialties/${specialtyId}/appointment-types`);
      
      // Validar respuesta
      if (!response || response.length === 0) {
        return []; // Devolver lista vacía si no hay tipos de cita
      }
      
      return response;
    } catch (error: any) {
      console.error(`Error en getAppointmentTypes para especialidad ${specialtyId}:`, error);
      
      // Personalizar mensajes de error
      if (error.status === 400) {
        throw {
          status: 400,
          message: 'Identificador de especialidad no válido'
        } as ApiError;
      } else if (error.status === 404) {
        // En lugar de lanzar error, devolver lista vacía
        return [];
      } else if (error.status >= 500) {
        throw {
          status: error.status,
          message: 'Error del servidor al obtener tipos de cita'
        } as ApiError;
      }
      
      throw error;
    }
  }
}

export default new SpecialtyService(); 