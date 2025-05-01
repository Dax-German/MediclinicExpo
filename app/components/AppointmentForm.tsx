import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import apiServices from '../../src/api/services';

// Definimos los tipos localmente
interface Appointment {
  id: string;
  specialtyId?: string;
  doctorId?: string;
  date?: string;
  time?: string;
  status?: string;
}

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty?: string;
  rating?: number;
}

interface Specialty {
  id: string;
  name: string;
  description?: string;
}

interface AppointmentFormProps {
  initialSpecialtyId?: string;
  initialDoctorId?: string;
  appointmentId?: string;
  onComplete?: () => void;
  skipToDateTime?: boolean;
  onStepChange?: (step: 'specialty' | 'appointmentType' | 'doctor' | 'datetime') => void;
}

const AppointmentForm = ({
  initialSpecialtyId,
  initialDoctorId,
  appointmentId,
  onComplete,
  skipToDateTime = false,
  onStepChange
}: AppointmentFormProps) => {
  const router = useRouter();
  
  // Estados para el flujo del formulario
  const [currentStep, setCurrentStep] = useState<'specialty' | 'appointmentType' | 'doctor' | 'datetime'>(
    skipToDateTime ? 'datetime' : 
    initialDoctorId ? 'datetime' : 
    initialSpecialtyId ? 'appointmentType' : 
    'specialty'
  );

  // Estados para selecciones
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>(initialSpecialtyId || '');
  const [selectedAppointmentTypeId, setSelectedAppointmentTypeId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctorId || '');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Estados para datos
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [existingAppointment, setExistingAppointment] = useState<Appointment | null>(null);
  
  // Estados auxiliares
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
    // Notificar el paso inicial
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, []);

  // Cargar datos cuando cambia la especialidad
  useEffect(() => {
    if (selectedSpecialtyId) {
      loadAppointmentTypes();
      if (currentStep === 'doctor') {
        loadDoctorsBySpecialty();
      }
    }
  }, [selectedSpecialtyId, currentStep]);

  // Cargar datos cuando cambia el doctor
  useEffect(() => {
    if (selectedDoctorId && currentStep === 'datetime') {
      loadAvailableTimes();
    }
  }, [selectedDoctorId, currentStep, selectedDate]);

  // Cargar datos existentes para reprogramación
  useEffect(() => {
    if (appointmentId) {
      loadExistingAppointment();
    }
  }, [appointmentId]);

  // Funciones para cargar datos
  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Cargar especialidades
      const specialtiesResponse = await apiServices.specialties.getAllSpecialties();
      setSpecialties(specialtiesResponse.items || []);
      
      // Si hay una especialidad seleccionada inicialmente, cargar sus datos
      if (initialSpecialtyId) {
        setSelectedSpecialtyId(initialSpecialtyId);
      }
      
      // Si hay un doctor seleccionado inicialmente, cargar sus datos
      if (initialDoctorId) {
        setSelectedDoctorId(initialDoctorId);
      }
    } catch (err) {
      console.error('Error al cargar datos iniciales:', err);
      setError('No se pudieron cargar los datos. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadExistingAppointment = async () => {
    if (!appointmentId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const appointment = await apiServices.appointments.getAppointmentDetails(appointmentId);
      if (appointment) {
        setExistingAppointment(appointment);
        setSelectedSpecialtyId(appointment.specialtyId);
        setSelectedDoctorId(appointment.doctorId);
        
        // Para reprogramación, extraer la fecha y hora de la cita existente
        if (appointment.date) {
          const dateObj = new Date(appointment.date);
          // Formatear la fecha como YYYY-MM-DD
          const formattedDate = dateObj.toISOString().split('T')[0];
          setSelectedDate(formattedDate);
        }
      }
    } catch (err) {
      console.error('Error al cargar cita existente:', err);
      setError('No se pudo cargar la información de la cita.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAppointmentTypes = async () => {
    if (!selectedSpecialtyId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Obtener tipos de cita para la especialidad seleccionada
      const response = await apiServices.appointmentTypes.getAppointmentTypesBySpecialty(
        parseInt(selectedSpecialtyId, 10)
      );
      setAppointmentTypes(response.items || []);
    } catch (err) {
      console.error('Error al cargar tipos de cita:', err);
      setError('No se pudieron cargar los tipos de cita.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDoctorsBySpecialty = async () => {
    if (!selectedSpecialtyId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Obtener doctores por especialidad
      const response = await apiServices.specialties.getDoctorsBySpecialty(
        selectedSpecialtyId,
        { limit: 20 }
      );
      // Convertir a nuestro tipo Doctor local
      const doctorsData = (response.items || []).map(doc => ({
        id: doc.id,
        firstName: doc.firstName,
        lastName: doc.lastName,
        specialty: typeof doc.specialty === 'string' ? doc.specialty : doc.specialty?.name,
        rating: doc.rating
      }));
      setDoctors(doctorsData);
    } catch (err) {
      console.error('Error al cargar doctores:', err);
      setError('No se pudieron cargar los doctores disponibles.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableTimes = async () => {
    if (!selectedDoctorId || !selectedDate) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Obtener horarios disponibles para el doctor y la fecha seleccionados
      const slots = await apiServices.doctors.getAvailability(
        selectedDoctorId,
        selectedDate
      );
      setAvailableTimes(slots || []);
    } catch (err) {
      console.error('Error al cargar horarios disponibles:', err);
      setError('No se pudieron cargar los horarios disponibles.');
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones para manejar selecciones de usuario
  const handleSpecialtySelect = (id: string) => {
    setSelectedSpecialtyId(id);
    setSelectedAppointmentTypeId('');
    setSelectedDoctorId('');
    setCurrentStep('appointmentType');
    if (onStepChange) onStepChange('appointmentType');
  };

  const handleAppointmentTypeSelect = (id: string) => {
    setSelectedAppointmentTypeId(id);
    setCurrentStep('doctor');
    if (onStepChange) onStepChange('doctor');
  };

  const handleDoctorSelect = (id: string) => {
    setSelectedDoctorId(id);
    setCurrentStep('datetime');
    if (onStepChange) onStepChange('datetime');
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    loadAvailableTimes();
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // Función para confirmar y guardar la cita
  const handleConfirmAppointment = async () => {
    if (!selectedSpecialtyId || !selectedDoctorId || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Formatear la fecha y hora para la API
      const appointmentDateTime = `${selectedDate}T${selectedTime}:00`;
      
      let result;
      
      if (appointmentId && existingAppointment) {
        // Reprogramar cita existente
        result = await apiServices.appointments.rescheduleAppointment(
          appointmentId,
          {
            date: appointmentDateTime,
            reason: 'Reprogramación solicitada por el paciente'
          }
        );
        Alert.alert('Éxito', 'Cita reprogramada correctamente');
      } else {
        // Crear nueva cita
        result = await apiServices.appointments.createAppointment({
          specialtyId: selectedSpecialtyId,
          doctorId: selectedDoctorId,
          date: appointmentDateTime,
          appointmentTypeId: selectedAppointmentTypeId,
          notes: ''
        });
        Alert.alert('Éxito', 'Cita programada correctamente');
      }
      
      // Navegar a la pantalla de citas o ejecutar callback
      if (onComplete) {
        onComplete();
      } else {
        router.replace('/AppointmentsScreen');
      }
    } catch (err) {
      console.error('Error al programar cita:', err);
      setError('No se pudo programar la cita. Intente nuevamente.');
      Alert.alert('Error', 'No se pudo programar la cita. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para volver al paso anterior
  const handleBack = () => {
    if (currentStep === 'datetime') {
      setCurrentStep('doctor');
    } else if (currentStep === 'doctor') {
      setCurrentStep('appointmentType');
    } else if (currentStep === 'appointmentType') {
      setCurrentStep('specialty');
    } else {
      // Si estamos en el primer paso, volver a la pantalla anterior
      router.back();
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return date.toLocaleDateString('es-ES', options);
    } catch (error) {
      return dateString;
    }
  };

  // Renderizado de los pasos del formulario
  const renderSpecialtyStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Selecciona especialidad</Text>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#2D6CDF" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadInitialData}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.optionsContainer}>
          {specialties.map((specialty) => (
            <TouchableOpacity
              key={specialty.id}
              style={[
                styles.optionCard,
                selectedSpecialtyId === specialty.id && styles.selectedOptionCard
              ]}
              onPress={() => handleSpecialtySelect(specialty.id)}
            >
              <Text style={styles.optionTitle}>{specialty.name}</Text>
              {specialty.description && (
                <Text style={styles.optionDescription}>{specialty.description}</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderAppointmentTypeStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepSubtitle}>Selecciona tipo de cita</Text>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#2D6CDF" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se pudieron cargar los datos. Intente nuevamente.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadAppointmentTypes}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.appointmentTypeContent}>
          {/* Dropdown para seleccionar tipo de cita */}
          <TouchableOpacity style={styles.dropdownSelector}>
            <Text style={styles.dropdownText}>Seleccionar tipo de cita</Text>
            <Ionicons name="chevron-down-outline" size={20} color="#666" />
          </TouchableOpacity>

          {/* Mensaje de error si es necesario */}
          {appointmentTypes.length === 0 && (
            <View style={styles.inlineErrorContainer}>
              <Text style={styles.inlineErrorText}>
                No se pudieron cargar los datos. Intente nuevamente.
              </Text>
              <TouchableOpacity 
                style={styles.retryButtonSmall}
                onPress={loadAppointmentTypes}
              >
                <Text style={styles.retryButtonTextSmall}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Opciones de tipos de cita (ocultas en la interfaz final) */}
          <ScrollView style={{display: 'none'}}>
            {appointmentTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.optionCard,
                  selectedAppointmentTypeId === type.id && styles.selectedOptionCard
                ]}
                onPress={() => handleAppointmentTypeSelect(type.id)}
              >
                <Text style={styles.optionTitle}>{type.name}</Text>
                {type.description && (
                  <Text style={styles.optionDescription}>{type.description}</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Botón para continuar (para simulación) */}
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => handleAppointmentTypeSelect('1')} // Simulamos selección
          >
            <Text style={styles.continueButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderDoctorStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Selecciona médico</Text>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#2D6CDF" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadDoctorsBySpecialty}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.optionsContainer}>
          {doctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              style={[
                styles.optionCard,
                selectedDoctorId === doctor.id && styles.selectedOptionCard
              ]}
              onPress={() => handleDoctorSelect(doctor.id)}
            >
              <Text style={styles.optionTitle}>
                Dr. {doctor.firstName} {doctor.lastName}
              </Text>
              {doctor.rating !== undefined && (
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= (doctor.rating || 0) ? 'star' : 'star-outline'}
                      size={16}
                      color="#FFD700"
                    />
                  ))}
                  <Text style={styles.ratingText}>{(doctor.rating || 0).toFixed(1)}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderDateTimeStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Selecciona fecha y hora</Text>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#2D6CDF" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadAvailableTimes}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.dateTimeContainer}>
          {/* Selector de fecha */}
          <Text style={styles.sectionTitle}>Fecha</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
            {/* Generar fechas de ejemplo (en producción usar datos reales) */}
            {Array.from({ length: 10 }).map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() + index);
              const dateString = date.toISOString().split('T')[0];
              return (
                <TouchableOpacity
                  key={dateString}
                  style={[
                    styles.dateCard,
                    selectedDate === dateString && styles.selectedDateCard
                  ]}
                  onPress={() => handleDateSelect(dateString)}
                >
                  <Text style={styles.dateDay}>{date.getDate()}</Text>
                  <Text style={styles.dateMonth}>
                    {date.toLocaleDateString('es-ES', { month: 'short' })}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          
          {/* Selector de hora */}
          {selectedDate && (
            <>
              <Text style={styles.sectionTitle}>Hora</Text>
              <View style={styles.timeGrid}>
                {availableTimes.length > 0 ? (
                  availableTimes.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeCard,
                        selectedTime === time && styles.selectedTimeCard
                      ]}
                      onPress={() => handleTimeSelect(time)}
                    >
                      <Text 
                        style={[
                          styles.timeText,
                          selectedTime === time && styles.selectedTimeText
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noTimesText}>
                    No hay horarios disponibles para esta fecha
                  </Text>
                )}
              </View>
            </>
          )}
          
          {/* Botón de confirmación */}
          {selectedDate && selectedTime && (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmAppointment}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.confirmButtonText}>
                  {appointmentId ? 'Reprogramar Cita' : 'Confirmar Cita'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  // Renderizar el paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'specialty':
        return renderSpecialtyStep();
      case 'appointmentType':
        return renderAppointmentTypeStep();
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
      {/* Barra de progreso */}
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            currentStep === 'specialty' && { width: '25%' },
            currentStep === 'appointmentType' && { width: '50%' },
            currentStep === 'doctor' && { width: '75%' },
            currentStep === 'datetime' && { width: '100%' }
          ]}
        />
      </View>
      
      {/* Botón para volver atrás */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      
      {/* Contenido del paso actual */}
      {renderCurrentStep()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2D6CDF',
    width: '25%',
  },
  backButton: {
    padding: 15,
  },
  stepContainer: {
    flex: 1,
    padding: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  stepSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  optionsContainer: {
    flex: 1,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOptionCard: {
    borderColor: '#2D6CDF',
    backgroundColor: '#EDF1FA',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  optionDetail: {
    fontSize: 14,
    color: '#2D6CDF',
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 5,
    color: '#666',
  },
  dateTimeContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 20,
  },
  dateScroll: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dateCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: 70,
  },
  selectedDateCard: {
    borderColor: '#2D6CDF',
    backgroundColor: '#EDF1FA',
  },
  dateDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dateMonth: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  timeCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    margin: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '30%',
    alignItems: 'center',
  },
  selectedTimeCard: {
    borderColor: '#2D6CDF',
    backgroundColor: '#2D6CDF',
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTimeText: {
    color: 'white',
  },
  noTimesText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  confirmButton: {
    backgroundColor: '#2D6CDF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  appointmentTypeContent: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  dropdownSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  dropdownText: {
    fontSize: 16,
    color: '#666',
  },
  inlineErrorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  inlineErrorText: {
    color: '#D32F2F',
    marginBottom: 10,
  },
  retryButtonSmall: {
    alignSelf: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  retryButtonTextSmall: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: '#2D6CDF',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AppointmentForm; 