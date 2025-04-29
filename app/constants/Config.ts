/**
 * Configuración global de la aplicación
 * 
 * Este archivo contiene las configuraciones principales que se utilizan
 * en toda la aplicación, incluyendo URLs de API, timeouts, y otras
 * configuraciones importantes.
 */

/**
 * Tipo de datos para la configuración
 */
export interface ConfigType {
  /** URL base para las peticiones a la API */
  apiUrl: string;
  
  /** Tiempo máximo de espera para peticiones HTTP (en ms) */
  requestTimeout: number;
  
  /** URL del chatbot de Telegram para asistencia */
  telegramBotUrl: string;
  
  /** Flag para usar datos simulados en lugar de API real */
  useMockData: boolean;
  
  /** Flag para habilitar el modo de depuración */
  debugMode: boolean;
}

/**
 * Configuración predeterminada (modo local)
 * 
 * Esta configuración está optimizada para desarrollo local
 * sin necesidad de conexión a backend
 */
const defaultConfig: ConfigType = {
  apiUrl: 'http://offline-mode', // URL ficticia ya que usaremos solo datos simulados
  requestTimeout: 10000,
  telegramBotUrl: 'https://t.me/mediclinic_bot',
  useMockData: true, // Siempre usar datos simulados en modo local
  debugMode: true
};

// Exportamos directamente la configuración predeterminada
// sin preocuparnos por diferentes entornos
const Config: ConfigType = defaultConfig;

export default Config; 