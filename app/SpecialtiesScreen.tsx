import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Specialty = {
  id: string;
  name: string;
  icon: IconName;
  description: string;
};

export default function SpecialtiesScreen() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // Si hay una redirección pendiente, realizarla
  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }

  const specialties: Specialty[] = [
    {
      id: '8',
      name: 'Cardiología',
      icon: 'heart-outline',
      description: 'Especialidad médica que se ocupa del diagnóstico y tratamiento de las enfermedades del corazón.',
    },
    {
      id: '6',
      name: 'Dermatología',
      icon: 'body-outline',
      description: 'Especialidad médica encargada del estudio de la piel, su estructura, función y enfermedades.',
    },
    {
      id: '7',
      name: 'Traumatología',
      icon: 'fitness-outline',
      description: 'Especialidad médica que trata lesiones del sistema músculo-esquelético.',
    },
    {
      id: '9',
      name: 'Neurología',
      icon: 'medical-outline',
      description: 'Especialidad médica que trata los trastornos del sistema nervioso.',
    },
  ];

  const renderSpecialty = ({ item }: { item: Specialty }) => (
    <TouchableOpacity 
      style={styles.specialtyCard}
      onPress={() => {
        // Añadir parámetros específicos según la especialidad
        if (item.id === '8') { // Cardiología
          setRedirectTo(`/ScheduleAppointmentScreen?specialtyId=${item.id}&isCardiology=true`);
        } else if (item.id === '6') { // Dermatología
          setRedirectTo(`/ScheduleAppointmentScreen?specialtyId=${item.id}&isDermatology=true`);
        } else if (item.id === '7') { // Traumatología
          setRedirectTo(`/ScheduleAppointmentScreen?specialtyId=${item.id}&isTraumatology=true`);
        } else if (item.id === '9') { // Neurología
          setRedirectTo(`/ScheduleAppointmentScreen?specialtyId=${item.id}&isNeurology=true`);
        } else {
          setRedirectTo(`/ScheduleAppointmentScreen?specialtyId=${item.id}`);
        }
      }}
    >
      <View style={styles.specialtyIconContainer}>
        <Ionicons name={item.icon} size={28} color="#2D6CDF" />
      </View>
      <View style={styles.specialtyInfo}>
        <Text style={styles.specialtyName}>{item.name}</Text>
        <Text style={styles.specialtyDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#888" />
    </TouchableOpacity>
  );

  const handleBackPress = () => {
    setRedirectTo('/HomeScreen');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Especialidades</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <FlatList
          data={specialties}
          renderItem={renderSpecialty}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.specialtiesList}
        />
      </View>
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
  headerRight: {
    width: 34, // Para mantener el header centrado
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  specialtiesList: {
    paddingBottom: 20,
  },
  specialtyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  specialtyIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EDF1FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  specialtyInfo: {
    flex: 1,
  },
  specialtyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  specialtyDescription: {
    fontSize: 14,
    color: '#666',
  },
}); 