import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  // Estados para los campos del formulario
  const [documentType, setDocumentType] = useState('cedula');
  const [documentNumber, setDocumentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showDocumentTypePicker, setShowDocumentTypePicker] = useState(false);

  /**
   * Maneja el proceso de inicio de sesión
   * 
   * Valida que todos los campos estén completos y
   * redirige al usuario a la pantalla principal si todo es correcto
   */
  const handleLogin = () => {
    try {
      // Validar campos obligatorios
      if (!documentType || !documentNumber || !password) {
        alert('Por favor, complete todos los campos');
        return;
      }
      
      console.log('Intentando iniciar sesión...');
      // TODO: Implementar lógica de autenticación con API
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error en handleLogin:', error);
      alert('Ocurrió un error al intentar iniciar sesión');
    }
  };

  /**
   * Navega a la pantalla de recuperación de contraseña
   */
  const handleForgotPassword = () => {
    try {
      router.push('/ForgotPasswordScreen');
    } catch (error) {
      console.error('Error en handleForgotPassword:', error);
    }
  };

  /**
   * Navega a la pantalla de registro de nuevo usuario
   */
  const handleRegister = () => {
    try {
      console.log('Navegando a registro...');
      router.push('/RegisterScreen');
    } catch (error) {
      console.error('Error al navegar a registro:', error);
    }
  };

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

        {/* Formulario de inicio de sesión */}
        <View style={styles.formContainer}>
          {/* Selector de tipo de documento */}
          <Text style={styles.label}>Tipo de documento</Text>
          <TouchableOpacity
            style={styles.selectContainer}
            onPress={() => setShowDocumentTypePicker(!showDocumentTypePicker)}
          >
            <Text style={styles.selectText}>
              {documentType === 'cedula' ? 'Cédula de Ciudadanía' :
               documentType === 'pasaporte' ? 'Pasaporte' :
               documentType === 'ti' ? 'Tarjeta de Identidad' : 'Seleccionar tipo de documento'}
            </Text>
          </TouchableOpacity>
          
          {/* Picker desplegable para tipo de documento */}
          {showDocumentTypePicker && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={documentType}
                onValueChange={(itemValue) => {
                  setDocumentType(itemValue);
                  setShowDocumentTypePicker(false);
                }}
              >
                <Picker.Item label="Cédula de Ciudadanía" value="cedula" />
                <Picker.Item label="Pasaporte" value="pasaporte" />
                <Picker.Item label="Tarjeta de Identidad" value="ti" />
              </Picker>
            </View>
          )}

          {/* Campo para número de documento */}
          <Text style={styles.label}>Número de documento</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su número de documento"
            value={documentNumber}
            onChangeText={setDocumentNumber}
            keyboardType="numeric"
          />
          
          {/* Campo para contraseña */}
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          {/* Botón de inicio de sesión */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>
          
          {/* Enlace para recuperar contraseña */}
          <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* Enlace para registro de nuevo usuario */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/**
 * Estilos para la pantalla de login
 * 
 * Incluye estilos para:
 * - Contenedor principal
 * - Logo y título
 * - Formulario de entrada
 * - Botones y enlaces
 */
const styles = StyleSheet.create({
  // Contenedor principal con fondo gris claro
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Configuración del contenido scrollable
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  // Contenedor del logo y título
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  // Estilos del logo
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  // Estilos del título
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D6CDF',
  },
  // Contenedor del formulario con padding horizontal
  formContainer: {
    paddingHorizontal: 30,
  },
  // Estilos para las etiquetas de los campos
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#444',
    marginTop: 10,
  },
  // Contenedor del selector de tipo de documento
  selectContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  // Texto dentro del selector
  selectText: {
    fontSize: 16,
    color: '#333',
  },
  // Contenedor para el picker desplegable
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  // Estilos para los campos de entrada de texto
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  // Botón principal de acción
  button: {
    backgroundColor: '#2D6CDF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  // Texto del botón principal
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Botón para recuperar contraseña
  forgotPasswordButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  // Texto del enlace de recuperación
  forgotPasswordText: {
    color: '#2D6CDF',
    fontSize: 14,
  },
  // Contenedor del enlace de registro
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  // Texto informativo del registro
  registerText: {
    fontSize: 14,
    color: '#555',
  },
  // Enlace de registro destacado
  registerLink: {
    fontSize: 14,
    color: '#2D6CDF',
    fontWeight: '500',
  },
}); 