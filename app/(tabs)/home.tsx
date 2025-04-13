import { router } from 'expo-router';
import { useEffect, useLayoutEffect } from 'react';
import { BackHandler } from 'react-native';

export default function HomeTab() {
  // Prevenir que el usuario pueda regresar a la pantalla de login con el botón de atrás
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Retorna true para indicar que has manejado el evento
      return true;
    });

    return () => backHandler.remove();
  }, []);

  useLayoutEffect(() => {
    // Redirigir a la pantalla principal y evitar que sea parte del historial de navegación
    router.replace('/HomeScreen');
  }, []);

  return null;
} 