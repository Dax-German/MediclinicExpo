import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import specialtyService from '../../src/api/services/specialtyService';

// Definimos el tipo localmente
interface Specialty {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name']; // Tipo correcto para Ionicons name
  localImage?: any; // Para imágenes locales
}

// Datos de ejemplo para cuando falle la carga desde el backend
const MOCK_SPECIALTIES: Specialty[] = [
  { 
    id: '1', 
    name: 'General', 
    icon: 'medical',
    localImage: require('../../assets/Iconos/estetoscopio.png')
  },
  { 
    id: '2', 
    name: 'Pediatría', 
    icon: 'people',
    localImage: require('../../assets/Iconos/pediatria.png')
  },
  { 
    id: '3', 
    name: 'Planificación', 
    icon: 'calendar',
    localImage: require('../../assets/Iconos/calendario.png')
  },
  { 
    id: '4', 
    name: 'Odontología', 
    icon: 'medkit',
    localImage: require('../../assets/Iconos/odontologia.png')
  },
  { 
    id: '5', 
    name: 'Optometría', 
    icon: 'eye',
    localImage: require('../../assets/Iconos/optometria.png')
  },
  { id: '6', name: 'Más', icon: 'add' }
];

interface SpecialtyListProps {
  onSelectSpecialty?: (specialtyId: string) => void;
  showFeaturedOnly?: boolean;
  maxItems?: number;
  showTitle?: boolean;
}

const SpecialtyList = ({ 
  onSelectSpecialty, 
  showFeaturedOnly = false,
  maxItems,
  showTitle = true
}: SpecialtyListProps) => {
  const router = useRouter();
  
  // Estados
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [useLocalData, setUseLocalData] = useState<boolean>(false); // Cambio a false para intentar usar API primero

  // Cargar especialidades al montar el componente
  useEffect(() => {
    loadSpecialties();
  }, []);

  const loadSpecialties = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Intentar cargar especialidades desde la API
      const response = showFeaturedOnly 
        ? await specialtyService.getFeaturedSpecialties({ limit: maxItems || 10 })
        : await specialtyService.getAllSpecialties({ limit: 100 });
      
      if (response && response.items && response.items.length > 0) {
        // Si hay datos, los usamos
        setSpecialties(response.items);
        setUseLocalData(false);
      } else {
        // Si no hay datos, usar datos locales como fallback
        console.log('No se encontraron especialidades en la API, usando datos locales');
        setSpecialties(MOCK_SPECIALTIES);
        setUseLocalData(true);
      }
    } catch (err: any) {
      console.error('Error al cargar especialidades:', err);
      // Mensaje de error específico según el tipo de error
      if (err.status === 404) {
        setError('No se encontraron especialidades médicas.');
      } else if (err.status === 401) {
        setError('No tiene permisos para ver especialidades.');
      } else if (err.status >= 500) {
        setError('Error en el servidor. Intente más tarde.');
      } else {
        setError('No se pudieron cargar las especialidades.');
      }
      // En caso de error, usar datos locales como fallback
      setUseLocalData(true);
      setSpecialties(MOCK_SPECIALTIES);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpecialtyPress = (specialty: Specialty) => {
    if (onSelectSpecialty) {
      onSelectSpecialty(specialty.id);
    } else {
      // Navegar a la pantalla de programación de citas
      router.push(`/ScheduleAppointmentScreen?specialtyId=${specialty.id}`);
    }
  };

  const handleMorePress = () => {
    if (onSelectSpecialty) {
      // Si tenemos una función de callback, la usamos con un ID especial "more"
      onSelectSpecialty('more');
    } else {
      // Si no hay callback, intentamos navegar directamente
      try {
        router.push('/SpecialtiesScreen');
      } catch (error) {
        console.error('Error al navegar a SpecialtiesScreen:', error);
        
        // Intentar otra aproximación si la primera falla
        try {
          window.location.href = '/SpecialtiesScreen';
        } catch (err) {
          console.error('Error secundario al navegar:', err);
        }
      }
    }
  };

  // Obtener las especialidades a mostrar según los props
  const getDisplayedSpecialties = () => {
    if (useLocalData) {
      // Si usamos datos locales, nos aseguramos de que siempre se muestre el botón "Más"
      return showFeaturedOnly && maxItems 
        ? MOCK_SPECIALTIES.slice(0, maxItems) 
        : MOCK_SPECIALTIES;
    } else {
      // Si usamos datos del backend, aplicamos los filtros normales
      const displaySpecialties = specialties;
      
      // Añadir el botón "Más" solo si estamos mostrando las destacadas y hay más de las que mostramos
      if (showFeaturedOnly && maxItems && displaySpecialties.length > maxItems) {
        const limitedList = displaySpecialties.slice(0, maxItems);
        // Solo añadir "Más" si no existe ya
        if (!limitedList.find(s => s.name === 'Más')) {
          // Asegurar que el botón "Más" tenga el tipo correcto de Specialty
          const moreButton: Specialty = { 
            id: 'more', 
            name: 'Más', 
            icon: 'add-outline' // Usando un ícono válido de Ionicons
          };
          return [...limitedList, moreButton];
        }
        return limitedList;
      }
      
      return displaySpecialties;
    }
  };

  const renderSpecialtyItem = ({ item }: { item: Specialty }) => {
    // Personalizar el elemento "Más"
    if (item.name === 'Más') {
      return (
        <TouchableOpacity 
          style={[styles.specialtyCard, styles.moreCard]}
          onPress={handleMorePress}
        >
          <View style={styles.moreIconContainer}>
            <Ionicons name="add" size={30} color="#FFFFFF" />
          </View>
          <Text style={styles.moreText}>Más</Text>
        </TouchableOpacity>
      );
    }
    
    return (
      <TouchableOpacity 
        style={styles.specialtyCard}
        onPress={() => handleSpecialtyPress(item)}
      >
        <View style={styles.specialtyIconContainer}>
          {item.iconUrl && !useLocalData ? (
            <Image 
              source={{ uri: item.iconUrl }} 
              style={styles.specialtyIcon}
              resizeMode="contain"
            />
          ) : item.localImage ? (
            <Image 
              source={item.localImage} 
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          ) : (
            <Ionicons name={item.icon || "medical"} size={28} color="#2D6CDF" />
          )}
        </View>
        <Text style={styles.specialtyName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D6CDF" />
      </View>
    );
  }

  if (error && !useLocalData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadSpecialties}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const displayedSpecialties = getDisplayedSpecialties();

  return (
    <View style={styles.container}>
      {showTitle && (
        <View style={styles.headerContainer}>
          <Text style={styles.title}>
            {showFeaturedOnly ? "Especialidades populares" : "Todas las especialidades"}
          </Text>
          {showFeaturedOnly && specialties.length > (maxItems || 0) && (
            <TouchableOpacity onPress={handleMorePress}>
              <Text style={styles.viewAllText}>Ver todas</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {displayedSpecialties.length > 0 ? (
        <FlatList
          data={displayedSpecialties}
          renderItem={renderSpecialtyItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.specialtyRow}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay especialidades disponibles</Text>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    color: '#2D6CDF',
    fontSize: 14,
  },
  specialtyRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  specialtyCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  specialtyIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EDF1FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  specialtyIcon: {
    width: 30,
    height: 30,
  },
  specialtyName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
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
  moreCard: {
    backgroundColor: '#2D6CDF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D6CDF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  moreText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SpecialtyList; 