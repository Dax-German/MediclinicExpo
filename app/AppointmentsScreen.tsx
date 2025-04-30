import { Ionicons } from '@expo/vector-icons';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Appointment, appointmentService } from './services';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  /**
   * Función para cargar las citas según la pestaña activa
   */
  const loadAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Llamada al servicio según la pestaña activa
      const data = activeTab === 'upcoming' 
        ? await appointmentService.getUpcomingAppointments() 
        : await appointmentService.getAppointmentHistory();
      
      setAppointments(data);
    } catch (err) {
      console.error('Error al cargar citas:', err);
      setError('No se pudieron cargar las citas. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  // Cargar las citas al montar el componente y cuando cambie la pestaña
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  /**
   * Maneja la reprogramación de una cita
   * Ahora envía todos los datos necesarios para que no se pueda cambiar especialidad ni doctor
   */
  const handleRescheduleAppointment = (appointment: Appointment) => {
    setRedirectTo(
      `/ScheduleAppointmentScreen?appointmentId=${appointment.id}&specialtyId=${appointment.specialty?.id}&doctorId=${appointment.doctor?.id}&skipToDateTime=true`
    );
  };

  /**
   * Maneja la cancelación de una cita
   */
  const handleCancel = async (appointmentId: string) => {
    try {
      await appointmentService.cancelAppointment(appointmentId);
      // Recargar las citas para reflejar el cambio
      loadAppointments();
    } catch (err) {
      console.error('Error al cancelar cita:', err);
      // Aquí podríamos mostrar un mensaje de error al usuario
    }
  };

  /**
   * Convierte el estado de la cita de inglés a español y su formato correspondiente
   */
  const getAppointmentStatus = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { text: 'Programada', color: '#2D6CDF' };
      case 'completed':
        return { text: 'Completada', color: '#4CAF50' };
      case 'cancelled':
        return { text: 'Cancelada', color: '#FF3B30' };
      case 'noshow':
        return { text: 'No asistió', color: '#FF9500' };
      default:
        return { text: 'Desconocido', color: '#777' };
    }
  };

  const renderAppointment = ({ item }: { item: Appointment }) => {
    const status = getAppointmentStatus(item.status);
    const doctorName = item.doctor ? `Dr. ${item.doctor.firstName} ${item.doctor.lastName}` : 'Médico no asignado';
    const specialtyName = item.specialty?.name || 'Especialidad no especificada';
    
    // Formatear la fecha para mostrarla de forma amigable
    const appointmentDate = new Date(item.date);
    const formattedDate = appointmentDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    // Mostrar duración solo para citas completadas
    const appointmentDuration = item.duration ? `Duración: ${item.duration} min` : '';

    return (
      <TouchableOpacity style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <Text style={styles.doctorName}>{doctorName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${status.color}20` }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
          </View>
        </View>
        <Text style={styles.specialty}>{specialtyName}</Text>
        <View style={styles.divider} />
        <View style={styles.appointmentInfo}>
          <View style={styles.infoItem}>
            <Image source={require('../assets/Iconos/calendario.png')} style={{width: 16, height: 16, marginRight: 6}} />
            <Text style={styles.infoText}>{formattedDate}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={16} color="#555" />
            <Text style={styles.infoText}>{item.startTime}</Text>
          </View>
          {activeTab === 'history' && item.status === 'completed' && (
            <View style={styles.infoItem}>
              <Ionicons name="hourglass-outline" size={16} color="#555" />
              <Text style={styles.infoText}>{appointmentDuration}</Text>
            </View>
          )}
        </View>
        <View style={styles.buttonContainer}>
          {item.status === 'scheduled' ? (
            <>
              <TouchableOpacity 
                style={styles.rescheduleButton}
                onPress={() => handleRescheduleAppointment(item)}
              >
                <Text style={styles.rescheduleButtonText}>Reprogramar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => handleCancel(item.id)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const handleBackPress = () => {
    setRedirectTo('/HomeScreen');
  };

  const handleNewAppointment = () => {
    setRedirectTo('/ScheduleAppointmentScreen?fromScreen=appointments');
  };

  // Si hay una redirección pendiente, realizarla
  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }

  return (
    <>
      {/* Ocultar el título de navegación nativo */}
      <Stack.Screen options={{ 
        headerShown: false 
      }} />
      
      <View style={styles.container}>
        <StatusBar style="light" />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Image source={require('../assets/Iconos/volver.png')} style={{width: 24, height: 24}} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Citas</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
              Próximas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
              Historial
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadAppointments}>
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <FlatList
            data={appointments}
            renderItem={renderAppointment}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.appointmentsList}
            refreshing={isLoading}
            onRefresh={loadAppointments}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Image source={require('../assets/Iconos/calendario.png')} style={{width: 50, height: 50, tintColor: '#ccc'}} />
                <Text style={styles.emptyStateText}>
                  {activeTab === 'upcoming' 
                    ? 'No tienes citas programadas' 
                    : 'No tienes historial de citas'}
                </Text>
                {activeTab === 'upcoming' && (
                  <TouchableOpacity 
                    style={styles.newAppointmentButton}
                    onPress={handleNewAppointment}
                  >
                    <Text style={styles.newAppointmentButtonText}>Nueva cita</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />
        </View>
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
    width: 34, // Para mantener el header centrado
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 30,
    margin: 20,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: '#2D6CDF',
  },
  tabText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appointmentsList: {
    paddingBottom: 80,
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  specialty: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  appointmentInfo: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rescheduleButton: {
    backgroundColor: '#EDF1FA',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  rescheduleButtonText: {
    color: '#2D6CDF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FFE5E5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewDetailsButton: {
    backgroundColor: '#EDF1FA',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  viewDetailsButtonText: {
    color: '#2D6CDF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
    marginBottom: 20,
  },
  newAppointmentButton: {
    backgroundColor: '#2D6CDF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  newAppointmentButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorContainer: {
    padding: 15,
    backgroundColor: '#FFE5E5',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 