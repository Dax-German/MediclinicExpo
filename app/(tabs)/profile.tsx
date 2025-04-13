import { router } from 'expo-router';
import { useEffect } from 'react';

export default function ProfileTab() {
  useEffect(() => {
    // Redirigir a la pantalla de perfil
    router.replace('/ProfileScreen');
  }, []);

  return null;
} 