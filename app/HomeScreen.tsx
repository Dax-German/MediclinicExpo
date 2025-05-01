import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SpecialtyList from './components/SpecialtyList';

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

  const openTelegramBot = () => {
    Linking.openURL('https://t.me/mediclinic_bot'); // URL ficticio, reemplazar con el real
  };

  const handleNotificationPress = () => {
    setRedirectTo('/AlertsScreen');
  };

  const handleProfilePress = () => {
    setRedirectTo('/ProfileScreen');
  };

  const handleSpecialtySelect = (specialtyId: string) => {
    if (specialtyId === 'more') {
      setRedirectTo('/SpecialtiesScreen');
    } else {
      setRedirectTo(`/ScheduleAppointmentScreen?specialtyId=${specialtyId}&fromScreen=home`);
    }
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

        {/* Especialidades destacadas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especialidades</Text>
          <SpecialtyList 
            showFeaturedOnly={true} 
            maxItems={6} 
            onSelectSpecialty={handleSpecialtySelect}
            showTitle={false}
          />
        </View>
        
        {/* Espacio adicional al final del scroll */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Botón flotante para MediChat */}
      <TouchableOpacity 
        style={styles.chatButton}
        onPress={openTelegramBot}
      >
        <Ionicons name="chatbubble-ellipses" size={30} color="white" />
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
    backgroundColor: '#2D6CDF',
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoInitial: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 6,
    marginRight: 10,
  },
  profileIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
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
    backgroundColor: '#EDF1FA',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  citasIcon: {
    width: 20,
    height: 20,
    tintColor: '#2D6CDF',
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
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  chatButton: {
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
    shadowRadius: 4,
  },
}); 