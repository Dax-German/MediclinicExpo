import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { PaginatedResponse, ProcessedPaginatedResponse, processPaginatedResponse } from '../utils/apiUtils';

/**
 * Interfaces para los tipos de datos utilizados en ubicaciones físicas
 */
export interface PhysicalLocation {
  id: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  [key: string]: any;
}

/**
 * Servicio para gestionar las ubicaciones físicas
 */
class LocationService {
  /**
   * Obtiene todas las ubicaciones físicas
   * @param {Record<string, any>} params - Parámetros de consulta
   * @returns {Promise<ProcessedPaginatedResponse<PhysicalLocation>>} - Lista de ubicaciones
   */
  async getAllLocations(params: Record<string, any> = {}): Promise<ProcessedPaginatedResponse<PhysicalLocation>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<PhysicalLocation>>(
        API_ENDPOINTS.PHYSICAL_LOCATIONS.GET_ALL,
        { params }
      );
      return processPaginatedResponse<PhysicalLocation>(response);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene una ubicación física por ID
   * @param {number} id - ID de la ubicación
   * @returns {Promise<PhysicalLocation>} - Detalles de la ubicación
   */
  async getLocationById(id: number): Promise<PhysicalLocation> {
    try {
      return await apiClient.get<any, PhysicalLocation>(
        API_ENDPOINTS.PHYSICAL_LOCATIONS.GET_BY_ID(id)
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Crea una nueva ubicación física
   * @param {Omit<PhysicalLocation, 'id'>} locationData - Datos de la ubicación
   * @returns {Promise<PhysicalLocation>} - Ubicación creada
   */
  async createLocation(locationData: Omit<PhysicalLocation, 'id'>): Promise<PhysicalLocation> {
    try {
      return await apiClient.post<Omit<PhysicalLocation, 'id'>, PhysicalLocation>(
        API_ENDPOINTS.PHYSICAL_LOCATIONS.CREATE,
        locationData
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Actualiza una ubicación física existente
   * @param {number} id - ID de la ubicación
   * @param {Partial<PhysicalLocation>} locationData - Datos a actualizar
   * @returns {Promise<PhysicalLocation>} - Ubicación actualizada
   */
  async updateLocation(
    id: number,
    locationData: Partial<PhysicalLocation>
  ): Promise<PhysicalLocation> {
    try {
      return await apiClient.put<Partial<PhysicalLocation>, PhysicalLocation>(
        API_ENDPOINTS.PHYSICAL_LOCATIONS.UPDATE(id),
        locationData
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Elimina una ubicación física
   * @param {number} id - ID de la ubicación
   * @returns {Promise<{ message: string }>} - Respuesta de confirmación
   */
  async deleteLocation(id: number): Promise<{ message: string }> {
    try {
      return await apiClient.delete<any, { message: string }>(
        API_ENDPOINTS.PHYSICAL_LOCATIONS.DELETE(id)
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Obtiene ubicaciones activas
   * @param {Record<string, any>} params - Parámetros adicionales
   * @returns {Promise<ProcessedPaginatedResponse<PhysicalLocation>>} - Lista de ubicaciones activas
   */
  async getActiveLocations(params: Record<string, any> = {}): Promise<ProcessedPaginatedResponse<PhysicalLocation>> {
    try {
      const response = await apiClient.get<any, PaginatedResponse<PhysicalLocation>>(
        API_ENDPOINTS.PHYSICAL_LOCATIONS.GET_ALL,
        { params: { ...params, isActive: true } }
      );
      return processPaginatedResponse<PhysicalLocation>(response);
    } catch (error) {
      throw error;
    }
  }
}

export default new LocationService(); 