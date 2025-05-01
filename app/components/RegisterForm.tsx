import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

// Definimos el tipo localmente
interface RegisterData {
  name: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  password: string;
}

interface RegisterFormProps {
  onSuccess?: () => void;
  onLogin?: () => void;
}

const RegisterForm = ({ onSuccess, onLogin }: RegisterFormProps) => {
  const router = useRouter();
  
  // Estados para los campos del formulario
  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState('cedula');
  const [documentNumber, setDocumentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados auxiliares
  const [showDocumentTypePicker, setShowDocumentTypePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Función para validar el formulario
  const validateForm = (): string | null => {
    if (!name || !documentType || !documentNumber || !email || !phone || !password || !confirmPassword) {
      return 'Todos los campos son obligatorios';
    }
    
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    
    // Validación de email con regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Ingrese un correo electrónico válido';
    }
    
    // Validación básica del teléfono
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return 'Ingrese un número de teléfono válido (10 dígitos)';
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
        password,
        passwordConfirmation: confirmPassword
      };
      
      // Llamar al servicio de registro
      const response = await apiServices.auth.register(apiRegisterData);
      
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
    } catch (error) {
      console.error('Error al registrarse:', error);
      setError('Error al registrar el usuario. Por favor, inténtelo de nuevo.');
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        {/* Título del formulario */}
        <Text style={styles.title}>Crear cuenta</Text>
        
        {/* Mostrar mensaje de error si existe */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
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
          <Text style={styles.selectText}>{getDocumentTypeText()}</Text>
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
});

export default RegisterForm; 