import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si hay una redirección pendiente, realizarla
  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }

  /**
   * Maneja el proceso de inicio de sesión
   * 
   * Valida que todos los campos estén completos y
   * redirige al usuario a la pantalla principal si todo es correcto
   */
  const handleLogin = async () => {
    try {
      // Validar campos obligatorios
      if (!documentType || !documentNumber || !password) {
        alert('Por favor, complete todos los campos');
        return;
      }
      
      // Resetear error previo
      setError(null);
      setIsLoading(true);
      
      console.log('Intentando iniciar sesión...');
      
      try {
        // Llamada al servicio de autenticación (comentado para desarrollo)
        /* const response = await authService.login({
          documentType,
          documentNumber,
          password
        });
        
        // Aquí se guardaría el token y la información del usuario
        console.log('Login exitoso:', response); */
        
        // Por ahora simplemente redirigimos al usuario a la pantalla principal
        setRedirectTo('/HomeScreen');
      } catch (authError) {
        // Capturamos errores de autenticación
        console.error('Error de autenticación:', authError);
        setError('Credenciales incorrectas. Por favor, inténtelo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error en handleLogin:', error);
      setError('Ocurrió un error al intentar iniciar sesión');
      setIsLoading(false);
    }
  };

  /**
   * Navega a la pantalla de recuperación de contraseña
   */
  const handleForgotPassword = () => {
    try {
      setRedirectTo('/ForgotPasswordScreen');
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
      setRedirectTo('/RegisterScreen');
    } catch (error) {
      console.error('Error al navegar a registro:', error);
    }
  };

  // Función para renderizar el texto del tipo de documento seleccionado
  const getDocumentTypeText = () => {
    switch(documentType) {
      case 'cedula': return 'Cédula de Ciudadanía';
      case 'pasaporte': return 'Pasaporte';
      case 'ti': return 'Tarjeta de Identidad';
      default: return 'Seleccionar tipo de documento';
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
            onPress={() => setShowDocumentTypePicker(true)}
          >
            <Text style={styles.selectText}>{getDocumentTypeText()}</Text>
          </TouchableOpacity>
          
          {/* Modal para el selector de tipo de documento */}
          <Modal
            visible={showDocumentTypePicker}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowDocumentTypePicker(false)}
          >
            <TouchableOpacity 
              style={styles.modalOverlay} 
              activeOpacity={1} 
              onPress={() => setShowDocumentTypePicker(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Tipo de documento</Text>
                  
                  <TouchableOpacity 
                    style={styles.modalOption}
                    onPress={() => {
                      setDocumentType('cedula');
                      setShowDocumentTypePicker(false);
                    }}
                  >
                    <Text style={[
                      styles.modalOptionText, 
                      documentType === 'cedula' && styles.selectedOption
                    ]}>Cédula de Ciudadanía</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.modalOption}
                    onPress={() => {
                      setDocumentType('pasaporte');
                      setShowDocumentTypePicker(false);
                    }}
                  >
                    <Text style={[
                      styles.modalOptionText, 
                      documentType === 'pasaporte' && styles.selectedOption
                    ]}>Pasaporte</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.modalOption}
                    onPress={() => {
                      setDocumentType('ti');
                      setShowDocumentTypePicker(false);
                    }}
                  >
                    <Text style={[
                      styles.modalOptionText, 
                      documentType === 'ti' && styles.selectedOption
                    ]}>Tarjeta de Identidad</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>

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
          
          {/* Mensaje de error */}
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          {/* Botón de inicio de sesión */}
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
            </Text>
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
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  // Texto dentro del selector
  selectText: {
    fontSize: 16,
    color: '#333',
  },
  // Estilos para el modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOption: {
    color: '#2D6CDF',
    fontWeight: 'bold',
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
  buttonDisabled: {
    backgroundColor: '#a0b8e0',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
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