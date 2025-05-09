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
  date: string;
  time: string;
  isAvailable: boolean;
}

export interface DoctorAvailability {
  id: string;
  doctorId: string;
  day: string; // Monday, Tuesday, etc.
  startTime: string;
  endTime: string;
}

export interface AvailabilityCreateData {
  doctorId: string;
  day: string;
  startTime: string;
  endTime: string;
  recurrence?: 'weekly' | 'biweekly' | 'monthly';
}

export interface GetSlotsParams {
  doctorId: string | number;
  appointmentTypeId: string | number;
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
   * @returns {Promise<ProcessedPaginatedResponse<DoctorAvailability>>} - Lista de disponibilidad
   */
  async getAvailabilities(params: Record<string, any> = {}): Promise<ProcessedPaginatedResponse<DoctorAvailability>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<DoctorAvailability>>(
        API_ENDPOINTS.AVAILABILITY.GET_ALL,
        { params }
      );
      return processPaginatedResponse<DoctorAvailability>(response);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene la disponibilidad por médico
   * @param {number} doctorId - ID del médico
   * @returns {Promise<DoctorAvailability[]>} - Lista de disponibilidad del médico
   */
  async getDoctorAvailability(doctorId: number): Promise<DoctorAvailability[]> {
    try {
      return await apiClient.get<any, DoctorAvailability[]>(
        API_ENDPOINTS.AVAILABILITY.GET_BY_DOCTOR(doctorId)
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene slots de tiempo disponibles
   * @param {GetSlotsParams} params - Parámetros de búsqueda
   * @returns {Promise<AvailabilitySlot[]>} - Lista de slots disponibles
   */
  async getAvailableSlots(params: GetSlotsParams): Promise<AvailabilitySlot[]> {
    try {
      // Convertimos los IDs a string por si acaso vienen como number
      const queryParams = {
        doctorId: params.doctorId.toString(),
        appointmentTypeId: params.appointmentTypeId.toString(),
        startDate: params.startDate,
        endDate: params.endDate
      };

      return await apiClient.get<any, AvailabilitySlot[]>(
        '/availabilities/slots',
        { params: queryParams }
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Crea una nueva disponibilidad
   * @param {AvailabilityCreateData} data - Datos de disponibilidad
   * @returns {Promise<DoctorAvailability>} - Disponibilidad creada
   */
  async createAvailability(data: AvailabilityCreateData): Promise<DoctorAvailability> {
    try {
      return await apiClient.post<AvailabilityCreateData, DoctorAvailability>(
        API_ENDPOINTS.AVAILABILITY.CREATE,
        data
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Elimina una disponibilidad
   * @param {number} id - ID de la disponibilidad
   * @returns {Promise<void>} - Respuesta de confirmación
   */
  async deleteAvailability(id: number): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.AVAILABILITY.DELETE(id));
    } catch (error) {
      throw error;
    }
  }
}

export default new AvailabilityService(); 