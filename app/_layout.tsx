import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Config } from './constants/Config';

// Prevenir que la pantalla de splash se oculte automáticamente antes de que la carga de assets esté completa
SplashScreen.preventAutoHideAsync();

// Logs para depuración de la configuración de Expo
console.log('Constants keys:', Object.keys(Constants));
console.log('Constants.expoConfig:', Constants.expoConfig);
console.log('Constants.appOwnership:', Constants.appOwnership);
console.log('Constants.debugMode:', Constants.debugMode);
console.log('Constants.deviceName:', Constants.deviceName);
console.log('Constants.executionEnvironment:', Constants.executionEnvironment);

// Verificación de la configuración cargada de la aplicación
console.log('App config loaded:', {
  apiUrl: Config.apiUrl,
  appName: Config.appName,
  appVersion: Config.appVersion
});

/**
 * Componente principal de la aplicación que configura la navegación y el tema
 * Se encarga de:
 * - Cargar las fuentes necesarias
 * - Ocultar la pantalla de splash cuando todo está listo
 * - Configurar las rutas principales de la aplicación
 */
export default function RootLayout() {
  // Cargar las fuentes personalizadas
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Ocultar la pantalla de splash cuando las fuentes se carguen correctamente
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Configuración y depuración de los enlaces profundos (deep linking)
  useEffect(() => {
    // Define esquema URL explícitamente para evitar errores de configuración
    const url = Linking.createURL('/', { scheme: 'myapp' });
    console.log('Created URL:', url);
    
    // Obtener y mostrar la URL inicial para depuración
    Linking.getInitialURL().then(initialUrl => {
      console.log('Initial URL:', initialUrl);
    });
  }, []);

  // No renderizar nada hasta que las fuentes estén cargadas
  if (!loaded) {
    return null;
  }

  // Estructura principal de navegación de la aplicación
  return (
    <ThemeProvider value={DefaultTheme}>
      {/* Configuración del Stack Navigator con ruta inicial */}
      <Stack initialRouteName="index">
        {/* Pantalla inicial que redirige al login */}
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
            gestureEnabled: false 
          }} 
        />
        {/* Pantalla de registro de usuarios */}
        <Stack.Screen 
          name="RegisterScreen" 
          options={{ 
            headerShown: true,
            title: 'Registro',
            gestureEnabled: false 
          }} 
        />
        {/* Pantalla de inicio de sesión */}
        <Stack.Screen 
          name="LoginScreen" 
          options={{ 
            headerShown: false,
            gestureEnabled: false 
          }} 
        />
        {/* Pantalla de recuperación de contraseña */}
        <Stack.Screen 
          name="ForgotPasswordScreen" 
          options={{ 
            headerShown: true,
            title: '¿Olvidaste tu contraseña?',
            gestureEnabled: false 
          }} 
        />
        {/* Sistema de pestañas principal de la aplicación */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            gestureEnabled: false 
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
