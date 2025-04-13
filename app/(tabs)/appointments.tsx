import { router } from 'expo-router';
import { useEffect } from 'react';

export default function AppointmentsTab() {
  useEffect(() => {
    // Redirigir a la pantalla de citas
    router.replace('/AppointmentsScreen');
  }, []);

  return null;
} 