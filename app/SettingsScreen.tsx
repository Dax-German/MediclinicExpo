import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

// Tipo para las opciones de configuración
type SettingOption = {
  id: string;
  title: string;
  description?: string;
  type: 'toggle' | 'action';
  value?: boolean;
  action?: () => void;
  icon: string;
};

export default function SettingsScreen() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  
  // Estados para los toggles
  const [darkMode, setDarkMode] = useState(false);
  const [biometricLogin, setBiometricLogin] = useState(true);
  const [dataUsage, setDataUsage] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  // Si hay una redirección pendiente, realizarla
  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }

  const handleBackPress = () => {
    setRedirectTo('/ProfileScreen');
  };

  const handleClearCache = () => {
    Alert.alert(
      'Limpiar caché',
      '¿Estás seguro que deseas limpiar la caché de la aplicación?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        { 
          text: 'Limpiar', 
          onPress: () => {
            // Aquí iría la lógica para limpiar la caché
            Alert.alert('Caché limpiada', 'La caché ha sido limpiada correctamente.');
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      '¿Estás seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        { 
          text: 'Eliminar', 
          onPress: () => {
            // Aquí iría la lógica para eliminar la cuenta
            setRedirectTo('/LoginScreen');
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Opciones de configuración
  const settingsOptions: SettingOption[] = [
    {
      id: 'appearance',
      title: 'Modo oscuro',
      description: 'Cambiar entre tema claro y oscuro',
      type: 'toggle',
      value: darkMode,
      icon: 'moon-outline',
      action: () => setDarkMode(!darkMode)
    },
    {
      id: 'biometrics',
      title: 'Inicio de sesión biométrico',
      description: 'Usar huella digital o reconocimiento facial',
      type: 'toggle',
      value: biometricLogin,
      icon: 'finger-print-outline',
      action: () => setBiometricLogin(!biometricLogin)
    },
    {
      id: 'data',
      title: 'Uso de datos móviles',
      description: 'Usar datos móviles para sincronización',
      type: 'toggle',
      value: dataUsage,
      icon: 'cellular-outline',
      action: () => setDataUsage(!dataUsage)
    },
    {
      id: 'email',
      title: 'Notificaciones por correo',
      description: 'Recibir notificaciones por correo electrónico',
      type: 'toggle',
      value: emailNotifications,
      icon: 'mail-outline',
      action: () => setEmailNotifications(!emailNotifications)
    },
    {
      id: 'cache',
      title: 'Limpiar caché',
      description: 'Eliminar datos temporales de la aplicación',
      type: 'action',
      icon: 'trash-outline',
      action: handleClearCache
    },
    {
      id: 'delete',
      title: 'Eliminar cuenta',
      description: 'Eliminar permanentemente tu cuenta',
      type: 'action',
      icon: 'warning-outline',
      action: handleDeleteAccount
    }
  ];

  // Renderizar una opción de configuración
  const renderSettingOption = (option: SettingOption) => (
    <TouchableOpacity 
      key={option.id}
      style={styles.settingItem}
      onPress={option.action}
      disabled={option.type === 'toggle'}
    >
      <View style={styles.settingIconContainer}>
        <Ionicons name={option.icon as any} size={22} color="#2D6CDF" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{option.title}</Text>
        {option.description && (
          <Text style={styles.settingDescription}>{option.description}</Text>
        )}
      </View>
      {option.type === 'toggle' ? (
        <Switch
          value={option.value}
          onValueChange={option.action}
          trackColor={{ false: '#e0e0e0', true: '#a2c0ff' }}
          thumbColor={option.value ? '#2D6CDF' : '#f5f5f5'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajustes</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Apariencia y uso</Text>
          {settingsOptions.slice(0, 4).map(renderSettingOption)}
        </View>

        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Datos y cuenta</Text>
          {settingsOptions.slice(4).map(renderSettingOption)}
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>MediClinic v1.0.0</Text>
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
    padding: 20,
  },
  settingsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDF1FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingDescription: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 14,
    color: '#888',
  },
}); 