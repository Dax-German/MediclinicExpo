import { Ionicons } from '@expo/vector-icons';
import { Redirect, Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppointmentForm from './components/AppointmentForm';

export default function ScheduleAppointmentScreen() {
  const params = useLocalSearchParams();
  
  // Obtener parámetros de la URL
  const initialSpecialtyId = params.specialtyId as string;
  const initialDoctorId = params.doctorId as string;
  const fromScreen = params.fromScreen as string || 'specialties';
  const appointmentId = params.appointmentId as string;
  const skipToDateTime = params.skipToDateTime === 'true';
  
  // Estado para la redirección
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  // Estado para seguir el paso actual del formulario
  const [currentFormStep, setCurrentFormStep] = useState<'specialty' | 'appointmentType' | 'doctor' | 'datetime'>(
    skipToDateTime ? 'datetime' : 
    initialDoctorId ? 'datetime' : 
    initialSpecialtyId ? 'appointmentType' : 
    'specialty'
  );

  // Manejar el botón de volver
  const handleBackPress = () => {
    // Volver a la pantalla de origen o a la pantalla de especialidades por defecto
    if (fromScreen === 'home') {
      setRedirectTo('/HomeScreen');
    } else if (fromScreen === 'appointments') {
      setRedirectTo('/AppointmentsScreen');
    } else {
      setRedirectTo('/SpecialtiesScreen');
    }
  };

  // Manejar la finalización del proceso de programación de cita
  const handleAppointmentComplete = () => {
    setRedirectTo('/AppointmentsScreen');
  };

  // Actualizar el paso actual del formulario
  const handleStepChange = (step: 'specialty' | 'appointmentType' | 'doctor' | 'datetime') => {
    setCurrentFormStep(step);
  };

  // Si hay una redirección pendiente, realizarla
  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }

  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false 
      }} />
      
      <View style={styles.container}>
        <StatusBar style="light" />
        
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agendar Cita</Text>
          <View style={styles.headerRight} />
        </View>
        
        {/* Barra de progreso */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            {/* Paso 1: Especialidad */}
            <View style={[
              styles.progressStep, 
              styles.progressStepActive, 
              (currentFormStep !== 'specialty') && styles.progressStepCompleted
            ]}>
              <Text style={styles.progressStepNumber}>1</Text>
            </View>
            <View style={[
              styles.progressLine, 
              (currentFormStep !== 'specialty') && styles.progressLineActive
            ]} />

            {/* Paso 2: Tipo de cita */}
            <View style={[
              styles.progressStep, 
              (currentFormStep === 'appointmentType' || currentFormStep === 'doctor' || currentFormStep === 'datetime') && styles.progressStepActive,
              (currentFormStep === 'doctor' || currentFormStep === 'datetime') && styles.progressStepCompleted
            ]}>
              <Text style={styles.progressStepNumber}>2</Text>
            </View>
            <View style={[
              styles.progressLine, 
              (currentFormStep === 'doctor' || currentFormStep === 'datetime') && styles.progressLineActive
            ]} />

            {/* Paso 3: Médico */}
            <View style={[
              styles.progressStep, 
              (currentFormStep === 'doctor' || currentFormStep === 'datetime') && styles.progressStepActive,
              currentFormStep === 'datetime' && styles.progressStepCompleted
            ]}>
              <Text style={styles.progressStepNumber}>3</Text>
            </View>
            <View style={[
              styles.progressLine, 
              currentFormStep === 'datetime' && styles.progressLineActive
            ]} />

            {/* Paso 4: Fecha y hora */}
            <View style={[
              styles.progressStep, 
              currentFormStep === 'datetime' && styles.progressStepActive
            ]}>
              <Text style={styles.progressStepNumber}>4</Text>
            </View>
          </View>

          <View style={styles.progressLabels}>
            <Text style={[styles.progressLabel, currentFormStep === 'specialty' && styles.progressLabelActive]}>
              Especialidad
            </Text>
            <Text style={[styles.progressLabel, currentFormStep === 'appointmentType' && styles.progressLabelActive]}>
              Tipo de cita
            </Text>
            <Text style={[styles.progressLabel, currentFormStep === 'doctor' && styles.progressLabelActive]}>
              Médico
            </Text>
            <Text style={[styles.progressLabel, currentFormStep === 'datetime' && styles.progressLabelActive]}>
              Fecha y hora
            </Text>
          </View>
        </View>
        
        {/* Formulario de programación de citas */}
        <AppointmentForm
          initialSpecialtyId={initialSpecialtyId}
          initialDoctorId={initialDoctorId}
          appointmentId={appointmentId}
          onComplete={handleAppointmentComplete}
          skipToDateTime={skipToDateTime}
          onStepChange={handleStepChange}
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
  },
  progressContainer: {
    backgroundColor: '#2D6CDF',
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressStep: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: {
    backgroundColor: '#4CAF50',
  },
  progressStepCompleted: {
    backgroundColor: '#4CAF50',
  },
  progressStepNumber: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressLine: {
    flex: 1,
    height: 3,
    backgroundColor: '#cccccc',
  },
  progressLineActive: {
    backgroundColor: '#4CAF50',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    width: '25%',
  },
  progressLabelActive: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 