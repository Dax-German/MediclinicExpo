import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  const [appointmentTypesError, setAppointmentTypesError] = useState<string | null>(null);

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

  // Crear un tipo de cita específico para mostrar los tipos predefinidos
  const getPresetAppointmentTypes = (specialtyName: string = '', specialtyId?: string): any[] => {
    // Por defecto, usar texto vacío si no hay nombre de especialidad
    const lowerName = (specialtyName || '').toLowerCase();
    // Obtener el ID como string para comparar
    const id = specialtyId || '';
    
    console.log(`Generando tipos predefinidos para especialidad: "${specialtyName}" (ID: ${id})`);
    
    // Usar tanto el ID como el nombre para determinar la especialidad
    // Odontología
    if (id === '4' || lowerName.includes('odonto') || lowerName.includes('dental')) {
      console.log(`Usando tipos de cita para ODONTOLOGÍA`);
      return [
        { 
          id: 'dental-general', 
          name: 'Consulta odontológica general', 
          description: 'Evaluación dental general y plan de tratamiento', 
          durationMinutes: 40,
          isGeneral: true 
        },
        { 
          id: 'cordales', 
          name: 'Cirugía de cordales', 
          description: 'Extracción de muelas del juicio o cordales', 
          durationMinutes: 60 
        }
      ];
    } 
    // Oftalmología
    else if (id === '5' || lowerName.includes('oft') || lowerName.includes('optom') || lowerName.includes('ocul')) {
      console.log(`Usando tipos de cita para OFTALMOLOGÍA`);
      return [
        { 
          id: 'eye-general', 
          name: 'Consulta oftalmológica general', 
          description: 'Evaluación visual completa', 
          durationMinutes: 60,
          isGeneral: true
        },
        { 
          id: 'oftalmoscopia', 
          name: 'Oftalmoscopia', 
          description: 'Examen detallado del fondo de ojo', 
          durationMinutes: 30 
        }
      ];
    } 
    // Medicina general
    else if (id === '1' || lowerName.includes('general') || lowerName.includes('medicina')) {
      console.log(`Usando tipos de cita para MEDICINA GENERAL`);
      return [
        { 
          id: 'general-consult', 
          name: 'Consulta general', 
          description: 'Consulta médica de rutina', 
          durationMinutes: 30,
          isGeneral: true
        },
        { 
          id: 'blood-test', 
          name: 'Examen de sangre', 
          description: 'Toma de muestras para análisis', 
          durationMinutes: 15 
        }
      ];
    } 
    // Pediatría
    else if (id === '2' || lowerName.includes('pediatr') || lowerName.includes('niñ') || lowerName.includes('infant')) {
      console.log(`Usando tipos de cita para PEDIATRÍA`);
      return [
        { 
          id: 'pediatric-general', 
          name: 'Consulta pediátrica', 
          description: 'Evaluación general de salud pediátrica', 
          durationMinutes: 30,
          isGeneral: true
        },
        { 
          id: 'pediatric-vaccine', 
          name: 'Vacunación', 
          description: 'Administración de vacunas programadas', 
          durationMinutes: 15
        }
      ];
    } 
    // Planificación familiar
    else if (id === '3' || lowerName.includes('planifica') || lowerName.includes('familiar')) {
      console.log(`Usando tipos de cita para PLANIFICACIÓN`);
      return [
        {
          id: 'planning-consult',
          name: 'Consulta de planificación',
          description: 'Asesoramiento sobre planificación familiar',
          durationMinutes: 45,
          isGeneral: true
        }
      ];
    } 
    // Para cualquier otra especialidad
    else {
      console.log(`Usando tipos de cita GENÉRICOS`);
      return [
        { 
          id: 'general-consult', 
          name: 'Consulta médica', 
          description: 'Consulta médica general', 
          durationMinutes: 30,
          isGeneral: true
        },
        { 
          id: 'followup', 
          name: 'Consulta de seguimiento', 
          description: 'Revisión médica de seguimiento', 
          durationMinutes: 20 
        }
      ];
    }
  };

  const loadAppointmentTypes = async () => {
    if (!selectedSpecialtyId) return;
    
    setIsLoading(true);
    setError(null);
    setAppointmentTypesError(null);
    
    // Obtener la especialidad seleccionada para mostrar tipos predefinidos si es necesario
    const selectedSpecialty = specialties.find(s => s.id === selectedSpecialtyId);
    console.log(`Especialidad seleccionada:`, selectedSpecialty);
    
    try {
      // Intentar obtener tipos de cita desde la API 
      console.log(`Cargando tipos de cita para especialidad ${selectedSpecialtyId}`);
      
      const response = await apiServices.appointmentTypes.getAppointmentTypesBySpecialty(
        selectedSpecialtyId
      );
      
      console.log('Respuesta API tipos de cita:', response);
      
      if (response && response.items && response.items.length > 0) {
        setAppointmentTypes(response.items);
        console.log(`Se encontraron ${response.items.length} tipos de cita en la API`);
      } else {
        console.log('No se encontraron tipos de cita en la API, cargando predefinidos');
        // Si no hay tipos de cita, cargar los predefinidos
        const backupTypes = getPresetAppointmentTypes(selectedSpecialty?.name, selectedSpecialtyId);
        setAppointmentTypes(backupTypes);
        
        if (backupTypes.length === 0) {
          setAppointmentTypesError('No hay tipos de cita disponibles para esta especialidad');
        } else {
          console.log(`Cargados ${backupTypes.length} tipos predefinidos`);
          // No mostramos error si tenemos tipos predefinidos
          setAppointmentTypesError(null);
        }
      }
    } catch (err: any) {
      console.error(`Error al cargar tipos de cita para especialidad ${selectedSpecialtyId}:`, err);
      
      // Cargar tipos predefinidos como respaldo basados en la especialidad
      console.log('Cargando tipos predefinidos debido al error');
      const predefinedTypes = getPresetAppointmentTypes(selectedSpecialty?.name, selectedSpecialtyId);
      setAppointmentTypes(predefinedTypes);
      
      if (predefinedTypes.length > 0) {
        // No mostramos error si tenemos tipos predefinidos
        setAppointmentTypesError(null);
        console.log(`Cargados ${predefinedTypes.length} tipos predefinidos por error`);
      } else {
        if (err.status === 404) {
          setAppointmentTypesError('No hay tipos de cita disponibles para esta especialidad');
        } else {
          setAppointmentTypesError('No se pudieron cargar los tipos de cita');
        }
      }
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
    if (!selectedDoctorId || !selectedDate) {
      console.log('Falta información necesaria para cargar horarios');
      console.log(`Doctor: ${selectedDoctorId}, Fecha: ${selectedDate}`);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Obtener horarios disponibles para el doctor en la fecha seleccionada
      console.log(`Cargando horarios para doctor ${selectedDoctorId}, fecha ${selectedDate}`);
      
      // Usar el servicio de doctores para obtener disponibilidad
      const slots = await apiServices.doctors.getAvailability(
        selectedDoctorId,
        selectedDate
      );
      
      setAvailableTimes(slots || []);
      console.log(`Horarios cargados: ${slots ? slots.length : 0}`);
    } catch (err) {
      console.error('Error al cargar horarios disponibles:', err);
      setError('No se pudieron cargar los horarios disponibles.');
      
      // Usar horas de ejemplo como fallback en caso de error (solo para desarrollo)
      const mockTimes = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      setAvailableTimes(mockTimes);
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
    // Cargar los doctores inmediatamente después de seleccionar el tipo de cita
    loadDoctorsBySpecialty();
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
    
    // Formatear la fecha y hora para la API
    const appointmentDateTime = `${selectedDate}T${selectedTime}:00`;
    
    // Si es una reprogramación, solicitar confirmación
    if (appointmentId && existingAppointment) {
      Alert.alert(
        "Confirmar reprogramación",
        "¿Está seguro que desea reprogramar esta cita?",
        [
          {
            text: "Cancelar",
            style: "cancel"
          },
          {
            text: "Confirmar",
            style: "default",
            onPress: async () => {
              await processAppointment(appointmentDateTime);
            }
          }
        ]
      );
    } else {
      // Si es una nueva cita, procesar directamente
      await processAppointment(appointmentDateTime);
    }
  };

  // Procesar la creación o reprogramación de la cita
  const processAppointment = async (appointmentDateTime: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
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
      console.error('Error al procesar cita:', err);
      setError('No se pudo procesar la cita. Intente nuevamente.');
      Alert.alert('Error', 'No se pudo procesar la cita. Intente nuevamente.');
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

  const renderAppointmentTypeStep = () => {
    // Asegurarse de que tengamos tipos de cita para mostrar, ya sea de la API o predefinidos
    const hasAppointmentTypes = appointmentTypes && appointmentTypes.length > 0;
    
    // Obtener especialidad seleccionada para mostrar en mensaje de error
    const selectedSpecialty = specialties.find(s => s.id === selectedSpecialtyId);
    const specialtyName = selectedSpecialty?.name || 'la especialidad seleccionada';
    
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Seleccione el tipo de cita</Text>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2D6CDF" />
          </View>
        ) : appointmentTypesError && !hasAppointmentTypes ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorMessage}>
              No se encontraron tipos de cita para {specialtyName}
            </Text>
            <TouchableOpacity 
              style={styles.errorButton}
              onPress={() => {
                setCurrentStep('specialty');
                if (onStepChange) onStepChange('specialty');
              }}
            >
              <Text style={styles.errorButtonText}>Seleccionar otra especialidad</Text>
            </TouchableOpacity>
          </View>
        ) : !hasAppointmentTypes ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorMessage}>No hay tipos de cita disponibles</Text>
            <TouchableOpacity 
              style={styles.errorButton}
              onPress={() => {
                setCurrentStep('specialty');
                if (onStepChange) onStepChange('specialty');
              }}
            >
              <Text style={styles.errorButtonText}>Volver a especialidades</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Usamos FlatList en lugar de ScrollView para evitar el error de anidamiento
          <FlatList
            data={appointmentTypes}
            renderItem={({item: type}) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.cardContainer,
                  selectedAppointmentTypeId === type.id && styles.cardContainerSelected
                ]}
                onPress={() => handleAppointmentTypeSelect(type.id)}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle}>{type.name}</Text>
                    <Text style={styles.durationText}>
                      {type.durationMinutes} min
                    </Text>
                  </View>
                  
                  {type.description && (
                    <Text style={styles.cardDescription}>{type.description}</Text>
                  )}
                  
                  <View style={styles.cardTags}>
                    {type.isGeneral && (
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>General</Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <Ionicons
                  name={selectedAppointmentTypeId === type.id ? "checkmark-circle" : "chevron-forward-outline"}
                  size={24}
                  color={selectedAppointmentTypeId === type.id ? "#4CAF50" : "#cccccc"}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{paddingBottom: 20}}
          />
        )}
        
        <View style={styles.navigationContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              setCurrentStep('specialty');
              if (onStepChange) onStepChange('specialty');
            }}
          >
            <Ionicons name="arrow-back-outline" size={20} color="#2D6CDF" />
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.nextButton,
              (!selectedAppointmentTypeId) && styles.nextButtonDisabled
            ]}
            disabled={!selectedAppointmentTypeId}
            onPress={() => {
              setCurrentStep('doctor');
              if (onStepChange) onStepChange('doctor');
            }}
          >
            <Text style={styles.nextButtonText}>Siguiente</Text>
            <Ionicons name="arrow-forward-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
                <View style={styles.doctorRating}>
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
        <View style={styles.dateSection}>
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
  },
  stepContainer: {
    flex: 1,
    padding: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  cardList: {
    paddingBottom: 20,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedOptionCard: {
    borderColor: '#2D6CDF',
    backgroundColor: '#EDF1FA',
  },
  optionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  doctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#FFA000',
    marginLeft: 5,
  },
  dateSection: {
    marginBottom: 20,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  errorMessage: {
    color: '#FF3B30',
    marginBottom: 10,
  },
  errorHint: {
    color: '#666',
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
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  cardContainerSelected: {
    borderColor: '#2D6CDF',
    backgroundColor: '#EDF1FA',
  },
  cardContent: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  durationText: {
    fontSize: 14,
    color: '#666',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  cardTags: {
    flexDirection: 'row',
    marginTop: 5,
  },
  tag: {
    backgroundColor: '#2D6CDF',
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginRight: 5,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#2D6CDF',
    marginLeft: 5,
  },
  nextButton: {
    backgroundColor: '#2D6CDF',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 5,
  },
  errorButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
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
  optionsContainer: {
    flex: 1,
  },
});

export default AppointmentForm; 