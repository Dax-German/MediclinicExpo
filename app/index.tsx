import { Redirect } from 'expo-router';

/**
 * Componente inicial de la aplicación
 * 
 * Esta es la primera pantalla que se carga cuando se inicia la aplicación.
 * Simplemente redirige al usuario a la pantalla de inicio de sesión.
 * Esta redirección automática es parte del flujo de navegación básico
 * y asegura que los usuarios siempre comiencen en la pantalla de login.
 */
export default function Index() {
  return <Redirect href="/LoginScreen" />;
} 