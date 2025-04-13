import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { AlertData, AlertType } from '../components/AlertItem';

interface AlertState {
  alerts: AlertData[];
  isLoading: boolean;
  error: string | null;
}

export function useAlerts() {
  const [state, setState] = useState<AlertState>({
    alerts: [],
    isLoading: true,
    error: null,
  });

  // Cargar las alertas desde el almacenamiento local al inicio
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const storedAlerts = await AsyncStorage.getItem('@MediClinic:alerts');
        
        if (storedAlerts) {
          setState({
            alerts: JSON.parse(storedAlerts),
            isLoading: false,
            error: null,
          });
        } else {
          // Si no hay alertas guardadas, inicializamos con datos de ejemplo
          const initialAlerts: AlertData[] = [
            {
              id: '1',
              title: 'Recordatorio de cita',
              message: 'Tienes una cita con el Dr. Carlos Rodríguez mañana a las 9:30 AM.',
              date: '01/04/2024',
              type: 'appointment',
              read: false,
            },
            {
              id: '2',
              title: 'Resultados disponibles',
              message: 'Tus resultados de laboratorio ya están disponibles para consulta.',
              date: '30/03/2024',
              type: 'result',
              read: false,
            },
            {
              id: '3',
              title: 'Recordatorio de medicación',
              message: 'No olvides tomar tu medicación diaria.',
              date: '28/03/2024',
              type: 'medication',
              read: true,
            },
            {
              id: '4',
              title: 'Información general',
              message: 'Nuevos horarios de atención durante Semana Santa.',
              date: '25/03/2024',
              type: 'general',
              read: true,
            },
          ];

          // Guardamos los datos iniciales en AsyncStorage
          await AsyncStorage.setItem('@MediClinic:alerts', JSON.stringify(initialAlerts));
          
          setState({
            alerts: initialAlerts,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setState({
          alerts: [],
          isLoading: false,
          error: 'Error al cargar las alertas',
        });
      }
    };

    loadAlerts();
  }, []);

  // Función para guardar las alertas en AsyncStorage
  const saveAlerts = async (alerts: AlertData[]) => {
    try {
      await AsyncStorage.setItem('@MediClinic:alerts', JSON.stringify(alerts));
    } catch (error) {
      console.error('Error al guardar alertas:', error);
    }
  };

  // Función para marcar una alerta como leída
  const markAsRead = async (alertId: string): Promise<boolean> => {
    try {
      const updatedAlerts = state.alerts.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      );
      
      // Guardar en AsyncStorage
      await saveAlerts(updatedAlerts);

      setState({
        ...state,
        alerts: updatedAlerts,
      });

      return true;
    } catch (error) {
      setState({
        ...state,
        error: 'Error al marcar la alerta como leída',
      });
      return false;
    }
  };

  // Función para marcar todas las alertas como leídas
  const markAllAsRead = async (): Promise<boolean> => {
    try {
      const updatedAlerts = state.alerts.map(alert => ({ ...alert, read: true }));
      
      // Guardar en AsyncStorage
      await saveAlerts(updatedAlerts);

      setState({
        ...state,
        alerts: updatedAlerts,
      });

      return true;
    } catch (error) {
      setState({
        ...state,
        error: 'Error al marcar todas las alertas como leídas',
      });
      return false;
    }
  };

  // Función para eliminar una alerta
  const deleteAlert = async (alertId: string): Promise<boolean> => {
    try {
      const updatedAlerts = state.alerts.filter(alert => alert.id !== alertId);
      
      // Guardar en AsyncStorage
      await saveAlerts(updatedAlerts);

      setState({
        ...state,
        alerts: updatedAlerts,
      });

      return true;
    } catch (error) {
      setState({
        ...state,
        error: 'Error al eliminar la alerta',
      });
      return false;
    }
  };

  // Función para añadir una nueva alerta
  const addAlert = async (alertData: Omit<AlertData, 'id' | 'read'>): Promise<boolean> => {
    try {
      const newAlert: AlertData = {
        id: Math.random().toString(36).substr(2, 9),
        ...alertData,
        read: false,
      };

      const updatedAlerts = [newAlert, ...state.alerts];
      
      // Guardar en AsyncStorage
      await saveAlerts(updatedAlerts);

      setState({
        ...state,
        alerts: updatedAlerts,
      });

      return true;
    } catch (error) {
      setState({
        ...state,
        error: 'Error al añadir la alerta',
      });
      return false;
    }
  };

  // Función para obtener alertas no leídas
  const getUnreadAlerts = () => {
    return state.alerts.filter(alert => !alert.read);
  };

  // Función para obtener alertas por tipo
  const getAlertsByType = (type: AlertType | 'all') => {
    if (type === 'all') {
      return state.alerts;
    }
    
    return state.alerts.filter(alert => alert.type === type);
  };

  // Función para limpiar errores
  const clearError = () => {
    setState({ ...state, error: null });
  };

  return {
    alerts: state.alerts,
    isLoading: state.isLoading,
    error: state.error,
    markAsRead,
    markAllAsRead,
    deleteAlert,
    addAlert,
    getUnreadAlerts,
    getAlertsByType,
    clearError,
  };
} 