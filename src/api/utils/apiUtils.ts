import { AxiosError } from 'axios';

/**
 * Utilidades para el manejo de peticiones y respuestas de la API
 */

export interface ApiError {
  status?: number;
  message: string;
  data?: any;
  response?: any;
  request?: any;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ProcessedPaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    hasMore: boolean;
  };
}

/**
 * Formatea el mensaje de error según el tipo
 * @param {Error|ApiError} error - Error capturado
 * @returns {string} Mensaje de error formateado
 */
export const formatErrorMessage = (error: Error | ApiError | AxiosError): string => {
  if (!error) {
    return 'Error desconocido';
  }
  
  // Si es un error de la API con formato propio
  if ('status' in error && 'message' in error) {
    return error.message;
  }
  
  // Errores específicos según código HTTP
  if ('response' in error && error.response) {
    const { status } = error.response;
    switch (status) {
      case 400:
        return 'Solicitud incorrecta. Verifique los datos.';
      case 401:
        return 'No autorizado. Inicie sesión nuevamente.';
      case 403:
        return 'Acceso denegado. No tiene permisos para esta acción.';
      case 404:
        return 'El recurso solicitado no fue encontrado.';
      case 409:
        return 'Conflicto. El recurso ya existe o está siendo usado.';
      case 422:
        return 'Datos de entrada inválidos. Verifique la información.';
      case 500:
        return 'Error interno del servidor. Intente más tarde.';
      default:
        return `Error en la solicitud (${status})`;
    }
  }
  
  // Error de red o timeout
  if ('request' in error && error.request) {
    return 'No se pudo conectar con el servidor. Verifique su conexión.';
  }
  
  // Error genérico
  return (error as Error).message || 'Error al procesar la solicitud';
};

/**
 * Formatea datos para enviarlos a la API
 * @param {Record<string, any>} data - Datos a formatear
 * @returns {Record<string, any>} Datos formateados
 */
export const formatRequestData = (data: Record<string, any>): Record<string, any> => {
  // Eliminar propiedades con valores undefined o null
  const cleanData = Object.entries(data).reduce<Record<string, any>>((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {});
  
  return cleanData;
};

/**
 * Procesa las respuestas paginadas
 * @param {PaginatedResponse<T>} response - Respuesta de la API
 * @returns {ProcessedPaginatedResponse<T>} Datos procesados con información de paginación
 */
export const processPaginatedResponse = <T>(response: PaginatedResponse<T>): ProcessedPaginatedResponse<T> => {
  const { data, meta } = response;
  
  return {
    items: data || [],
    pagination: {
      currentPage: meta?.current_page || 1,
      lastPage: meta?.last_page || 1,
      perPage: meta?.per_page || 10,
      total: meta?.total || 0,
      hasMore: meta?.current_page < meta?.last_page,
    }
  };
};

export default {
  formatErrorMessage,
  formatRequestData,
  processPaginatedResponse
}; 