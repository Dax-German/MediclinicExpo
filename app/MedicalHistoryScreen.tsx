import { Ionicons } from '@expo/vector-icons';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Tipos para el historial médico
type MedicalRecord = {
  id: string;
  date: string;
  doctorName: string;
  specialty: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  labResults?: LabResult[];
};

type LabResult = {
  id: string;
  name: string;
  date: string;
  result: string;
  normalRange: string;
  status: 'normal' | 'abnormal';
};

export default function MedicalHistoryScreen() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  // Datos de ejemplo - en una implementación real vendrían de una API o almacenamiento local
  const medicalRecords: MedicalRecord[] = [
    {
      id: '1',
      date: '12/03/2024',
      doctorName: 'Dr. Carlos Rodríguez',
      specialty: 'Medicina General',
      diagnosis: 'Infección respiratoria aguda',
      treatment: 'Reposo y medicación',
      notes: 'Paciente presenta tos y congestión nasal desde hace 3 días.'
    },
    {
      id: '2',
      date: '05/02/2024',
      doctorName: 'Dra. Ana María Torres',
      specialty: 'Cardiología',
      diagnosis: 'Evaluación de rutina',
      treatment: 'Sin tratamiento específico',
      notes: 'Paciente asintomático. Se solicita electrocardiograma de control.',
      labResults: [
        {
          id: 'l1',
          name: 'Electrocardiograma',
          date: '05/02/2024',
          result: 'Normal',
          normalRange: 'N/A',
          status: 'normal'
        }
      ]
    },
    {
      id: '3',
      date: '10/12/2023',
      doctorName: 'Dr. Juan Martínez',
      specialty: 'Medicina General',
      diagnosis: 'Control anual',
      treatment: 'Recomendaciones generales',
      labResults: [
        {
          id: 'l2',
          name: 'Hemograma',
          date: '15/12/2023',
          result: '14.2 g/dL',
          normalRange: '13.5-17.5 g/dL',
          status: 'normal'
        },
        {
          id: 'l3',
          name: 'Colesterol total',
          date: '15/12/2023',
          result: '215 mg/dL',
          normalRange: '<200 mg/dL',
          status: 'abnormal'
        }
      ]
    }
  ];
  
  // Si hay una redirección pendiente, realizarla
  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }

  const handleBackPress = () => {
    if (selectedRecord) {
      // Si hay un registro seleccionado, volver a la lista
      setSelectedRecord(null);
    } else {
      // De lo contrario, volver a la pantalla de perfil
      setRedirectTo('/ProfileScreen');
    }
  };

  // Función para renderizar un registro médico en la lista
  const renderRecordItem = ({ item }: { item: MedicalRecord }) => (
    <TouchableOpacity 
      style={styles.recordItem}
      onPress={() => setSelectedRecord(item)}
    >
      <View style={styles.recordHeader}>
        <Text style={styles.recordDate}>{item.date}</Text>
        <Text style={styles.recordSpecialty}>{item.specialty}</Text>
      </View>
      <Text style={styles.recordDoctor}>{item.doctorName}</Text>
      <Text style={styles.recordDiagnosis}>{item.diagnosis}</Text>
      <View style={styles.recordDetail}>
        {item.labResults && (
          <View style={styles.detailBadge}>
            <Ionicons name="flask-outline" size={12} color="#2D6CDF" />
            <Text style={styles.detailBadgeText}>
              {item.labResults.length} resultados
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Función para renderizar el detalle de un registro médico
  const renderRecordDetail = () => {
    if (!selectedRecord) return null;

    return (
      <ScrollView style={styles.detailContainer}>
        <View style={styles.detailHeader}>
          <Text style={styles.detailDate}>{selectedRecord.date}</Text>
          <Text style={styles.detailSpecialty}>{selectedRecord.specialty}</Text>
        </View>
        
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Doctor</Text>
          <Text style={styles.detailValue}>{selectedRecord.doctorName}</Text>
        </View>
        
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Diagnóstico</Text>
          <Text style={styles.detailValue}>{selectedRecord.diagnosis}</Text>
        </View>
        
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Tratamiento</Text>
          <Text style={styles.detailValue}>{selectedRecord.treatment}</Text>
        </View>
        
        {selectedRecord.notes && (
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Notas</Text>
            <Text style={styles.detailValue}>{selectedRecord.notes}</Text>
          </View>
        )}
        
        {selectedRecord.labResults && selectedRecord.labResults.length > 0 && (
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Resultados de laboratorio</Text>
            {selectedRecord.labResults.map(lab => (
              <View key={lab.id} style={styles.labResultItem}>
                <View style={styles.labResultHeader}>
                  <Text style={styles.labResultName}>{lab.name}</Text>
                  <View style={[
                    styles.labResultStatus, 
                    { backgroundColor: lab.status === 'normal' ? '#e6f7e6' : '#ffebee' }
                  ]}>
                    <Text style={[
                      styles.labResultStatusText,
                      { color: lab.status === 'normal' ? '#4CAF50' : '#F44336' }
                    ]}>
                      {lab.status === 'normal' ? 'Normal' : 'Anormal'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.labResultDetail}>Fecha: {lab.date}</Text>
                <Text style={styles.labResultDetail}>Resultado: {lab.result}</Text>
                <Text style={styles.labResultDetail}>Rango normal: {lab.normalRange}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Ocultar el título de navegación nativo */}
      <Stack.Screen options={{ 
        headerShown: false 
      }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedRecord ? 'Detalles de Consulta' : 'Historial Médico'}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        {selectedRecord ? (
          renderRecordDetail()
        ) : (
          <FlatList
            data={medicalRecords}
            keyExtractor={(item) => item.id}
            renderItem={renderRecordItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
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
  },
  listContainer: {
    padding: 20,
  },
  recordItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  recordDate: {
    fontSize: 14,
    color: '#666',
  },
  recordSpecialty: {
    fontSize: 14,
    color: '#2D6CDF',
    fontWeight: '500',
  },
  recordDoctor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recordDiagnosis: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  recordDetail: {
    flexDirection: 'row',
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF1FA',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  detailBadgeText: {
    fontSize: 12,
    color: '#2D6CDF',
    marginLeft: 4,
  },
  detailContainer: {
    flex: 1,
    padding: 20,
  },
  detailHeader: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  detailDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detailSpecialty: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detailSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  labResultItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  labResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  labResultName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  labResultStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  labResultStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  labResultDetail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
}); 