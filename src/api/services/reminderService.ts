import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { PaginatedResponse, ProcessedPaginatedResponse, processPaginatedResponse } from '../utils/apiUtils';

/**
 * Interfaces para los tipos de datos utilizados en recordatorios
 */
export interface Reminder {
  id: string;
  appointmentId: string;
  receiverId: string;
  title: string;
  message: string;
  scheduledFor: string; // ISO date string
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  type: 'email' | 'sms' | 'push' | 'in-app';
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

/**
 * Servicio para gestionar los recordatorios
 */
class ReminderService {
  /**
   * Obtiene todos los recordatorios
   * @param {Record<string, any>} params - Parámetros de consulta
   * @returns {Promise<ProcessedPaginatedResponse<Reminder>>} - Lista de recordatorios
   */
  async getAllReminders(params: Record<string, any> = {}): Promise<ProcessedPaginatedResponse<Reminder>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<Reminder>>(
        API_ENDPOINTS.REMINDERS.GET_ALL,
        { params }
      );
      return processPaginatedResponse<Reminder>(response);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene un recordatorio por ID
   * @param {number} id - ID del recordatorio
   * @returns {Promise<Reminder>} - Detalles del recordatorio
   */
  async getReminderById(id: number): Promise<Reminder> {
    try {
      return await apiClient.get<any, Reminder>(
        API_ENDPOINTS.REMINDERS.GET_BY_ID(id)
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene recordatorios por cita
   * @param {number} appointmentId - ID de la cita
   * @param {Record<string, any>} params - Parámetros adicionales
   * @returns {Promise<ProcessedPaginatedResponse<Reminder>>} - Lista de recordatorios
   */
  async getRemindersByAppointment(
    appointmentId: number,
    params: Record<string, any> = {}
  ): Promise<ProcessedPaginatedResponse<Reminder>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<Reminder>>(
        API_ENDPOINTS.REMINDERS.GET_BY_APPOINTMENT(appointmentId),
        { params }
      );
      return processPaginatedResponse<Reminder>(response);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene recordatorios por receptor
   * @param {number} receiverId - ID del receptor
   * @param {Record<string, any>} params - Parámetros adicionales
   * @returns {Promise<ProcessedPaginatedResponse<Reminder>>} - Lista de recordatorios
   */
  async getRemindersByReceiver(
    receiverId: number,
    params: Record<string, any> = {}
  ): Promise<ProcessedPaginatedResponse<Reminder>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<Reminder>>(
        API_ENDPOINTS.REMINDERS.GET_BY_RECEIVER(receiverId),
        { params }
      );
      return processPaginatedResponse<Reminder>(response);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Crea un nuevo recordatorio
   * @param {Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>} reminderData - Datos del recordatorio
   * @returns {Promise<Reminder>} - Recordatorio creado
   */
  async createReminder(
    reminderData: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Reminder> {
    try {
      return await apiClient.post<Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>, Reminder>(
        API_ENDPOINTS.REMINDERS.CREATE,
        reminderData
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Actualiza un recordatorio existente
   * @param {number} id - ID del recordatorio
   * @param {Partial<Reminder>} reminderData - Datos a actualizar
   * @returns {Promise<Reminder>} - Recordatorio actualizado
   */
  async updateReminder(
    id: number,
    reminderData: Partial<Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Reminder> {
    try {
      return await apiClient.put<Partial<Reminder>, Reminder>(
        API_ENDPOINTS.REMINDERS.UPDATE(id),
        reminderData
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Elimina un recordatorio
   * @param {number} id - ID del recordatorio
   * @returns {Promise<{ message: string }>} - Respuesta de confirmación
   */
  async deleteReminder(id: number): Promise<{ message: string }> {
    try {
      return await apiClient.delete<any, { message: string }>(
        API_ENDPOINTS.REMINDERS.DELETE(id)
      );
    } catch (error) {
      throw error;
    }
  }
}

export default new ReminderService(); 