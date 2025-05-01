import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { PaginatedResponse, ProcessedPaginatedResponse, processPaginatedResponse } from '../utils/apiUtils';
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
      const response = await apiClient.get<any, PaginatedResponse<Specialty>>(
        API_ENDPOINTS.SPECIALTIES.GET_ALL, 
        { params }
      );
      return processPaginatedResponse<Specialty>(response);
    } catch (error) {
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
      return await apiClient.get<any, Specialty>(API_ENDPOINTS.SPECIALTIES.DETAILS(specialtyId));
    } catch (error) {
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
      const response = await apiClient.get<any, PaginatedResponse<Doctor>>(
        API_ENDPOINTS.SPECIALTIES.DOCTORS(specialtyId),
        { params }
      );
      return processPaginatedResponse<Doctor>(response);
    } catch (error) {
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
      const response = await apiClient.get<any, PaginatedResponse<Specialty>>(
        API_ENDPOINTS.SPECIALTIES.GET_ALL, 
        { params: { ...params, search: query } }
      );
      return processPaginatedResponse<Specialty>(response);
    } catch (error) {
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
      return processPaginatedResponse<Specialty>(response);
    } catch (error) {
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
      return await apiClient.get<any, AppointmentType[]>(`/specialties/${specialtyId}/appointment-types`);
    } catch (error) {
      throw error;
    }
  }
}

export default new SpecialtyService(); 