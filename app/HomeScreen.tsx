import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Definición del tipo para una especialidad
interface Specialty {
  id: string;
  name: string;
  icon: any; // Idealmente esto debería ser un tipo más específico para imágenes
}

// Definición del tipo para las props del componente SpecialtyCard
interface SpecialtyCardProps {
  specialty: Specialty;
  onPress: () => void;
}

// Componente de tarjeta de especialidad (versión estática)
const SpecialtyCard = ({ specialty, onPress }: SpecialtyCardProps) => {
  return (
    <TouchableOpacity style={styles.specialtyCard} onPress={onPress}>
      <View style={styles.specialtyCardContent}>
        <Image source={specialty.icon} style={styles.specialtyIcon} resizeMode="contain" />
        <Text style={styles.specialtyCardText}>{specialty.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  // Estado para la redirección
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const loadProfileImage = useCallback(async () => {
    try {
      const savedImage = await AsyncStorage.getItem('@MediClinic:profileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.error('Error al cargar imagen de perfil:', error);
    }
  }, []);

  // Cargar imagen al montar el componente
  useEffect(() => {
    loadProfileImage();
  }, [loadProfileImage]);
  
  // Cargar imagen cuando la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      loadProfileImage();
    }, [loadProfileImage])
  );

  // Si hay una redirección pendiente, realizarla
  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }

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
    { 
      id: '6', 
      name: 'Cardiología',
      icon: require('../assets/Iconos/app-medica.png'),
    },
    { 
      id: '7', 
      name: 'Dermatología',
      icon: require('../assets/Iconos/app-medica.png'),
    },
  ];

  const openTelegramBot = () => {
    Linking.openURL('https://t.me/mediclinic_bot'); // URL ficticio, reemplazar con el real
  };

  const handleNotificationPress = () => {
    setRedirectTo('/AlertsScreen');
  };

  const handleProfilePress = () => {
    setRedirectTo('/ProfileScreen');
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
            <TouchableOpacity 
              style={styles.notificationIcon}
              onPress={handleNotificationPress}
            >
              <Ionicons name="notifications-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.profileIcon}
              onPress={handleProfilePress}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={{width: 32, height: 32, borderRadius: 16}} />
              ) : (
                <Image source={require('../assets/Iconos/app-medica.png')} style={{width: 32, height: 32}} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sección de Citas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Citas</Text>
          <TouchableOpacity 
            style={styles.citasCard}
            onPress={() => setRedirectTo('/AppointmentsScreen')}
          >
            <View style={styles.citasIconContainer}>
              <Image 
                source={require('../assets/Iconos/calendario.png')} 
                style={styles.citasIcon}
              />
            </View>
            <View style={styles.citasDetails}>
              <Text style={styles.citasTitle}>Ver mis citas</Text>
              <Text style={styles.citasSubtitle}>Consulta tus próximas citas médicas</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Especialidades (según el mockup) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especialidades</Text>
          <View style={styles.specialtiesGridContainer}>
            <View style={styles.specialtiesRow}>
              {specialties.slice(0, 3).map((specialty) => (
                <SpecialtyCard
                  key={specialty.id}
                  specialty={specialty}
                  onPress={() => {
                    if (specialty.id === '1') { // Para General
                      setRedirectTo(`/ScheduleAppointmentScreen?specialtyId=${specialty.id}&isGeneral=true`);
                    } else if (specialty.id === '2') { // Para Pediatría
                      setRedirectTo(`/ScheduleAppointmentScreen?specialtyId=${specialty.id}&isPediatric=true`);
                    } else if (specialty.id === '3') { // Para Planificación
                      setRedirectTo(`/ScheduleAppointmentScreen?specialtyId=${specialty.id}&isPlanning=true`);
                    } else {
                      setRedirectTo(`/ScheduleAppointmentScreen?specialtyId=${specialty.id}`);
                    }
                  }}
                />
              ))}
            </View>
            <View style={styles.specialtiesRow}>
              {specialties.slice(3, 5).map((specialty) => (
                <SpecialtyCard
                  key={specialty.id}
                  specialty={specialty}
                  onPress={() => {
                    if (specialty.id === '4') { // Para Odontología
                      setRedirectTo(`/ScheduleAppointmentScreen?specialtyId=${specialty.id}&isDental=true`);
                    } else if (specialty.id === '5') { // Para Optometría
                      setRedirectTo(`/ScheduleAppointmentScreen?specialtyId=${specialty.id}&isOptometry=true`);
                    } else {
                      setRedirectTo(`/ScheduleAppointmentScreen?specialtyId=${specialty.id}`);
                    }
                  }}
                />
              ))}
              
              {/* Botón de "Más Especialidades" */}
              <Pressable
                style={[styles.specialtyCard, {backgroundColor: '#2D6CDF'}]}
                onPress={() => setRedirectTo('/SpecialtiesScreen')}
              >
                <View style={styles.specialtyCardContent}>
                  <Feather name="plus" color="white" size={22} />
                  <Text style={[styles.specialtyCardText, {color: 'white', fontWeight: '500'}]}>
                    Más
                  </Text>
                </View>
              </Pressable>
            </View>
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
  specialtiesGridContainer: {
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  specialtiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  citasCard: {
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
  citasIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    overflow: 'hidden',
  },
  citasIcon: {
    width: 24,
    height: 24,
  },
  citasDetails: {
    flex: 1,
  },
  citasTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  citasSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  specialtyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '31%',
    aspectRatio: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  specialtyCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  specialtyIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  specialtyCardText: {
    fontSize: 11,
    color: '#555',
    textAlign: 'center',
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