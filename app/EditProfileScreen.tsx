import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function EditProfileScreen() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  
  // Estado para los campos del formulario
  const [name, setName] = useState('Juan García');
  const [email, setEmail] = useState('juangarcia@gmail.com');
  const [phoneNumber, setPhoneNumber] = useState('3001234567');
  const [address, setAddress] = useState('Calle 123 #45-67');
  const [birthDate, setBirthDate] = useState('1990-01-15');
  
  // Datos de contacto de emergencia (solo lectura)
  const [emergencyContactName, setEmergencyContactName] = useState('María López');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('Esposa');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('3009876543');
  
  // Cargar datos del perfil
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const savedName = await AsyncStorage.getItem('@MediClinic:profileName');
        const savedEmail = await AsyncStorage.getItem('@MediClinic:profileEmail');
        const savedPhone = await AsyncStorage.getItem('@MediClinic:profilePhone');
        const savedAddress = await AsyncStorage.getItem('@MediClinic:profileAddress');
        const savedBirthDate = await AsyncStorage.getItem('@MediClinic:profileBirthDate');
        const savedEmergencyName = await AsyncStorage.getItem('@MediClinic:emergencyContactName');
        const savedEmergencyRelation = await AsyncStorage.getItem('@MediClinic:emergencyContactRelation');
        const savedEmergencyPhone = await AsyncStorage.getItem('@MediClinic:emergencyContactPhone');
        
        if (savedName) setName(savedName);
        if (savedEmail) setEmail(savedEmail);
        if (savedPhone) setPhoneNumber(savedPhone);
        if (savedAddress) setAddress(savedAddress);
        if (savedBirthDate) setBirthDate(savedBirthDate);
        if (savedEmergencyName) setEmergencyContactName(savedEmergencyName);
        if (savedEmergencyRelation) setEmergencyContactRelation(savedEmergencyRelation);
        if (savedEmergencyPhone) setEmergencyContactPhone(savedEmergencyPhone);
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

  const handleSaveChanges = async () => {
    try {
      // Guardar solo los datos que se pueden editar en AsyncStorage
      await AsyncStorage.setItem('@MediClinic:profilePhone', phoneNumber);
      await AsyncStorage.setItem('@MediClinic:profileAddress', address);
      
      Alert.alert(
        'Cambios guardados',
        'Los cambios han sido guardados correctamente.',
        [
          { text: 'OK', onPress: () => setRedirectTo('/ProfileScreen') }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudieron guardar los cambios. Intente nuevamente.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen options={{ 
        headerShown: false 
      }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.content}>
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre completo</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={name}
                editable={false}
                placeholder="Nombre completo"
              />
              <Text style={styles.disabledFieldHint}>Este campo no se puede editar</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Correo electrónico</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={email}
                editable={false}
                placeholder="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Text style={styles.disabledFieldHint}>Este campo no se puede editar</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Número de teléfono</Text>
              <TextInput
                style={styles.textInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Número de teléfono"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dirección</Text>
              <TextInput
                style={styles.textInput}
                value={address}
                onChangeText={setAddress}
                placeholder="Dirección"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fecha de nacimiento</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={birthDate}
                editable={false}
                placeholder="AAAA-MM-DD"
              />
              <Text style={styles.disabledFieldHint}>Este campo no se puede editar</Text>
            </View>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Contacto de Emergencia</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={emergencyContactName}
                editable={false}
                placeholder="Nombre del contacto"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Relación</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={emergencyContactRelation}
                editable={false}
                placeholder="Relación con el contacto"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Teléfono</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={emergencyContactPhone}
                editable={false}
                placeholder="Teléfono del contacto"
              />
            </View>
            
            <Text style={styles.emergencyContactNote}>
              Para modificar el contacto de emergencia, por favor comuníquese con servicio al cliente.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleBackPress}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveChanges}
          >
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#777',
  },
  disabledFieldHint: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    fontStyle: 'italic',
  },
  emergencyContactNote: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    flex: 0.48,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#2D6CDF',
    borderRadius: 8,
    padding: 15,
    flex: 0.48,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
}); 