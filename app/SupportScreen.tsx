import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Tipo para las FAQs
type FAQ = {
  id: string;
  question: string;
  answer: string;
  expanded: boolean;
};

export default function SupportScreen() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: '¿Cómo programo una cita médica?',
      answer: 'Para programar una cita médica, dirígete a la pantalla principal y pulsa en "Agendar Cita". Luego selecciona la especialidad, el médico y la fecha que prefieras. Finalmente, confirma los detalles de tu cita.',
      expanded: false
    },
    {
      id: '2',
      question: '¿Puedo cancelar o reprogramar una cita?',
      answer: 'Sí, puedes cancelar o reprogramar una cita entrando a la sección "Mis Citas" y seleccionando la cita que deseas modificar. Allí encontrarás opciones para cancelar o reprogramar.',
      expanded: false
    },
    {
      id: '3',
      question: '¿Cómo puedo ver mi historial médico?',
      answer: 'Tu historial médico está disponible en la sección "Perfil", luego selecciona "Historial médico". Allí podrás ver tus consultas anteriores, prescripciones y resultados de laboratorio.',
      expanded: false
    },
    {
      id: '4',
      question: '¿Qué hago si olvidé mi contraseña?',
      answer: 'En la pantalla de inicio de sesión, pulsa en "¿Olvidaste tu contraseña?". Luego ingresa tu correo electrónico y sigue las instrucciones que te enviaremos para restablecerla.',
      expanded: false
    },
    {
      id: '5',
      question: '¿Cómo actualizo mi información personal?',
      answer: 'Ve a la sección "Perfil" y pulsa en "Editar perfil". Allí podrás actualizar tu nombre, correo electrónico, teléfono y dirección.',
      expanded: false
    }
  ]);
  
  // Si hay una redirección pendiente, realizarla
  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }

  const handleBackPress = () => {
    setRedirectTo('/ProfileScreen');
  };

  const toggleExpand = (id: string) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, expanded: !faq.expanded } : faq
    ));
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Por favor ingresa un mensaje');
      return;
    }
    
    // Aquí iría la lógica para enviar el mensaje al soporte
    Alert.alert(
      'Mensaje enviado',
      'Tu mensaje ha sido enviado. Te responderemos lo antes posible.',
      [{ text: 'OK', onPress: () => setMessage('') }]
    );
  };

  const handleCallSupport = () => {
    Alert.alert(
      'Llamar a soporte',
      '¿Deseas llamar a nuestro equipo de soporte?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Llamar', onPress: () => Linking.openURL('tel:+573001234567') }
      ]
    );
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:soporte@mediclinic.com?subject=Ayuda%20con%20la%20aplicación');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayuda y Soporte</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preguntas frecuentes</Text>
          {faqs.map(faq => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity 
                style={styles.faqQuestion}
                onPress={() => toggleExpand(faq.id)}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <Ionicons 
                  name={faq.expanded ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
              
              {faq.expanded && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contáctanos</Text>
          
          <View style={styles.contactOptions}>
            <TouchableOpacity 
              style={styles.contactOption}
              onPress={handleCallSupport}
            >
              <View style={[styles.contactIconContainer, { backgroundColor: '#e6f7e6' }]}>
                <Ionicons name="call-outline" size={22} color="#4CAF50" />
              </View>
              <Text style={styles.contactText}>Llamar a soporte</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactOption}
              onPress={handleEmailSupport}
            >
              <View style={[styles.contactIconContainer, { backgroundColor: '#e8eaf6' }]}>
                <Ionicons name="mail-outline" size={22} color="#3F51B5" />
              </View>
              <Text style={styles.contactText}>Enviar email</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactOption}
              onPress={() => Linking.openURL('https://mediclinic.com/ayuda')}
            >
              <View style={[styles.contactIconContainer, { backgroundColor: '#fff3e0' }]}>
                <Ionicons name="help-circle-outline" size={22} color="#FF9800" />
              </View>
              <Text style={styles.contactText}>Centro de ayuda</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Envíanos un mensaje</Text>
          
          <TextInput
            style={styles.messageInput}
            placeholder="Escribe tu mensaje aquí..."
            multiline
            value={message}
            onChangeText={setMessage}
          />
          
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Text style={styles.sendButtonText}>Enviar mensaje</Text>
          </TouchableOpacity>
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
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  faqItem: {
    marginBottom: 10,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
  },
  faqQuestionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    backgroundColor: '#EDF1FA',
    padding: 15,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: 1,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  contactOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  contactOption: {
    alignItems: 'center',
    width: '30%',
  },
  contactIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  messageInput: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sendButton: {
    backgroundColor: '#2D6CDF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
}); 