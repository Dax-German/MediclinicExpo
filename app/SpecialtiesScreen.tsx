import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Specialty = {
  id: string;
  name: string;
  icon: IconName;
  description: string;
};

export default function SpecialtiesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // Si hay una redirección pendiente, realizarla
  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }

  const specialties: Specialty[] = [
    {
      id: '1',
      name: 'Cardiología',
      icon: 'heart-outline',
      description: 'Especialidad médica que se ocupa del diagnóstico y tratamiento de las enfermedades del corazón.',
    },
    {
      id: '2',
      name: 'Dermatología',
      icon: 'body-outline',
      description: 'Especialidad médica encargada del estudio de la piel, su estructura, función y enfermedades.',
    },
    {
      id: '3',
      name: 'Pediatría',
      icon: 'people-outline',
      description: 'Rama de la medicina que se especializa en la salud y enfermedades de los niños.',
    },
    {
      id: '4',
      name: 'Traumatología',
      icon: 'fitness-outline',
      description: 'Especialidad médica que trata lesiones del sistema músculo-esquelético.',
    },
    {
      id: '5',
      name: 'Oftalmología',
      icon: 'eye-outline',
      description: 'Especialidad médica que estudia y trata las enfermedades de los ojos.',
    },
    {
      id: '6',
      name: 'Neurología',
      icon: 'medical-outline',
      description: 'Especialidad médica que trata los trastornos del sistema nervioso.',
    },
    {
      id: '7',
      name: 'Odontología',
      icon: 'medical-outline',
      description: 'Especialidad que se ocupa del diagnóstico, tratamiento y prevención de enfermedades bucales.',
    },
    {
      id: '8',
      name: 'Ginecología',
      icon: 'woman-outline',
      description: 'Especialidad médica de la medicina que se ocupa del sistema reproductor femenino.',
    },
  ];

  const filteredSpecialties = searchQuery
    ? specialties.filter(specialty => 
        specialty.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : specialties;

  const renderSpecialty = ({ item }: { item: Specialty }) => (
    <View style={styles.specialtyCard}>
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
    </View>
  );

  const handleScheduleAppointment = () => {
    setRedirectTo('/ScheduleAppointmentScreen?fromScreen=specialties');
  };

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
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar especialidad"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredSpecialties}
          renderItem={renderSpecialty}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.specialtiesList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={50} color="#ccc" />
              <Text style={styles.emptyStateText}>
                No se encontraron especialidades
              </Text>
            </View>
          }
        />
      </View>

      {/* Botón flotante para agendar cita */}
      <TouchableOpacity style={styles.floatingButton} onPress={handleScheduleAppointment}>
        <Ionicons name="calendar" size={24} color="white" />
        <Text style={styles.floatingButtonText}>Agendar Cita</Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#777',
    marginTop: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2D6CDF',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  floatingButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 