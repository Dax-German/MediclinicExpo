import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
};

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      doctor: 'Dr. Carlos Rodríguez',
      specialty: 'Cardiología',
      date: '10 Abril, 2024',
      time: '9:30 AM',
      status: 'upcoming',
    },
    {
      id: '2',
      doctor: 'Dra. María González',
      specialty: 'Dermatología',
      date: '15 Abril, 2024',
      time: '11:00 AM',
      status: 'upcoming',
    },
    {
      id: '3',
      doctor: 'Dr. José Fernández',
      specialty: 'Traumatología',
      date: '20 Marzo, 2024',
      time: '10:00 AM',
      status: 'completed',
    },
    {
      id: '4',
      doctor: 'Dra. Ana Martínez',
      specialty: 'Oftalmología',
      date: '5 Marzo, 2024',
      time: '16:30 PM',
      status: 'cancelled',
    },
  ]);

  const filteredAppointments = appointments.filter(appointment => 
    activeTab === 'upcoming' 
      ? appointment.status === 'upcoming'
      : appointment.status === 'completed' || appointment.status === 'cancelled'
  );

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <TouchableOpacity style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.doctorName}>{item.doctor}</Text>
        {item.status === 'cancelled' && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Cancelada</Text>
          </View>
        )}
      </View>
      <Text style={styles.specialty}>{item.specialty}</Text>
      <View style={styles.divider} />
      <View style={styles.appointmentInfo}>
        <View style={styles.infoItem}>
          <Image source={require('../assets/Iconos/calendario.png')} style={{width: 16, height: 16, marginRight: 6}} />
          <Text style={styles.infoText}>{item.date}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={16} color="#555" />
          <Text style={styles.infoText}>{item.time}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        {item.status === 'upcoming' ? (
          <>
            <TouchableOpacity style={styles.rescheduleButton}>
              <Text style={styles.rescheduleButtonText}>Reprogramar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : item.status === 'completed' ? (
          <TouchableOpacity style={styles.viewDetailsButton}>
            <Text style={styles.viewDetailsButtonText}>Ver detalles</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
        <FlatList
          data={filteredAppointments}
          renderItem={renderAppointment}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.appointmentsList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Image source={require('../assets/Iconos/calendario.png')} style={{width: 50, height: 50, tintColor: '#ccc'}} />
              <Text style={styles.emptyStateText}>
                {activeTab === 'upcoming' 
                  ? 'No tienes citas programadas' 
                  : 'No tienes historial de citas'}
              </Text>
              {activeTab === 'upcoming' && (
                <TouchableOpacity style={styles.newAppointmentButton}>
                  <Text style={styles.newAppointmentButtonText}>Nueva cita</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </View>

      {activeTab === 'upcoming' && (
        <TouchableOpacity style={styles.floatingButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerRight: {
    width: 34, // Para mantener el header centrado
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
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FF3B30',
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
  floatingButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#2D6CDF',
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
}); 