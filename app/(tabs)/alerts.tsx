import { router } from 'expo-router';
import { useEffect } from 'react';

export default function AlertsTab() {
  useEffect(() => {
    // Redirigir a la pantalla de alertas
    router.replace('/AlertsScreen');
  }, []);

  return null;
} 