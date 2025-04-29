import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si el estado de redirección está activo, redirigir a LoginScreen
  if (redirectToLogin) {
    return <Redirect href={"/LoginScreen" as any} />;
  }

  const handleSendResetLink = async () => {
    if (!email.trim()) {
      setError('Por favor, ingrese su correo electrónico');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    
    try {
      // Llamada al servicio de recuperación (comentado para desarrollo)
      /* const success = await authService.requestPasswordReset(email);
      
      if (success) {
        setResetSent(true);
      } else {
        setError('No se pudo enviar el enlace. Intente de nuevo más tarde.');
      } */
      
      // Simulamos el envío del enlace de restablecimiento
      setTimeout(() => {
        setIsSubmitting(false);
        setResetSent(true);
      }, 1500);
    } catch (error) {
      setIsSubmitting(false);
      setError('Ocurrió un error al procesar su solicitud. Intente de nuevo más tarde.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => setRedirectToLogin(true)}
      >
        <Image source={require('../assets/Iconos/volver.png')} style={{width: 24, height: 24}} />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Image 
          source={require('../assets/Iconos/app-medica.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
        
        {!resetSent ? (
          <>
            <Text style={styles.description}>
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isSubmitting}
            />
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
            <TouchableOpacity 
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleSendResetLink}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? 'Enviando...' : 'Enviar enlace'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={60} color="#2D6CDF" />
            <Text style={styles.successText}>
              Hemos enviado un enlace de restablecimiento a tu correo electrónico
            </Text>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => setRedirectToLogin(true)}
            >
              <Text style={styles.buttonText}>Volver al inicio de sesión</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: -40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D6CDF',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2D6CDF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#a0b8e0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    width: '100%',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginVertical: 20,
  },
}); 