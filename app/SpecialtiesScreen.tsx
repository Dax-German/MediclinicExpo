import { Ionicons } from '@expo/vector-icons';
import { Redirect, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SpecialtyListView from './components/SpecialtyListView';

export default function SpecialtiesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fromScreen = params.fromScreen as string || 'home';
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  
  const handleBackPress = () => {
    // Navegación de regreso basada en la pantalla de origen
    if (fromScreen === 'home' || !fromScreen) {
      setRedirectTo('/HomeScreen');
    } else {
      router.back();
    }
  };
  
  const handleSpecialtySelect = (specialtyId: string) => {
    // Redirigir a ScheduleAppointmentScreen con el ID de la especialidad y fromScreen como parámetros
    setRedirectTo(`/ScheduleAppointmentScreen?specialtyId=${specialtyId}&fromScreen=specialties`);
  };
  
  // Si hay una redirección pendiente, realizarla
  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }
  
  return (
    <>
      {/* Configuración de la navegación */}
      <Stack.Screen options={{ 
        headerShown: false 
      }} />
      
      <View style={styles.container}>
        <StatusBar style="light" />
        
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Especialidades</Text>
          <View style={styles.headerRight} />
        </View>
        
        {/* Lista de especialidades en formato de lista */}
        <SpecialtyListView 
          onSelectSpecialty={handleSpecialtySelect}
          searchQuery=""
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2D6CDF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  headerRight: {
    width: 24, // Para mantener el header centrado
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  }
}); 