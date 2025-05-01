import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import apiServices from '../../src/api/services';
import { DOCUMENT_TYPES, getDocumentTypeText } from '../../src/constants/documentTypes';

// Definimos el tipo localmente
interface RegisterData {
  name: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
  role?: string;
  defaultSchedule?: boolean;
  specialtyId?: number;
  physicalLocationId?: number;
}

interface RegisterFormProps {
  onSuccess?: () => void;
  onLogin?: () => void;
}

const RegisterForm = ({ onSuccess, onLogin }: RegisterFormProps) => {
  const router = useRouter();
  
  // Estados para los campos del formulario
  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState(DOCUMENT_TYPES.CITIZENSHIP_CARD);
  const [documentNumber, setDocumentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('MALE');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados auxiliares
  const [showDocumentTypePicker, setShowDocumentTypePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Depuración de los valores de documento al iniciar
  useEffect(() => {
    console.log('RegisterForm - Valores de DOCUMENT_TYPES:', JSON.stringify(DOCUMENT_TYPES, null, 2));
    console.log('RegisterForm - Valor inicial de documentType:', documentType);
  }, []);

  // Función para validar el formulario
  const validateForm = (): string | null => {
    if (!name || !documentType || !documentNumber || !email || !phone || !gender || !password || !confirmPassword) {
      return 'Todos los campos son obligatorios';
    }
    
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    
    // Validación de la contraseña según el error mostrado
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial';
    }
    
    // Validación de email con regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Ingrese un correo electrónico válido';
    }
    
    // Validación básica del teléfono
    const phoneRegex = /^[0-9]{7,10}$/;
    if (!phoneRegex.test(phone)) {
      return 'Ingrese un número de teléfono válido (entre 7 y 10 dígitos)';
    }
    
    return null;
  };

  // Función para manejar el registro
  const handleRegister = async () => {
    // Validar formulario
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    // Resetear error previo
    setError(null);
    setIsLoading(true);
    
    try {
      // Adaptar formato para la API
      const apiRegisterData = {
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
        documentType,
        documentNumber,
        email,
        phone,
        gender,
        password,
        passwordConfirmation: confirmPassword,
        // Valores predeterminados para campos adicionales
        role: 'USER',
        defaultSchedule: false,
        specialtyId: 5,  // Usar mismo valor que el usuario de referencia
        physicalLocationId: 1  // Usar mismo valor que el usuario de referencia
      };
      
      // Log para depurar
      console.log('Intentando registro con datos:', JSON.stringify(apiRegisterData, null, 2));
      
      // Llamar al servicio de registro
      const response = await apiServices.auth.register(apiRegisterData);
      
      // Log para depurar
      console.log('Respuesta de registro:', JSON.stringify(response, null, 2));
      
      if (response && response.token) {
        // Si se recibe un token, el registro fue exitoso e incluye login
        // Redireccionar o ejecutar callback
        if (onSuccess) {
          onSuccess();
        } else {
          router.replace('/HomeScreen');
        }
      } else {
        // Si no hay token, podemos redirigir a login
        alert('Registro exitoso. Inicia sesión para continuar');
        if (onLogin) {
          onLogin();
        } else {
          router.replace('/LoginScreen');
        }
      }
    } catch (error: any) {
      console.error('Error al registrarse:', error);
      
      // Mostrar detalles del error para depuración
      if (error.data) {
        console.error('Detalles del error de registro:', JSON.stringify(error.data, null, 2));
      }
      
      // Mostrar un mensaje de error más informativo
      let errorMessage = 'Error al registrar el usuario. Por favor, inténtelo de nuevo.';
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

  // Función para navegar a inicio de sesión
  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      router.replace('/LoginScreen');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* Título del formulario */}
        <Text style={styles.title}>Crear cuenta</Text>
        
        {/* Mostrar mensaje de error si existe */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        <ScrollView
          showsVerticalScrollIndicator={true}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {/* Campo para nombre completo */}
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su nombre completo"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
          
          {/* Selector de tipo de documento */}
          <Text style={styles.label}>Tipo de documento</Text>
          <TouchableOpacity
            style={styles.selectContainer}
            onPress={() => setShowDocumentTypePicker(true)}
          >
            <Text style={styles.selectText}>{getDocumentTypeText(documentType)}</Text>
          </TouchableOpacity>
          
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
          
          {/* Campo para correo electrónico */}
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su correo electrónico"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          
          {/* Campo para teléfono */}
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su número de teléfono"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          
          {/* Campo para género */}
          <Text style={styles.label}>Género</Text>
          <TouchableOpacity
            style={styles.selectContainer}
            onPress={() => setShowGenderPicker(true)}
          >
            <Text style={styles.selectText}>{gender === 'MALE' ? 'Masculino' : 'Femenino'}</Text>
          </TouchableOpacity>
          
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
          
          {/* Campo para confirmar contraseña */}
          <Text style={styles.label}>Confirmar contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirme su contraseña"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity 
              style={styles.passwordToggle}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.passwordToggleText}>
                {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Botón de registro */}
          <TouchableOpacity 
            style={[styles.registerButton, isLoading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Crear cuenta</Text>
            )}
          </TouchableOpacity>
          
          {/* Enlace para iniciar sesión */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Modales para selección (fuera del ScrollView para evitar anidamiento) */}
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

      {/* Modal para seleccionar género */}
      <Modal
        visible={showGenderPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGenderPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowGenderPicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccionar género</Text>
              
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={() => {
                  setGender('MALE');
                  setShowGenderPicker(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText, 
                  gender === 'MALE' && styles.selectedOption
                ]}>Masculino</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={() => {
                  setGender('FEMALE');
                  setShowGenderPicker(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText, 
                  gender === 'FEMALE' && styles.selectedOption
                ]}>Femenino</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  registerButton: {
    backgroundColor: '#2D6CDF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#A0BFF0',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
    marginRight: 5,
  },
  loginLink: {
    color: '#2D6CDF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
});

export default RegisterForm; 