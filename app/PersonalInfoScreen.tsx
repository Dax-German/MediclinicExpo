import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Tipo para la información personal
type PersonalInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  documentType: string;
  documentNumber: string;
  gender: string;
  bloodType: string;
  allergies: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
};

export default function PersonalInfoScreen() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: 'Juan García',
    email: 'juangarcia@gmail.com',
    phone: '3001234567',
    address: 'Calle 123 #45-67, Bogotá',
    birthDate: '15/01/1990',
    documentType: 'Cédula de Ciudadanía',
    documentNumber: '1023456789',
    gender: 'Masculino',
    bloodType: 'O+',
    allergies: ['Penicilina', 'Nueces'],
    emergencyContact: {
      name: 'María López',
      relation: 'Esposa',
      phone: '3009876543'
    }
  });
  
  // Cargar datos del perfil al iniciar
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Intentar cargar datos del usuario autenticado primero
        const userJson = await AsyncStorage.getItem('@MediClinic:user');
        
        if (userJson) {
          const userData = JSON.parse(userJson);
          
          // Actualizar información personal con datos del usuario
          setPersonalInfo(prevInfo => ({
            ...prevInfo,
            name: userData.firstName && userData.lastName ? 
              `${userData.firstName} ${userData.lastName}` : 
              userData.name || prevInfo.name,
            email: userData.email || prevInfo.email,
            phone: userData.phone || prevInfo.phone,
            address: userData.address || prevInfo.address,
            documentType: userData.documentType || prevInfo.documentType,
            documentNumber: userData.documentNumber || prevInfo.documentNumber,
            gender: userData.gender || prevInfo.gender,
          }));
          
          return; // Salir temprano si encontramos datos de usuario
        }
        
        // Compatibilidad con método anterior (claves separadas)
        const savedName = await AsyncStorage.getItem('@MediClinic:profileName');
        const savedEmail = await AsyncStorage.getItem('@MediClinic:profileEmail');
        const savedPhone = await AsyncStorage.getItem('@MediClinic:profilePhone');
        const savedAddress = await AsyncStorage.getItem('@MediClinic:profileAddress');
        const savedBirthDate = await AsyncStorage.getItem('@MediClinic:profileBirthDate');
        
        // Actualizar el estado con los datos guardados
        setPersonalInfo(prevInfo => ({
          ...prevInfo,
          name: savedName || prevInfo.name,
          email: savedEmail || prevInfo.email,
          phone: savedPhone || prevInfo.phone,
          address: savedAddress || prevInfo.address,
          birthDate: savedBirthDate || prevInfo.birthDate,
        }));
      } catch (error) {
        console.error('Error al cargar datos del perfil:', error);
      }
    };
    
    loadProfileData();
  }, []);
  
  // Si hay una redirección pendiente, realizarla
  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }

  const handleBackPress = () => {
    setRedirectTo('/ProfileScreen');
  };

  // Función para renderizar un campo de información
  const renderInfoField = (label: string, value: string | string[]) => {
    let displayValue = value;
    
    // Si es un array, mostrarlo como lista
    if (Array.isArray(value)) {
      displayValue = value.join(', ');
    }
    
    return (
      <View style={styles.infoField}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{displayValue}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Ocultar el título de navegación nativo */}
      <Stack.Screen options={{ 
        headerShown: false 
      }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Información Personal</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoContainer}>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Datos Personales</Text>
            {renderInfoField('Nombre completo', personalInfo.name)}
            {renderInfoField('Correo electrónico', personalInfo.email)}
            {renderInfoField('Teléfono', personalInfo.phone)}
            {renderInfoField('Dirección', personalInfo.address)}
            {renderInfoField('Fecha de nacimiento', personalInfo.birthDate)}
            {renderInfoField('Género', personalInfo.gender)}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Identificación</Text>
            {renderInfoField('Tipo de documento', personalInfo.documentType)}
            {renderInfoField('Número de documento', personalInfo.documentNumber)}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Información Médica</Text>
            {renderInfoField('Grupo sanguíneo', personalInfo.bloodType)}
            {renderInfoField('Alergias', personalInfo.allergies)}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Contacto de Emergencia</Text>
            {renderInfoField('Nombre', personalInfo.emergencyContact.name)}
            {renderInfoField('Relación', personalInfo.emergencyContact.relation)}
            {renderInfoField('Teléfono', personalInfo.emergencyContact.phone)}
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoField: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
}); 