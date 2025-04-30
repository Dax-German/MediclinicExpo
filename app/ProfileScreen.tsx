import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, Stack, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type ProfileOption = {
  id: string;
  title: string;
  iconImage: ImageSourcePropType;
  onPress: () => void;
  subtitle?: string;
  showChevron?: boolean;
};

export default function ProfileScreen() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileName, setProfileName] = useState('Juan García');
  const [profileEmail, setProfileEmail] = useState('juangarcia@gmail.com');

  // Función para cargar los datos del perfil
  const loadProfileData = useCallback(async () => {
    try {
      // Cargar imagen
      const savedImage = await AsyncStorage.getItem('@MediClinic:profileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
      
      // Cargar nombre y email
      const savedName = await AsyncStorage.getItem('@MediClinic:profileName');
      const savedEmail = await AsyncStorage.getItem('@MediClinic:profileEmail');
      
      if (savedName) setProfileName(savedName);
      if (savedEmail) setProfileEmail(savedEmail);
    } catch (error) {
      console.error('Error al cargar datos del perfil:', error);
    }
  }, []);

  // Cargar datos al iniciar
  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  // Cargar datos cada vez que la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [loadProfileData])
  );

  // Si hay una redirección pendiente, realizarla
  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }

  const handleEditProfile = () => {
    setRedirectTo('/EditProfileScreen');
  };

  const handleViewPersonalInfo = () => {
    setRedirectTo('/PersonalInfoScreen');
  };

  const handleViewMedicalHistory = () => {
    setRedirectTo('/MedicalHistoryScreen');
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleSettings = () => {
    setRedirectTo('/SettingsScreen');
  };

  const handleSupport = () => {
    setRedirectTo('/SupportScreen');
  };

  const handleLogout = () => {
    setRedirectTo('/LoginScreen');
  };

  const handleImagePicker = () => {
    setRedirectTo('/PhotoPickerScreen');
  };

  const profileOptions: ProfileOption[] = [
    {
      id: '1',
      title: 'Información personal',
      iconImage: require('../assets/Iconos/app-medica.png'),
      onPress: handleViewPersonalInfo,
      showChevron: true,
    },
    {
      id: '2',
      title: 'Historial médico',
      iconImage: require('../assets/Iconos/estetoscopio.png'),
      onPress: handleViewMedicalHistory,
      showChevron: true,
    },
    {
      id: '4',
      title: 'Notificaciones',
      iconImage: require('../assets/Iconos/notificaciones.png'),
      onPress: toggleNotifications,
      subtitle: notificationsEnabled ? 'Activadas' : 'Desactivadas',
      showChevron: true,
    },
    {
      id: '5',
      title: 'Ajustes',
      iconImage: require('../assets/Iconos/ajustes.png'),
      onPress: handleSettings,
      showChevron: true,
    },
    {
      id: '6',
      title: 'Ayuda y soporte',
      iconImage: require('../assets/Iconos/ayuda.png'),
      onPress: handleSupport,
      showChevron: true,
    },
    {
      id: '7',
      title: 'Cerrar sesión',
      iconImage: require('../assets/Iconos/volver.png'),
      onPress: handleLogout,
      showChevron: false,
    },
  ];

  const handleBackPress = () => {
    setRedirectTo('/HomeScreen');
  };

  const renderOption = (option: ProfileOption) => (
    <TouchableOpacity 
      key={option.id} 
      style={styles.optionItem}
      onPress={option.onPress}
    >
      <View style={styles.optionIconContainer}>
        <Image source={option.iconImage} style={{width: 22, height: 22}} resizeMode="contain" />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{option.title}</Text>
        {option.subtitle && (
          <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
        )}
      </View>
      {option.showChevron && (
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen options={{ 
        headerShown: false 
      }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Image source={require('../assets/Iconos/volver.png')} style={{width: 24, height: 24}} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profileImage}
              />
            ) : (
              <Image 
                source={require('../assets/Iconos/app-medica.png')} 
                style={styles.profileImage}
              />
            )}
            <TouchableOpacity style={styles.editImageButton} onPress={handleImagePicker}>
              <Ionicons name="camera-outline" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{profileName}</Text>
          <Text style={styles.profileEmail}>{profileEmail}</Text>
          <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
            <Text style={styles.editProfileText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionsContainer}>
          {profileOptions.map(renderOption)}
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#2D6CDF',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: '#777',
    marginBottom: 15,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#EDF1FA',
    borderRadius: 20,
  },
  editProfileText: {
    color: '#2D6CDF',
    fontSize: 14,
    fontWeight: '500',
  },
  optionsContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDF1FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: '#333',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 12,
    color: '#888',
  },
}); 