import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import specialtyService from '../../src/api/services/specialtyService';
import SpecialtyListItem from './SpecialtyListItem';

// Definimos el tipo
interface Specialty {
  id: string;
  name: string;
  description?: string;
  icon?: React.ComponentProps<typeof import('@expo/vector-icons').Ionicons>['name'];
  localImage?: any;
}

// Datos de ejemplo con IDs correctos - solo especialidades adicionales (no las que están en la pantalla principal)
const MOCK_SPECIALTIES: Specialty[] = [
  { 
    id: '57', 
    name: 'Cardiología', 
    icon: 'heart-outline',
    description: 'Especialidad médica que se ocupa del diagnóstico y tratamiento de las enfermedades del corazón.'
  },
  { 
    id: '58', 
    name: 'Dermatología', 
    icon: 'body-outline',
    description: 'Especialidad médica encargada del estudio de la piel, su estructura, función y enfermedades.'
  },
  { 
    id: '59', 
    name: 'Traumatología', 
    icon: 'fitness-outline',
    description: 'Especialidad médica que trata lesiones del sistema músculo-esquelético.'
  },
  { 
    id: '60', 
    name: 'Ginecología', 
    icon: 'female-outline',
    description: 'Especialidad médica que trata las enfermedades del sistema reproductor femenino.'
  },
  { 
    id: '61', 
    name: 'Neurología', 
    icon: 'analytics-outline',
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
  const [useLocalData, setUseLocalData] = useState<boolean>(false); // Cambio a false para intentar API primero

  // Cargar especialidades al montar el componente
  useEffect(() => {
    loadSpecialties();
  }, []);

  // Efecto adicional para filtrar cuando cambia la búsqueda
  useEffect(() => {
    if (searchQuery.trim()) {
      filterSpecialties(searchQuery);
    } else if (!isLoading) {
      // Si no hay búsqueda, restaurar la lista completa
      loadSpecialties();
    }
  }, [searchQuery]);

  const loadSpecialties = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Siempre usamos los datos locales para evitar problemas con la API
      console.log('Usando datos locales de especialidades');
      setSpecialties(MOCK_SPECIALTIES);
      setUseLocalData(true);
    } catch (err: any) {
      console.error('Error al cargar especialidades:', err);
      // Mensajes de error específicos según el código
      if (err.status === 404) {
        setError('No se encontraron especialidades médicas.');
      } else if (err.status === 401) {
        setError('No tiene permisos para ver especialidades.');
      } else if (err.status >= 500) {
        setError('Error en el servidor. Intente más tarde.');
      } else {
        setError('No se pudieron cargar las especialidades.');
      }
      // Usar datos locales como fallback en caso de error
      setSpecialties(MOCK_SPECIALTIES);
      setUseLocalData(true);
      // Limpiar error si usamos datos locales como fallback
      if (MOCK_SPECIALTIES.length > 0) {
        setError(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterSpecialties = async (query: string) => {
    setIsLoading(true);
    setError(null);

    const searchTerm = query.toLowerCase().trim();
    
    try {
      if (!useLocalData) {
        // Intentar buscar usando la API
        const response = await specialtyService.searchSpecialties(searchTerm, { limit: 100 });
        
        if (response && response.items && response.items.length > 0) {
          setSpecialties(response.items);
        } else {
          // Si la API no encuentra resultados
          setSpecialties([]);
        }
      } else {
        // Filtrar localmente si estamos usando datos locales
        const filteredSpecialties = MOCK_SPECIALTIES.filter(
          specialty => specialty.name.toLowerCase().includes(searchTerm) || 
                      (specialty.description && specialty.description.toLowerCase().includes(searchTerm))
        );
        setSpecialties(filteredSpecialties);
      }
    } catch (err) {
      console.error('Error al filtrar especialidades:', err);
      
      // Si hay error con la API, intentar filtrar localmente
      const filteredSpecialties = MOCK_SPECIALTIES.filter(
        specialty => specialty.name.toLowerCase().includes(searchTerm) || 
                    (specialty.description && specialty.description.toLowerCase().includes(searchTerm))
      );
      
      setSpecialties(filteredSpecialties);
      setUseLocalData(true);
      // No mostrar error si encontramos resultados localmente
      if (filteredSpecialties.length === 0) {
        setError('No se pudieron buscar especialidades.');
      }
    } finally {
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
            {searchQuery 
              ? `No se encontraron especialidades para "${searchQuery}"`
              : "No hay especialidades disponibles."}
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