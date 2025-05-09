import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { Specialty } from './appointmentService';

/**
 * Interfaces para los tipos de datos utilizados en tipos de citas
 */
export interface AppointmentType {
  id: string;
  name: string;
  description?: string;
  duration: number; // duración en minutos
  price?: number;
  specialtyId: string;
  color?: string;
  isActive?: boolean;
  specialty?: Specialty;
  isGeneral?: boolean;
}

export interface CreateAppointmentTypeData {
  name: string;
  description?: string;
  duration: number;
  price?: number;
  specialtyId: string;
  color?: string;
}

export interface UpdateAppointmentTypeData extends Partial<CreateAppointmentTypeData> {
  isActive?: boolean;
}

/**
 * Servicio para gestionar los tipos de citas médicas
 */
class AppointmentTypeService {
  /**
   * Obtiene todos los tipos de citas
   * @returns {Promise<AppointmentType[]>} - Lista de tipos de citas
   */
  async getAllAppointmentTypes(): Promise<AppointmentType[]> {
    try {
      const response = await apiClient.get<any, AppointmentType[]>(
        API_ENDPOINTS.APPOINTMENT_TYPES.GET_ALL
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene tipos de citas por especialidad
   * @param {string} specialtyId - ID de la especialidad
   * @returns {Promise<AppointmentType[]>} - Lista filtrada de tipos de citas
   */
  async getAppointmentTypesBySpecialty(specialtyId: string): Promise<AppointmentType[]> {
    try {
      console.log(`Buscando tipos de cita para especialidad con ID: ${specialtyId}`);
      // Verificamos si el ID es un string o número y lo convertimos adecuadamente
      const endpoint = API_ENDPOINTS.APPOINTMENT_TYPES.GET_BY_SPECIALTY(specialtyId);
      console.log(`Llamando endpoint: ${endpoint}`);
      
      return await apiClient.get<any, AppointmentType[]>(endpoint);
    } catch (error) {
      console.error(`Error en getAppointmentTypesBySpecialty para ID ${specialtyId}:`, error);
      throw error;
    }
  }
  
  /**
   * Crea un nuevo tipo de cita
   * @param {CreateAppointmentTypeData} data - Datos del tipo de cita
   * @returns {Promise<AppointmentType>} - Tipo de cita creado
   */
  async createAppointmentType(data: CreateAppointmentTypeData): Promise<AppointmentType> {
    try {
      return await apiClient.post<CreateAppointmentTypeData, AppointmentType>(
        API_ENDPOINTS.APPOINTMENT_TYPES.CREATE,
        data
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Actualiza un tipo de cita existente
   * @param {string} id - ID del tipo de cita
   * @param {UpdateAppointmentTypeData} data - Datos a actualizar
   * @returns {Promise<AppointmentType>} - Tipo de cita actualizado
   */
  async updateAppointmentType(
    id: string,
    data: UpdateAppointmentTypeData
  ): Promise<AppointmentType> {
    try {
      return await apiClient.put<UpdateAppointmentTypeData, AppointmentType>(
        API_ENDPOINTS.APPOINTMENT_TYPES.UPDATE(id),
        data
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Elimina un tipo de cita
   * @param {string} id - ID del tipo de cita
   * @returns {Promise<void>} - Respuesta de confirmación
   */
  async deleteAppointmentType(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.APPOINTMENT_TYPES.DELETE(id));
    } catch (error) {
      throw error;
    }
  }
}

export default new AppointmentTypeService(); 