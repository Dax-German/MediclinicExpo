import Constants from 'expo-constants';

/**
 * Interfaz para definir la estructura de configuración de la aplicación
 * 
 * Contiene las propiedades básicas necesarias y permite propiedades adicionales
 * mediante el índice genérico [key: string]: any
 */
interface ConfigType {
  apiUrl: string;     // URL base para las llamadas a la API
  appName: string;    // Nombre de la aplicación
  appVersion: string; // Versión actual de la aplicación
  [key: string]: any; // Permite propiedades adicionales dinámicas
}

/**
 * Configuración predeterminada que se usará cuando no se pueda acceder
 * a la configuración de Expo o cuando falten valores
 */
const defaultConfig: ConfigType = {
  apiUrl: 'http://localhost:3000',
  appName: 'MediClinic',
  appVersion: '1.0.0',
};

/**
 * Función para obtener valores de configuración de manera segura
 * 
 * @param path - Ruta para acceder a la propiedad de configuración usando notación de punto
 * @param defaultValue - Valor predeterminado que se devolverá si no se encuentra la propiedad
 * @returns El valor de configuración encontrado o el valor predeterminado
 */
export const getConfig = <T>(path: string, defaultValue: T): T => {
  try {
    // Intenta obtener la configuración de Expo, si no está disponible usa la configuración predeterminada
    const config: ConfigType = Constants.expoConfig?.extra as ConfigType || defaultConfig;
    
    // Navega a través de la ruta de propiedades usando reduce
    return path.split('.').reduce<any>((acc, part) => acc && acc[part], config) ?? defaultValue;
  } catch (error) {
    // Registra el error y devuelve el valor predeterminado en caso de error
    console.warn(`Error accessing config path ${path}:`, error);
    return defaultValue;
  }
};

/**
 * Objeto de configuración exportado con valores obtenidos de getConfig
 * 
 * Proporciona acceso directo a las propiedades de configuración más utilizadas
 */
export const Config = {
  apiUrl: getConfig<string>('apiUrl', defaultConfig.apiUrl),
  appName: getConfig<string>('appName', defaultConfig.appName),
  appVersion: getConfig<string>('appVersion', defaultConfig.appVersion),
}; 