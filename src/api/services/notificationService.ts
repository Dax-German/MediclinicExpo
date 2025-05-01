import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { PaginatedResponse, ProcessedPaginatedResponse, processPaginatedResponse } from '../utils/apiUtils';

/**
 * Interfaces para los tipos de datos utilizados en notificaciones
 */
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
  [key: string]: any;
}

export type NotificationType = 'appointment' | 'system' | 'reminder' | 'message';

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  appointmentReminders: boolean;
  systemNotifications: boolean;
  marketingNotifications: boolean;
  [key: string]: boolean;
}

export interface DeviceData {
  token: string;
  platform: 'ios' | 'android' | 'web';
  deviceId?: string;
}

/**
 * Servicio para gestionar las notificaciones y alertas
 */
class NotificationService {
  /**
   * Obtiene todas las notificaciones del usuario
   * @param {Record<string, any>} params - Parámetros de paginación y filtros
   * @returns {Promise<ProcessedPaginatedResponse<Notification>>} - Lista de notificaciones y metadata
   */
  async getAllNotifications(params: Record<string, any> = {}): Promise<ProcessedPaginatedResponse<Notification>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<Notification>>(
        API_ENDPOINTS.NOTIFICATIONS.GET_ALL,
        { params }
      );
      return processPaginatedResponse<Notification>(response);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Marca una notificación como leída
   * @param {string} notificationId - ID de la notificación
   * @returns {Promise<{ message: string }>} - Respuesta de la operación
   */
  async markAsRead(notificationId: string): Promise<{ message: string }> {
    try {
      return await apiClient.patch<any, { message: string }>(
        API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(notificationId)
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Marca todas las notificaciones como leídas
   * @returns {Promise<{ message: string }>} - Respuesta de la operación
   */
  async markAllAsRead(): Promise<{ message: string }> {
    try {
      return await apiClient.patch<any, { message: string }>(
        API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene la configuración de notificaciones del usuario
   * @returns {Promise<NotificationSettings>} - Configuración actual
   */
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      return await apiClient.get<any, NotificationSettings>(
        API_ENDPOINTS.NOTIFICATIONS.SETTINGS
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Actualiza la configuración de notificaciones
   * @param {NotificationSettings} settingsData - Nueva configuración
   * @returns {Promise<NotificationSettings>} - Configuración actualizada
   */
  async updateNotificationSettings(settingsData: NotificationSettings): Promise<NotificationSettings> {
    try {
      return await apiClient.put<NotificationSettings, NotificationSettings>(
        API_ENDPOINTS.NOTIFICATIONS.SETTINGS,
        settingsData
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene las notificaciones no leídas
   * @param {Record<string, any>} params - Parámetros adicionales
   * @returns {Promise<ProcessedPaginatedResponse<Notification>>} - Lista de notificaciones no leídas
   */
  async getUnreadNotifications(params: Record<string, any> = {}): Promise<ProcessedPaginatedResponse<Notification>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<Notification>>(
        API_ENDPOINTS.NOTIFICATIONS.GET_ALL,
        { params: { ...params, read: false } }
      );
      return processPaginatedResponse<Notification>(response);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene el contador de notificaciones no leídas
   * @returns {Promise<number>} - Número de notificaciones no leídas
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiClient.get<any, { count: number }>('/notifications/unread-count');
      return response.count || 0;
    } catch (error) {
      console.error('Error al obtener contador de notificaciones:', error);
      return 0;
    }
  }

  /**
   * Registra el token del dispositivo para notificaciones push
   * @param {DeviceData} deviceData - Información del dispositivo
   * @returns {Promise<{ message: string }>} - Respuesta del registro
   */
  async registerDeviceToken(deviceData: DeviceData): Promise<{ message: string }> {
    try {
      return await apiClient.post<DeviceData, { message: string }>(
        '/notifications/devices',
        deviceData
      );
    } catch (error) {
      throw error;
    }
  }
}

export default new NotificationService(); 