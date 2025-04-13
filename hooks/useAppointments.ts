import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { AppointmentData, AppointmentStatus } from '../components/AppointmentCard';

interface AppointmentState {
  appointments: AppointmentData[];
  isLoading: boolean;
  error: string | null;
}

// Definir la interfaz para los datos de una nueva cita
export interface NewAppointmentData {
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location?: string;
  notes?: string;
}

export function useAppointments() {
  const [state, setState] = useState<AppointmentState>({
    appointments: [],
    isLoading: true,
    error: null,
  });

  // Cargar las citas desde el almacenamiento local al inicio
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const storedAppointments = await AsyncStorage.getItem('@MediClinic:appointments');
        
        if (storedAppointments) {
          setState({
            appointments: JSON.parse(storedAppointments),
            isLoading: false,
            error: null,
          });
        } else {
          // Si no hay citas guardadas, inicializamos con datos de ejemplo
          const initialAppointments: AppointmentData[] = [
            {
              id: '1',
              doctor: 'Dr. Carlos Rodríguez',
              specialty: 'Cardiología',
              date: '10 Abril, 2024',
              time: '9:30 AM',
              status: 'upcoming',
              location: 'Clínica Central, Piso 3, Consultorio 302',
            },
            {
              id: '2',
              doctor: 'Dra. María González',
              specialty: 'Dermatología',
              date: '15 Abril, 2024',
              time: '11:00 AM',
              status: 'upcoming',
              location: 'Clínica Norte, Consultorio 105',
            },
            {
              id: '3',
              doctor: 'Dr. José Fernández',
              specialty: 'Traumatología',
              date: '20 Marzo, 2024',
              time: '10:00 AM',
              status: 'completed',
            },
            {
              id: '4',
              doctor: 'Dra. Ana Martínez',
              specialty: 'Oftalmología',
              date: '5 Marzo, 2024',
              time: '16:30 PM',
              status: 'cancelled',
            },
          ];

          // Guardamos los datos iniciales en AsyncStorage
          await AsyncStorage.setItem('@MediClinic:appointments', JSON.stringify(initialAppointments));
          
          setState({
            appointments: initialAppointments,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setState({
          appointments: [],
          isLoading: false,
          error: 'Error al cargar las citas',
        });
      }
    };

    loadAppointments();
  }, []);

  // Función para guardar las citas en AsyncStorage
  const saveAppointments = async (appointments: AppointmentData[]) => {
    try {
      await AsyncStorage.setItem('@MediClinic:appointments', JSON.stringify(appointments));
    } catch (error) {
      console.error('Error al guardar citas:', error);
    }
  };

  // Función para crear una nueva cita
  const createAppointment = async (appointmentData: NewAppointmentData): Promise<boolean> => {
    setState({ ...state, isLoading: true });

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newAppointment: AppointmentData = {
        id: Math.random().toString(36).substr(2, 9),
        doctor: appointmentData.doctorName,
        specialty: appointmentData.specialty,
        date: appointmentData.date,
        time: appointmentData.time,
        status: 'upcoming',
        location: appointmentData.location,
      };

      const updatedAppointments = [...state.appointments, newAppointment];
      
      // Guardar en AsyncStorage
      await saveAppointments(updatedAppointments);

      setState({
        appointments: updatedAppointments,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Error al crear la cita',
      });
      return false;
    }
  };

  // Función para actualizar el estado de una cita
  const updateAppointmentStatus = async (
    appointmentId: string,
    status: AppointmentStatus
  ): Promise<boolean> => {
    setState({ ...state, isLoading: true });

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedAppointments = state.appointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status } 
          : appointment
      );

      // Guardar en AsyncStorage
      await saveAppointments(updatedAppointments);

      setState({
        appointments: updatedAppointments,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Error al actualizar el estado de la cita',
      });
      return false;
    }
  };

  // Función para cancelar una cita
  const cancelAppointment = (appointmentId: string) => {
    return updateAppointmentStatus(appointmentId, 'cancelled');
  };

  // Función para marcar una cita como completada
  const completeAppointment = (appointmentId: string) => {
    return updateAppointmentStatus(appointmentId, 'completed');
  };

  // Función para obtener citas filtradas por estado
  const getFilteredAppointments = (status?: AppointmentStatus | 'all') => {
    if (!status || status === 'all') {
      return state.appointments;
    }
    
    return state.appointments.filter(appointment => appointment.status === status);
  };

  // Función para limpiar errores
  const clearError = () => {
    setState({ ...state, error: null });
  };

  return {
    appointments: state.appointments,
    isLoading: state.isLoading,
    error: state.error,
    createAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    completeAppointment,
    getFilteredAppointments,
    clearError,
  };
} 