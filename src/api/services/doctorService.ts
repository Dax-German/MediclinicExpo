import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { PaginatedResponse, ProcessedPaginatedResponse, processPaginatedResponse } from '../utils/apiUtils';
import { Doctor } from './appointmentService';

/**
 * Interfaces específicas para el servicio de doctores
 */
export interface DoctorAvailabilityResponse {
  date: string;
  availableSlots: string[]; // Array de strings con formato "HH:MM"
}

/**
 * Servicio para gestionar la información de doctores
 */
class DoctorService {
  /**
   * Obtiene todos los doctores
   * @param {Record<string, any>} params - Parámetros de consulta
   * @returns {Promise<ProcessedPaginatedResponse<Doctor>>} - Lista de doctores
   */
  async getAllDoctors(params: Record<string, any> = {}): Promise<ProcessedPaginatedResponse<Doctor>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<Doctor>>(
        '/doctors',
        { params }
      );
      return processPaginatedResponse<Doctor>(response);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene un doctor por ID
   * @param {string} doctorId - ID del doctor
   * @returns {Promise<Doctor>} - Detalles del doctor
   */
  async getDoctorById(doctorId: string): Promise<Doctor> {
    try {
      return await apiClient.get<any, Doctor>(`/doctors/${doctorId}`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene los horarios disponibles de un doctor
   * @param {string} doctorId - ID del doctor
   * @param {string} date - Fecha en formato YYYY-MM-DD
   * @returns {Promise<string[]>} - Lista de horarios disponibles
   */
  async getAvailability(doctorId: string, date: string): Promise<string[]> {
    try {
      return await apiClient.get<any, string[]>(
        API_ENDPOINTS.DOCTORS.AVAILABILITY(doctorId),
        { params: { date } }
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Busca doctores por nombre
   * @param {string} query - Texto a buscar
   * @param {Record<string, any>} params - Parámetros adicionales
   * @returns {Promise<ProcessedPaginatedResponse<Doctor>>} - Lista de doctores
   */
  async searchDoctors(
    query: string,
    params: Record<string, any> = {}
  ): Promise<ProcessedPaginatedResponse<Doctor>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<Doctor>>(
        '/doctors',
        { params: { ...params, search: query } }
      );
      return processPaginatedResponse<Doctor>(response);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene los doctores destacados
   * @param {Record<string, any>} params - Parámetros adicionales
   * @returns {Promise<ProcessedPaginatedResponse<Doctor>>} - Lista de doctores destacados
   */
  async getFeaturedDoctors(params: Record<string, any> = {}): Promise<ProcessedPaginatedResponse<Doctor>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<Doctor>>(
        '/doctors',
        { params: { ...params, featured: true } }
      );
      return processPaginatedResponse<Doctor>(response);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene los doctores por especialidad
   * @param {string} specialtyId - ID de la especialidad
   * @param {Record<string, any>} params - Parámetros adicionales
   * @returns {Promise<ProcessedPaginatedResponse<Doctor>>} - Lista de doctores filtrados por especialidad
   */
  async getDoctorsBySpecialty(
    specialtyId: string,
    params: Record<string, any> = {}
  ): Promise<ProcessedPaginatedResponse<Doctor>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<Doctor>>(
        '/doctors',
        { params: { ...params, specialtyId } }
      );
      return processPaginatedResponse<Doctor>(response);
    } catch (error) {
      throw error;
    }
  }
}

export default new DoctorService(); 