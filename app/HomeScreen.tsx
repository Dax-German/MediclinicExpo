import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  // Especialidades según la lógica del proyecto
  const specialties = [
    { 
      id: '1', 
      name: 'General',
      icon: require('../assets/Iconos/estetoscopio.png'),
    },
    { 
      id: '2', 
      name: 'Pediatría',
      icon: require('../assets/Iconos/pediatria.png'),
    },
    { 
      id: '3', 
      name: 'Planificación',
      icon: require('../assets/Iconos/calendario.png'),
    },
    { 
      id: '4', 
      name: 'Odontología',
      icon: require('../assets/Iconos/odontologia.png'),
    },
    { 
      id: '5', 
      name: 'Optometría',
      icon: require('../assets/Iconos/optometria.png'),
    },
  ];

  const nextAppointment = {
    doctor: 'Dr. Carlos Rodríguez',
    specialty: 'Medicina General',
    date: 'Hoy, 15:30',
  };

  const handleSpecialtySelection = (specialtyId: string) => {
    router.push({
      pathname: '../ScheduleAppointmentScreen',
      params: { specialtyId }
    });
  };

  const handleReserveWithDoctor = (doctorId: string) => {
    router.push({
      pathname: '../ScheduleAppointmentScreen',
      params: { doctorId }
    });
  };

  const openTelegramBot = () => {
    Linking.openURL('https://t.me/mediclinic_bot'); // URL ficticio, reemplazar con el real
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header como en el mockup */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoInitial}>M</Text>
            <Text style={styles.logoText}>ediClinic</Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationIcon}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.profileIcon}
              onPress={() => router.push('/ProfileScreen')}
            >
              <Image source={require('../assets/Iconos/app-medica.png')} style={{width: 32, height: 32}} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Próxima Cita (como en el mockup) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próxima Cita</Text>
          <View style={styles.nextAppointmentCard}>
            <View style={styles.doctorImageContainer}>
              <Image 
                source={require('../assets/Iconos/app-medica.png')} 
                style={styles.doctorImage}
              />
            </View>
            <View style={styles.appointmentDetails}>
              <Text style={styles.doctorName}>{nextAppointment.doctor}</Text>
              <Text style={styles.specialty}>{nextAppointment.specialty}</Text>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={16} color="#555" />
                <Text style={styles.timeText}>{nextAppointment.date}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>Ver</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Especialidades (según el mockup) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especialidades</Text>
          <View style={styles.specialtiesContainer}>
            {specialties.map((specialty) => (
              <TouchableOpacity 
                key={specialty.id} 
                style={styles.specialtyItem}
                onPress={() => handleSpecialtySelection(specialty.id)}
              >
                <View style={styles.specialtyIconContainer}>
                  <Image source={specialty.icon} style={styles.specialtyIcon} resizeMode="contain" />
                </View>
                <Text style={styles.specialtyName}>{specialty.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Doctores Destacados (como en el mockup) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Doctores Destacados</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.featuredDoctorCard}>
            <View style={styles.doctorImageContainer}>
              <Image 
                source={require('../assets/Iconos/app-medica.png')} 
                style={styles.doctorImage}
              />
            </View>
            <View style={styles.doctorDetails}>
              <Text style={styles.featuredDoctorName}>Dr. Carlos Rodríguez</Text>
              <Text style={styles.featuredDoctorSpecialty}>Medicina General</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>4.9</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.reserveButton}
              onPress={() => handleReserveWithDoctor('1')}
            >
              <Text style={styles.reserveButtonText}>Reservar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Botón flotante para Telegram Bot */}
      <TouchableOpacity style={styles.telegramButton} onPress={openTelegramBot}>
        <Ionicons name="chatbubble-ellipses" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D6CDF',
  },
  logoText: {
    fontSize: 20,
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    marginRight: 15,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  seeAllText: {
    color: '#2D6CDF',
    fontSize: 14,
  },
  nextAppointmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  doctorImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    overflow: 'hidden',
  },
  doctorImage: {
    width: 50,
    height: 50,
  },
  appointmentDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  specialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  viewButton: {
    backgroundColor: '#EDF1FA',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  viewButtonText: {
    fontSize: 14,
    color: '#2D6CDF',
    fontWeight: '500',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  specialtyItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 15,
  },
  specialtyIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EDF1FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  specialtyIcon: {
    width: 35,
    height: 35,
  },
  specialtyName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#555',
  },
  featuredDoctorCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  doctorDetails: {
    flex: 1,
  },
  featuredDoctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  featuredDoctorSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  reserveButton: {
    backgroundColor: '#2D6CDF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  reserveButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  telegramButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2D6CDF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
}); 