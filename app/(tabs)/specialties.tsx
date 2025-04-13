import { router } from 'expo-router';
import { useEffect } from 'react';

export default function SpecialtiesTab() {
  useEffect(() => {
    // Redirigir a la pantalla de especialidades
    router.replace('/SpecialtiesScreen');
  }, []);

  return null;
} 