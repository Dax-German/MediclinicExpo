import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RegisterData } from './services/index';

export default function RegisterScreen() {
  const [documentType, setDocumentType] = useState('cedula');
  const [documentNumber, setDocumentNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDocumentTypePicker, setShowDocumentTypePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Si el estado de redirección está activo, redirigir a LoginScreen
  if (redirectToLogin) {
    return <Redirect href={"/LoginScreen" as any} />;
  }

  // Función para renderizar el texto del tipo de documento seleccionado
  const getDocumentTypeText = () => {
    switch(documentType) {
      case 'cedula': return 'Cédula de Ciudadanía';
      case 'pasaporte': return 'Pasaporte';
      case 'ti': return 'Tarjeta de Identidad';
      default: return 'Seleccionar tipo de documento';
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validación del tipo y número de documento
    if (!documentType) {
      newErrors.documentType = 'El tipo de documento es requerido';
    }
    
    if (!documentNumber.trim()) {
      newErrors.documentNumber = 'El número de documento es requerido';
    }

    // Validación del nombre
    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    // Validación del email
    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Formato de correo electrónico inválido';
    }

    // Validación del teléfono
    if (!phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos';
    }

    // Validación de la contraseña
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 10) {
      newErrors.password = 'La contraseña debe tener al menos 10 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])/.test(password)) {
      newErrors.password = 'La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial';
    }

    // Validación de confirmación de contraseña
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        // Preparamos los datos para el registro
        const userData: RegisterData = {
          documentType,
          documentNumber,
          name,
          email,
          phone,
          password
        };

        // TODO: Cuando la API esté lista, descomentar este bloque
        /*
        await authService.register(userData);
        console.log('Usuario registrado exitosamente');
        */
        
        // Simulamos un tiempo de espera para desarrollo
        setTimeout(() => {
          setIsLoading(false);
          // Redirigir a login después del registro exitoso
          setRedirectToLogin(true);
        }, 1000);
      } catch (error) {
        setIsLoading(false);
        alert(`Error al registrar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    } else {
      // Datos inválidos, no permitir continuar
      console.log('Error en la validación del formulario');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => setRedirectToLogin(true)}
        >
          <Image source={require('../assets/Iconos/volver.png')} style={{width: 24, height: 24}} />
        </TouchableOpacity>
        
        <View style={styles.header}>
          <Image 
            source={require('../assets/Iconos/app-medica.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>
            Completa tus datos para registrarte en MediClinic
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo de documento</Text>
            <TouchableOpacity
              style={styles.selectInput}
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
            
            {errors.documentType ? <Text style={styles.errorText}>{errors.documentType}</Text> : null}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Número de documento</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu número de documento"
              value={documentNumber}
              onChangeText={setDocumentNumber}
              keyboardType="numeric"
            />
            {errors.documentNumber ? <Text style={styles.errorText}>{errors.documentNumber}</Text> : null}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu nombre"
              value={name}
              onChangeText={setName}
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu número de teléfono"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={24} 
                  color="#888" 
                />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={24} 
                  color="#888" 
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
          </View>
          
          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>{isLoading ? 'Registrando...' : 'Registrarse'}</Text>
          </TouchableOpacity>
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => setRedirectToLogin(true)}>
              <Text style={styles.loginLink}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 60,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D6CDF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#444',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectText: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0077B6',
    textAlign: 'center',
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOption: {
    color: '#0077B6',
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  registerButton: {
    backgroundColor: '#2D6CDF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#555',
  },
  loginLink: {
    fontSize: 14,
    color: '#2D6CDF',
    fontWeight: '500',
  },
}); 