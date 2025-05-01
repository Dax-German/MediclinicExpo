import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import apiServices from '../../src/api/services';
import { DOCUMENT_TYPES, getDocumentTypeText } from '../../src/constants/documentTypes';

// Definir los tipos localmente ya que no se pueden importar de services
interface LoginCredentials {
  documentType: string;
  documentNumber: string;
  password: string;
}

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
}

const LoginForm = ({ onSuccess, onForgotPassword, onRegister }: LoginFormProps) => {
  const router = useRouter();
  
  // Estados para los campos del formulario
  const [documentType, setDocumentType] = useState(DOCUMENT_TYPES.CITIZENSHIP_CARD);
  const [documentNumber, setDocumentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showDocumentTypePicker, setShowDocumentTypePicker] = useState(false);
  
  // Estados auxiliares
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Depuración de los valores de documento al iniciar
  useEffect(() => {
    console.log('Valores de DOCUMENT_TYPES:', JSON.stringify(DOCUMENT_TYPES, null, 2));
    console.log('Valor inicial de documentType:', documentType);
  }, []);

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    // Validar campos obligatorios
    if (!documentType || !documentNumber || !password) {
      setError('Por favor, complete todos los campos');
      return;
    }
    
    // Resetear error previo
    setError(null);
    setIsLoading(true);
    
    try {
      // Credenciales para el servicio de autenticación
      const credentials: LoginCredentials = {
        documentType,
        documentNumber,
        password
      };
      
      // Log para depurar
      console.log('Intentando login con credenciales:', JSON.stringify(credentials, null, 2));
      
      // Llamar al servicio de autenticación
      const response = await apiServices.auth.login(credentials);
      
      // Log para depurar
      console.log('Respuesta de login:', JSON.stringify(response, null, 2));
      
      // Almacenar el token y datos de usuario
      if (response && response.token) {
        await AsyncStorage.setItem('@MediClinic:authToken', response.token);
        
        if (response.refreshToken) {
          await AsyncStorage.setItem('@MediClinic:refreshToken', response.refreshToken);
        }
        
        if (response.user) {
          console.log('Guardando datos del usuario en AsyncStorage:', JSON.stringify(response.user, null, 2));
          await AsyncStorage.setItem('@MediClinic:user', JSON.stringify(response.user));
          
          // Guardar también datos en claves individuales para compatibilidad
          if (response.user.firstName && response.user.lastName) {
            const fullName = `${response.user.firstName} ${response.user.lastName}`;
            await AsyncStorage.setItem('@MediClinic:profileName', fullName);
          } else if (response.user.name) {
            await AsyncStorage.setItem('@MediClinic:profileName', response.user.name);
          }
          
          if (response.user.email) {
            await AsyncStorage.setItem('@MediClinic:profileEmail', response.user.email);
          }
          
          if (response.user.phone) {
            await AsyncStorage.setItem('@MediClinic:profilePhone', response.user.phone);
          }
          
          if (response.user.address) {
            await AsyncStorage.setItem('@MediClinic:profileAddress', response.user.address);
          }
        }
        
        // Comprobar datos guardados
        const savedUser = await AsyncStorage.getItem('@MediClinic:user');
        console.log('Usuario guardado en AsyncStorage:', savedUser);
        
        // Redireccionar o ejecutar callback
        if (onSuccess) {
          onSuccess();
        } else {
          router.replace('/HomeScreen');
        }
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      // Mostrar detalles del error para depuración
      if (error.data) {
        console.error('Detalles del error:', JSON.stringify(error.data, null, 2));
      }
      
      // Mostrar un mensaje de error más informativo
      let errorMessage = 'Credenciales incorrectas. Por favor, inténtelo de nuevo.';
      if (error.message) {
        errorMessage = `Error: ${error.message}`;
        if (error.data && error.data.message) {
          errorMessage += ` (${error.data.message})`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar olvido de contraseña
  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword();
    } else {
      router.push('/ForgotPasswordScreen');
    }
  };

  // Función para manejar registro
  const handleRegister = () => {
    if (onRegister) {
      onRegister();
    } else {
      router.push('/RegisterScreen');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Título del formulario */}
      <Text style={styles.title}>Iniciar Sesión</Text>
      
      {/* Mostrar mensaje de error si existe */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {/* Selector de tipo de documento */}
      <Text style={styles.label}>Tipo de documento</Text>
      <TouchableOpacity
        style={styles.selectContainer}
        onPress={() => setShowDocumentTypePicker(true)}
      >
        <Text style={styles.selectText}>{getDocumentTypeText(documentType)}</Text>
      </TouchableOpacity>
      
      {/* Modal para seleccionar tipo de documento */}
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
                  setDocumentType(DOCUMENT_TYPES.CITIZENSHIP_CARD);
                  setShowDocumentTypePicker(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText, 
                  documentType === DOCUMENT_TYPES.CITIZENSHIP_CARD && styles.selectedOption
                ]}>Cédula de Ciudadanía</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={() => {
                  setDocumentType(DOCUMENT_TYPES.FOREIGNERS_ID_CARD);
                  setShowDocumentTypePicker(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText, 
                  documentType === DOCUMENT_TYPES.FOREIGNERS_ID_CARD && styles.selectedOption
                ]}>Cédula de Extranjería</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={() => {
                  setDocumentType(DOCUMENT_TYPES.PASSPORT);
                  setShowDocumentTypePicker(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText, 
                  documentType === DOCUMENT_TYPES.PASSPORT && styles.selectedOption
                ]}>Pasaporte</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={() => {
                  setDocumentType(DOCUMENT_TYPES.IDENTITY_CARD);
                  setShowDocumentTypePicker(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText, 
                  documentType === DOCUMENT_TYPES.IDENTITY_CARD && styles.selectedOption
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
        placeholderTextColor="#999"
        keyboardType="number-pad"
        value={documentNumber}
        onChangeText={setDocumentNumber}
      />
      
      {/* Campo para contraseña */}
      <Text style={styles.label}>Contraseña</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Ingrese su contraseña"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity 
          style={styles.passwordToggle}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={styles.passwordToggleText}>
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Enlace para recuperar contraseña */}
      <TouchableOpacity 
        style={styles.forgotPasswordLink}
        onPress={handleForgotPassword}
      >
        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      
      {/* Botón de inicio de sesión */}
      <TouchableOpacity 
        style={[styles.loginButton, isLoading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>
      
      {/* Enlace para registrarse */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>¿No tienes una cuenta?</Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerLink}>Regístrate</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  selectContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
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
    borderBottomColor: '#EEE',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOption: {
    color: '#2D6CDF',
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  passwordToggle: {
    justifyContent: 'center',
    padding: 12,
  },
  passwordToggleText: {
    color: '#2D6CDF',
    fontSize: 14,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#2D6CDF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#2D6CDF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#A0BFF0',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 14,
    marginRight: 5,
  },
  registerLink: {
    color: '#2D6CDF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginForm; 