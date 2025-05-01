import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import LoginForm from './components/LoginForm';

/**
 * Pantalla de inicio de sesión
 * 
 * Permite a los usuarios acceder a la aplicación mediante:
 * - Selección del tipo de documento
 * - Número de documento
 * - Contraseña
 * 
 * También proporciona enlaces para:
 * - Recuperar contraseña olvidada
 * - Registrarse como nuevo usuario
 */
export default function LoginScreen() {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      
      {/* Contenedor principal con scroll para dispositivos pequeños */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo y título de la aplicación */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/Iconos/app-medica.png')} 
            defaultSource={require('../assets/Iconos/app-medica.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>MediClinic</Text>
        </View>

        {/* Formulario de inicio de sesión utilizando el componente LoginForm */}
        <LoginForm />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D6CDF',
    marginTop: 10,
  },
}); 