import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import SpecialtyListItem from './SpecialtyListItem';

// Definimos el tipo
interface Specialty {
  id: string;
  name: string;
  description?: string;
  icon?: React.ComponentProps<typeof import('@expo/vector-icons').Ionicons>['name'];
  localImage?: any;
}

// Datos de ejemplo con descripciones
const MOCK_SPECIALTIES: Specialty[] = [
  { 
    id: '1', 
    name: 'Cardiología', 
    icon: 'heart-outline',
    description: 'Especialidad médica que se ocupa del diagnóstico y tratamiento de las enfermedades del corazón.'
  },
  { 
    id: '2', 
    name: 'Dermatología', 
    icon: 'body-outline',
    description: 'Especialidad médica encargada del estudio de la piel, su estructura, función y enfermedades.'
  },
  { 
    id: '3', 
    name: 'Traumatología', 
    icon: 'fitness-outline',
    description: 'Especialidad médica que trata lesiones del sistema músculo-esquelético.'
  },
  { 
    id: '4', 
    name: 'Neurología', 
    icon: 'pulse-outline',
    description: 'Especialidad médica que trata los trastornos del sistema nervioso.'
  }
];

interface SpecialtyListViewProps {
  onSelectSpecialty?: (specialtyId: string) => void;
  searchQuery?: string;
}

const SpecialtyListView: React.FC<SpecialtyListViewProps> = ({ 
  onSelectSpecialty,
  searchQuery = '' 
}) => {
  // Estados
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [useLocalData, setUseLocalData] = useState<boolean>(true); // Usar datos locales por defecto

  // Cargar especialidades al montar el componente
  useEffect(() => {
    loadSpecialties();
  }, []);

  const loadSpecialties = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Usamos directamente los datos locales para evitar errores de API
      setSpecialties(MOCK_SPECIALTIES);
      setUseLocalData(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Error al cargar especialidades:', err);
      // En caso de error, usar datos locales
      setUseLocalData(true);
      setSpecialties(MOCK_SPECIALTIES);
      setError(null); // No mostramos el error al usuario ya que usamos datos locales
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D6CDF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadSpecialties}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {specialties.length > 0 ? (
        <FlatList
          data={specialties}
          renderItem={({ item }) => (
            <SpecialtyListItem 
              specialty={item} 
              onPress={onSelectSpecialty}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay especialidades disponibles.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#2D6CDF',
    padding: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default SpecialtyListView; 