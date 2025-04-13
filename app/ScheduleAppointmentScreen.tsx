import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Tipo para la información del médico
type Doctor = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  availability: string[];
};

// Especialidades disponibles según el requerimiento
const SPECIALTIES = [
  { id: '1', name: 'Medicina general' },
  { id: '2', name: 'Pediatría' },
  { id: '3', name: 'Planificación familiar' },
  { id: '4', name: 'Odontología' },
  { id: '5', name: 'Optometría' },
];

// Datos de ejemplo de doctores
const DOCTORS: Doctor[] = [
  { 
    id: '1', 
    name: 'Dr. Carlos Rodríguez', 
    specialty: 'Medicina general',
    rating: 4.9,
    availability: ['2024-04-15 09:00', '2024-04-15 10:00', '2024-04-16 11:00'] 
  },
  { 
    id: '2', 
    name: 'Dra. María González', 
    specialty: 'Pediatría',
    rating: 4.8,
    availability: ['2024-04-14 14:00', '2024-04-15 15:00', '2024-04-16 10:00'] 
  },
  { 
    id: '3', 
    name: 'Dr. Jorge Martínez', 
    specialty: 'Odontología',
    rating: 4.7,
    availability: ['2024-04-13 09:30', '2024-04-14 11:30', '2024-04-15 14:30'] 
  },
  { 
    id: '4', 
    name: 'Dra. Ana López', 
    specialty: 'Optometría',
    rating: 4.6,
    availability: ['2024-04-14 10:00', '2024-04-15 11:00', '2024-04-16 12:00'] 
  },
  { 
    id: '5', 
    name: 'Dr. Luis Ramírez', 
    specialty: 'Planificación familiar',
    rating: 4.8,
    availability: ['2024-04-15 08:00', '2024-04-16 09:00', '2024-04-17 10:00'] 
  },
];

export default function ScheduleAppointmentScreen() {
  const params = useLocalSearchParams();
  const initialSpecialtyId = params.specialtyId as string;
  const initialDoctorId = params.doctorId as string;

  // Estados
  const [currentStep, setCurrentStep] = useState<'specialty' | 'doctor' | 'datetime'>(
    initialDoctorId ? 'datetime' : initialSpecialtyId ? 'doctor' : 'specialty'
  );
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>(initialSpecialtyId || '');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showSpecialtyPicker, setShowSpecialtyPicker] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // Inicializar la pantalla si llega con especialidad o médico seleccionado
  useEffect(() => {
    if (initialSpecialtyId) {
      setSelectedSpecialtyId(initialSpecialtyId);
      
      // Filtrar doctores por especialidad
      const specialty = SPECIALTIES.find(s => s.id === initialSpecialtyId)?.name || '';
      setAvailableDoctors(DOCTORS.filter(doctor => doctor.specialty === specialty));
    }
    
    if (initialDoctorId) {
      const doctor = DOCTORS.find(d => d.id === initialDoctorId);
      if (doctor) {
        setSelectedDoctor(doctor);
        setAvailableDates(doctor.availability);
        
        // Si tenemos un doctor directamente, también necesitamos obtener su especialidad
        const specialtyObj = SPECIALTIES.find(s => s.name === doctor.specialty);
        if (specialtyObj) {
          setSelectedSpecialtyId(specialtyObj.id);
        }
      }
    }
  }, [initialSpecialtyId, initialDoctorId]);

  // Actualizar doctores disponibles al cambiar la especialidad
  useEffect(() => {
    if (selectedSpecialtyId && currentStep === 'doctor') {
      const specialty = SPECIALTIES.find(s => s.id === selectedSpecialtyId)?.name || '';
      setAvailableDoctors(DOCTORS.filter(doctor => doctor.specialty === specialty));
    }
  }, [selectedSpecialtyId, currentStep]);

  // Actualizar fechas disponibles al seleccionar médico
  useEffect(() => {
    if (selectedDoctor && currentStep === 'datetime') {
      setAvailableDates(selectedDoctor.availability);
    }
  }, [selectedDoctor, currentStep]);

  const handleSpecialtySelect = (specialtyId: string) => {
    setSelectedSpecialtyId(specialtyId);
    setShowSpecialtyPicker(false);
    setCurrentStep('doctor');
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep('datetime');
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleConfirmAppointment = () => {
    // Aquí iría la lógica para guardar la cita
    alert('¡Cita agendada con éxito!');
    router.replace('/HomeScreen');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const renderSpecialtyStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Selecciona una especialidad</Text>
      
      <TouchableOpacity 
        style={styles.dropdownButton}
        onPress={() => setShowSpecialtyPicker(true)}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedSpecialtyId 
            ? SPECIALTIES.find(s => s.id === selectedSpecialtyId)?.name 
            : 'Seleccionar especialidad'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={showSpecialtyPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Seleccionar especialidad</Text>
              <TouchableOpacity onPress={() => setShowSpecialtyPicker(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={SPECIALTIES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.specialtyItem}
                  onPress={() => handleSpecialtySelect(item.id)}
                >
                  <Text style={styles.specialtyItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {selectedSpecialtyId && (
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => setCurrentStep('doctor')}
        >
          <Text style={styles.nextButtonText}>Continuar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderDoctorStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Selecciona un médico</Text>
      
      <ScrollView style={styles.doctorListContainer}>
        {availableDoctors.map(doctor => (
          <TouchableOpacity 
            key={doctor.id}
            style={[
              styles.doctorCard, 
              selectedDoctor?.id === doctor.id && styles.selectedDoctorCard
            ]}
            onPress={() => handleDoctorSelect(doctor)}
          >
            <View style={styles.doctorImageContainer}>
              <Image 
                source={require('../assets/Iconos/app-medica.png')} 
                style={styles.doctorImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{doctor.rating}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentStep('specialty')}
        >
          <Text style={styles.backButtonText}>Atrás</Text>
        </TouchableOpacity>
        {selectedDoctor && (
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={() => setCurrentStep('datetime')}
          >
            <Text style={styles.nextButtonText}>Continuar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderDateTimeStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Selecciona fecha y hora</Text>
      
      <ScrollView style={styles.dateListContainer}>
        {availableDates.map((dateString, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.dateCard, 
              selectedDate === dateString && styles.selectedDateCard
            ]}
            onPress={() => handleDateSelect(dateString)}
          >
            <Ionicons name="calendar-outline" size={20} color="#555" />
            <Text style={styles.dateText}>{formatDate(dateString)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentStep('doctor')}
        >
          <Text style={styles.backButtonText}>Atrás</Text>
        </TouchableOpacity>
        {selectedDate && (
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={handleConfirmAppointment}
          >
            <Text style={styles.confirmButtonText}>Confirmar cita</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'specialty':
        return renderSpecialtyStep();
      case 'doctor':
        return renderDoctorStep();
      case 'datetime':
        return renderDateTimeStep();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerBackButton} 
          onPress={() => router.back()}
        >
          <Image 
            source={require('../assets/Iconos/volver.png')} 
            style={{ width: 24, height: 24 }} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Cita</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.progressContainer}>
        <View style={[
          styles.progressStep, 
          currentStep === 'specialty' ? styles.activeStep : 
          (currentStep === 'doctor' || currentStep === 'datetime') ? styles.completedStep : {}
        ]} />
        <View style={[
          styles.progressLine, 
          (currentStep === 'doctor' || currentStep === 'datetime') ? styles.completedLine : {}
        ]} />
        <View style={[
          styles.progressStep, 
          currentStep === 'doctor' ? styles.activeStep : 
          currentStep === 'datetime' ? styles.completedStep : {}
        ]} />
        <View style={[
          styles.progressLine, 
          currentStep === 'datetime' ? styles.completedLine : {}
        ]} />
        <View style={[
          styles.progressStep, 
          currentStep === 'datetime' ? styles.activeStep : {}
        ]} />
      </View>

      <View style={styles.stepLabelContainer}>
        <Text style={[
          styles.stepLabel, 
          currentStep === 'specialty' ? styles.activeStepLabel : 
          (currentStep === 'doctor' || currentStep === 'datetime') ? styles.completedStepLabel : {}
        ]}>Especialidad</Text>
        <Text style={[
          styles.stepLabel, 
          currentStep === 'doctor' ? styles.activeStepLabel : 
          currentStep === 'datetime' ? styles.completedStepLabel : {}
        ]}>Médico</Text>
        <Text style={[
          styles.stepLabel, 
          currentStep === 'datetime' ? styles.activeStepLabel : {}
        ]}>Fecha y hora</Text>
      </View>

      {renderCurrentStep()}
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
  headerBackButton: {
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  progressStep: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
  activeStep: {
    backgroundColor: '#2D6CDF',
  },
  completedStep: {
    backgroundColor: '#65B741',
  },
  progressLine: {
    flex: 1,
    height: 3,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  completedLine: {
    backgroundColor: '#65B741',
  },
  stepLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  stepLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    width: '30%',
  },
  activeStepLabel: {
    color: '#2D6CDF',
    fontWeight: 'bold',
  },
  completedStepLabel: {
    color: '#65B741',
    fontWeight: 'bold',
  },
  stepContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  dropdownButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    height: '60%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  specialtyItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  specialtyItemText: {
    fontSize: 16,
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#2D6CDF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 'auto',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  doctorListContainer: {
    marginBottom: 20,
  },
  doctorCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedDoctorCard: {
    borderWidth: 2,
    borderColor: '#2D6CDF',
  },
  doctorImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  doctorImage: {
    width: 40,
    height: 40,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  doctorSpecialty: {
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    flex: 0.48,
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateListContainer: {
    marginBottom: 20,
  },
  dateCard: {
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
  selectedDateCard: {
    borderWidth: 2,
    borderColor: '#2D6CDF',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: '#65B741',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    flex: 0.48,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 