import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { PaginatedResponse, ProcessedPaginatedResponse, processPaginatedResponse } from '../utils/apiUtils';

/**
 * Interfaces para los tipos de datos utilizados en disponibilidad
 */
export interface Availability {
  id: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: 'available' | 'busy' | 'unavailable';
  [key: string]: any;
}

export interface AvailabilitySlot {
  time: string; // HH:MM format
  available: boolean;
  [key: string]: any;
}

export interface AvailabilityQueryParams {
  doctorId: number;
  appointmentTypeId: number;
  startDate?: string;
  endDate?: string;
}

/**
 * Servicio para gestionar la disponibilidad de médicos
 */
class AvailabilityService {
  /**
   * Obtiene toda la disponibilidad
   * @param {Record<string, any>} params - Parámetros de consulta
   * @returns {Promise<ProcessedPaginatedResponse<Availability>>} - Lista de disponibilidad
   */
  async getAllAvailability(params: Record<string, any> = {}): Promise<ProcessedPaginatedResponse<Availability>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<Availability>>(
        API_ENDPOINTS.AVAILABILITY.GET_ALL,
        { params }
      );
      return processPaginatedResponse<Availability>(response);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene la disponibilidad por médico
   * @param {number} doctorId - ID del médico
   * @param {Record<string, any>} params - Parámetros adicionales
   * @returns {Promise<ProcessedPaginatedResponse<Availability>>} - Lista de disponibilidad del médico
   */
  async getAvailabilityByDoctor(
    doctorId: number,
    params: Record<string, any> = {}
  ): Promise<ProcessedPaginatedResponse<Availability>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<Availability>>(
        API_ENDPOINTS.AVAILABILITY.GET_BY_DOCTOR(doctorId),
        { params }
      );
      return processPaginatedResponse<Availability>(response);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene slots de tiempo disponibles
   * @param {AvailabilityQueryParams} params - Parámetros de búsqueda
   * @returns {Promise<AvailabilitySlot[]>} - Lista de slots disponibles
   */
  async getAvailableSlots(params: AvailabilityQueryParams): Promise<AvailabilitySlot[]> {
    try {
      return await apiClient.get<any, AvailabilitySlot[]>(
        API_ENDPOINTS.AVAILABILITY.GET_AVAILABLE_SLOTS(params)
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Crea una nueva disponibilidad
   * @param {Omit<Availability, 'id'>} availabilityData - Datos de disponibilidad
   * @returns {Promise<Availability>} - Disponibilidad creada
   */
  async createAvailability(availabilityData: Omit<Availability, 'id'>): Promise<Availability> {
    try {
      return await apiClient.post<Omit<Availability, 'id'>, Availability>(
        API_ENDPOINTS.AVAILABILITY.CREATE,
        availabilityData
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Elimina una disponibilidad
   * @param {number} id - ID de la disponibilidad
   * @returns {Promise<{ message: string }>} - Respuesta de confirmación
   */
  async deleteAvailability(id: number): Promise<{ message: string }> {
    try {
      return await apiClient.delete<any, { message: string }>(
        API_ENDPOINTS.AVAILABILITY.DELETE(id)
      );
    } catch (error) {
      throw error;
    }
  }
}

export default new AvailabilityService(); 