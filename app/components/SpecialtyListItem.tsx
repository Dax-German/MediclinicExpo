import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Specialty {
  id: string;
  name: string;
  description?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  localImage?: any;
}

interface SpecialtyListItemProps {
  specialty: Specialty;
  onPress?: (specialtyId: string) => void;
}

const SpecialtyListItem: React.FC<SpecialtyListItemProps> = ({ specialty, onPress }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress(specialty.id);
    } else {
      router.push({
        pathname: '/ScheduleAppointmentScreen',
        params: {
          specialtyId: specialty.id,
          fromScreen: 'specialties'
        }
      });
    }
  };

  // Función para obtener el icono correcto según la especialidad
  const getSpecialtyIcon = () => {
    switch (specialty.name.toLowerCase()) {
      case 'cardiología':
        return (
          <View style={[styles.iconContainer, { backgroundColor: '#E8F0FE' }]}>
            <Ionicons name="heart-outline" size={22} color="#2D6CDF" />
          </View>
        );
      case 'dermatología':
        return (
          <View style={[styles.iconContainer, { backgroundColor: '#E8F0FE' }]}>
            <Ionicons name="body-outline" size={22} color="#2D6CDF" />
          </View>
        );
      case 'traumatología':
        return (
          <View style={[styles.iconContainer, { backgroundColor: '#E8F0FE' }]}>
            <Ionicons name="fitness-outline" size={22} color="#2D6CDF" />
          </View>
        );
      case 'neurología':
        return (
          <View style={[styles.iconContainer, { backgroundColor: '#E8F0FE' }]}>
            <Ionicons name="pulse-outline" size={22} color="#2D6CDF" />
          </View>
        );
      default:
        return (
          <View style={[styles.iconContainer, { backgroundColor: '#E8F0FE' }]}>
            <Ionicons name="medkit-outline" size={22} color="#2D6CDF" />
          </View>
        );
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
    >
      {getSpecialtyIcon()}
      
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{specialty.name}</Text>
        {specialty.description && (
          <Text style={styles.description} numberOfLines={2}>
            {specialty.description}
          </Text>
        )}
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#888" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#777',
    lineHeight: 18,
  },
});

export default SpecialtyListItem; 