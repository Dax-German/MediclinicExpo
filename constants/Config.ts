import Constants from 'expo-constants';

/**
 * Proporciona acceso seguro a la configuración de la aplicación
 */
export const Config = {
  // Obtiene la URL de la API desde la configuración si existe, o proporciona un valor predeterminado
  apiUrl: Constants.expoConfig?.extra?.apiUrl || 'https://api.mediclinic.com',
  
  // Agrega otras configuraciones según sea necesario
  appName: Constants.expoConfig?.name || 'MediClinic',
  appVersion: Constants.expoConfig?.version || '1.0.0',
};

// Función de utilidad para acceder de forma segura a cualquier propiedad de configuración
export const getConfig = (key: string, defaultValue: any = null) => {
  try {
    if (!Constants.expoConfig) {
      return defaultValue;
    }
    
    // Maneja propiedades anidadas (por ejemplo: "extra.apiUrl")
    const parts = key.split('.');
    let value: any = Constants.expoConfig;
    
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return defaultValue;
      }
    }
    
    return value || defaultValue;
  } catch (error) {
    console.warn(`Error al acceder a la configuración '${key}':`, error);
    return defaultValue;
  }
}; 