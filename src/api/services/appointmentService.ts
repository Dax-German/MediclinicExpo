import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { PaginatedResponse, ProcessedPaginatedResponse, processPaginatedResponse } from '../utils/apiUtils';

/**
 * Interfaces para los tipos de datos de citas médicas
 */
export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialtyId: string;
  specialty?: Specialty;
  avatarUrl?: string;
  rating?: number;
  [key: string]: any;
}

export interface Specialty {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  [key: string]: any;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  specialtyId: string;
  date: string; // ISO date string
  status: AppointmentStatus;
  notes?: string;
  reason?: string;
  doctor?: Doctor;
  specialty?: Specialty;
  [key: string]: any;
}

export interface AppointmentCreateData {
  doctorId: string;
  specialtyId: string;
  date: string;
  notes?: string;
  reason?: string;
  [key: string]: any;
}

export interface AppointmentRescheduleData {
  date: string;
  reason?: string;
}

export interface AvailabilityParams {
  doctorId: string;
  date: string; // YYYY-MM-DD
}

/**
 * Servicio para gestionar las citas médicas
 */
class AppointmentService {
  /**
   * Obtiene todas las citas médicas del usuario
   * @param {Record<string, any>} params - Parámetros de paginación y filtros
   * @returns {Promise<ProcessedPaginatedResponse<Appointment>>} - Lista de citas y metadata
   */
  async getAllAppointments(params: Record<string, any> = {}): Promise<ProcessedPaginatedResponse<Appointment>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<Appointment>>(
        API_ENDPOINTS.APPOINTMENTS.GET_ALL, 
        { params }
      );
      return processPaginatedResponse<Appointment>(response);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene las citas próximas del usuario
   * @param {Record<string, any>} params - Parámetros de paginación y filtros
   * @returns {Promise<ProcessedPaginatedResponse<Appointment>>} - Lista de citas próximas
   */
  async getUpcomingAppointments(params: Record<string, any> = {}): Promise<ProcessedPaginatedResponse<Appointment>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<Appointment>>(
        API_ENDPOINTS.APPOINTMENTS.GET_UPCOMING, 
        { params }
      );
      return processPaginatedResponse<Appointment>(response);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene el historial de citas del usuario
   * @param {Record<string, any>} params - Parámetros de paginación y filtros
   * @returns {Promise<ProcessedPaginatedResponse<Appointment>>} - Historial de citas
   */
  async getAppointmentHistory(params: Record<string, any> = {}): Promise<ProcessedPaginatedResponse<Appointment>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<Appointment>>(
        API_ENDPOINTS.APPOINTMENTS.GET_HISTORY, 
        { params }
      );
      return processPaginatedResponse<Appointment>(response);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene los detalles de una cita específica
   * @param {string} appointmentId - ID de la cita
   * @returns {Promise<Appointment>} - Detalles de la cita
   */
  async getAppointmentDetails(appointmentId: string): Promise<Appointment> {
    try {
      return await apiClient.get<any, Appointment>(API_ENDPOINTS.APPOINTMENTS.DETAILS(appointmentId));
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Crea una nueva cita médica
   * @param {AppointmentCreateData} appointmentData - Datos de la cita
   * @returns {Promise<Appointment>} - Cita creada
   */
  async createAppointment(appointmentData: AppointmentCreateData): Promise<Appointment> {
    try {
      return await apiClient.post<AppointmentCreateData, Appointment>(
        API_ENDPOINTS.APPOINTMENTS.CREATE, 
        appointmentData
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Cancela una cita médica
   * @param {string} appointmentId - ID de la cita
   * @param {Record<string, any>} cancellationData - Datos de cancelación (motivo, etc.)
   * @returns {Promise<{ message: string }>} - Respuesta de la cancelación
   */
  async cancelAppointment(
    appointmentId: string, 
    cancellationData: Record<string, any> = {}
  ): Promise<{ message: string }> {
    try {
      return await apiClient.post<Record<string, any>, { message: string }>(
        API_ENDPOINTS.APPOINTMENTS.CANCEL(appointmentId),
        cancellationData
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Reprograma una cita existente
   * @param {string} appointmentId - ID de la cita
   * @param {AppointmentRescheduleData} rescheduleData - Datos de reprogramación
   * @returns {Promise<Appointment>} - Cita reprogramada
   */
  async rescheduleAppointment(
    appointmentId: string, 
    rescheduleData: AppointmentRescheduleData
  ): Promise<Appointment> {
    try {
      return await apiClient.post<AppointmentRescheduleData, Appointment>(
        API_ENDPOINTS.APPOINTMENTS.RESCHEDULE(appointmentId),
        rescheduleData
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Verifica disponibilidad de horarios
   * @param {AvailabilityParams} params - Parámetros de disponibilidad
   * @returns {Promise<string[]>} - Lista de horarios disponibles
   */
  async checkAvailability(params: AvailabilityParams): Promise<string[]> {
    try {
      return await apiClient.get<any, string[]>(
        `${API_ENDPOINTS.DOCTORS.AVAILABILITY(params.doctorId)}`,
        { params: { date: params.date } }
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene las citas por especialidad médica
   * @param {string} specialtyId - ID de la especialidad
   * @param {Record<string, any>} params - Parámetros adicionales
   * @returns {Promise<ProcessedPaginatedResponse<Appointment>>} - Lista de citas por especialidad
   */
  async getAppointmentsBySpecialty(
    specialtyId: string, 
    params: Record<string, any> = {}
  ): Promise<ProcessedPaginatedResponse<Appointment>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<Appointment>>(
        API_ENDPOINTS.APPOINTMENTS.GET_ALL, 
        { params: { ...params, specialtyId } }
      );
      return processPaginatedResponse<Appointment>(response);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene las citas por médico
   * @param {string} doctorId - ID del médico
   * @param {Record<string, any>} params - Parámetros adicionales
   * @returns {Promise<ProcessedPaginatedResponse<Appointment>>} - Lista de citas por médico
   */
  async getAppointmentsByDoctor(
    doctorId: string, 
    params: Record<string, any> = {}
  ): Promise<ProcessedPaginatedResponse<Appointment>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<Appointment>>(
        API_ENDPOINTS.APPOINTMENTS.GET_ALL, 
        { params: { ...params, doctorId } }
      );
      return processPaginatedResponse<Appointment>(response);
    } catch (error) {
      throw error;
    }
  }
}

export default new AppointmentService(); 