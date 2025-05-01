import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

/**
 * Componente inicial de la aplicación
 * 
 * Esta es la primera pantalla que se carga cuando se inicia la aplicación.
 * Simplemente redirige al usuario a la pantalla de inicio de sesión.
 * Esta redirección automática es parte del flujo de navegación básico
 * y asegura que los usuarios siempre comiencen en la pantalla de login.
 */
export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await AsyncStorage.getItem('@MediClinic:authToken');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error al verificar la autenticación:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  // Mientras se verifica, no renderizar nada
  if (isAuthenticated === null) {
    return null;
  }

  // Redirigir según el estado de autenticación
  return isAuthenticated ? <Redirect href="/HomeScreen" /> : <Redirect href="/LoginScreen" />;
} 