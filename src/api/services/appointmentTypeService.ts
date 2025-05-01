import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { PaginatedResponse, ProcessedPaginatedResponse, processPaginatedResponse } from '../utils/apiUtils';
import { Specialty } from './appointmentService';

/**
 * Interfaces para los tipos de datos utilizados en tipos de citas
 */
export interface AppointmentType {
  id: string;
  name: string;
  description?: string;
  duration: number; // en minutos
  price?: number;
  specialtyId: string;
  specialty?: Specialty;
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
      const response = await apiClient.get<any, PaginatedResponse<AppointmentType>>(
        API_ENDPOINTS.APPOINTMENT_TYPES.GET_ALL,
        { params }
      );
      return processPaginatedResponse<AppointmentType>(response);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene tipos de citas por especialidad
   * @param {number} specialtyId - ID de la especialidad
   * @param {Record<string, any>} params - Parámetros adicionales
   * @returns {Promise<ProcessedPaginatedResponse<AppointmentType>>} - Lista filtrada de tipos de citas
   */
  async getAppointmentTypesBySpecialty(
    specialtyId: number,
    params: Record<string, any> = {}
  ): Promise<ProcessedPaginatedResponse<AppointmentType>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<AppointmentType>>(
        API_ENDPOINTS.APPOINTMENT_TYPES.GET_BY_SPECIALTY(specialtyId),
        { params }
      );
      return processPaginatedResponse<AppointmentType>(response);
    } catch (error) {
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
   * @param {number} id - ID del tipo de cita
   * @param {Partial<AppointmentType>} appointmentTypeData - Datos a actualizar
   * @returns {Promise<AppointmentType>} - Tipo de cita actualizado
   */
  async updateAppointmentType(
    id: number,
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
   * @param {number} id - ID del tipo de cita
   * @returns {Promise<{ message: string }>} - Respuesta de confirmación
   */
  async deleteAppointmentType(id: number): Promise<{ message: string }> {
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