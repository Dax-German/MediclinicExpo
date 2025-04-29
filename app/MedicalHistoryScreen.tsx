import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
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
  prescriptions?: Prescription[];
  labResults?: LabResult[];
};

type Prescription = {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
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
  const [activeTab, setActiveTab] = useState<'records' | 'prescriptions' | 'labs'>('records');

  // Datos de ejemplo - en una implementación real vendrían de una API o almacenamiento local
  const medicalRecords: MedicalRecord[] = [
    {
      id: '1',
      date: '12/03/2024',
      doctorName: 'Dr. Carlos Rodríguez',
      specialty: 'Medicina General',
      diagnosis: 'Infección respiratoria aguda',
      treatment: 'Reposo y medicación',
      notes: 'Paciente presenta tos y congestión nasal desde hace 3 días.',
      prescriptions: [
        {
          id: 'p1',
          medication: 'Amoxicilina',
          dosage: '500mg',
          frequency: 'Cada 8 horas',
          duration: '7 días'
        },
        {
          id: 'p2',
          medication: 'Acetaminofén',
          dosage: '500mg',
          frequency: 'Cada 6 horas si hay dolor o fiebre',
          duration: '5 días'
        }
      ]
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
        {item.prescriptions && (
          <View style={styles.detailBadge}>
            <Ionicons name="medkit-outline" size={12} color="#2D6CDF" />
            <Text style={styles.detailBadgeText}>
              {item.prescriptions.length} prescripciones
            </Text>
          </View>
        )}
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
        
        {selectedRecord.prescriptions && selectedRecord.prescriptions.length > 0 && (
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Prescripciones</Text>
            {selectedRecord.prescriptions.map(prescription => (
              <View key={prescription.id} style={styles.prescriptionItem}>
                <Text style={styles.prescriptionName}>{prescription.medication}</Text>
                <Text style={styles.prescriptionDetail}>{prescription.dosage} - {prescription.frequency}</Text>
                <Text style={styles.prescriptionDetail}>Duración: {prescription.duration}</Text>
              </View>
            ))}
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

  // Obtener todos los resultados de laboratorio
  const allLabResults = medicalRecords
    .filter(record => record.labResults)
    .flatMap(record => record.labResults || []);

  // Obtener todas las prescripciones
  const allPrescriptions = medicalRecords
    .filter(record => record.prescriptions)
    .flatMap(record => record.prescriptions || []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedRecord ? 'Detalle de Consulta' : 'Historial Médico'}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {!selectedRecord && (
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'records' && styles.activeTabButton]}
            onPress={() => setActiveTab('records')}
          >
            <Text style={[styles.tabText, activeTab === 'records' && styles.activeTabText]}>
              Consultas
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'prescriptions' && styles.activeTabButton]}
            onPress={() => setActiveTab('prescriptions')}
          >
            <Text style={[styles.tabText, activeTab === 'prescriptions' && styles.activeTabText]}>
              Recetas
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'labs' && styles.activeTabButton]}
            onPress={() => setActiveTab('labs')}
          >
            <Text style={[styles.tabText, activeTab === 'labs' && styles.activeTabText]}>
              Laboratorios
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        {selectedRecord ? (
          renderRecordDetail()
        ) : (
          <>
            {activeTab === 'records' && (
              <FlatList
                data={medicalRecords}
                renderItem={renderRecordItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.recordsList}
              />
            )}
            
            {activeTab === 'prescriptions' && (
              <FlatList
                data={allPrescriptions}
                renderItem={({ item }) => (
                  <View style={styles.prescriptionItem}>
                    <Text style={styles.prescriptionName}>{item.medication}</Text>
                    <Text style={styles.prescriptionDetail}>{item.dosage} - {item.frequency}</Text>
                    <Text style={styles.prescriptionDetail}>Duración: {item.duration}</Text>
                  </View>
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.recordsList}
              />
            )}
            
            {activeTab === 'labs' && (
              <FlatList
                data={allLabResults}
                renderItem={({ item }) => (
                  <View style={styles.labResultItem}>
                    <View style={styles.labResultHeader}>
                      <Text style={styles.labResultName}>{item.name}</Text>
                      <View style={[
                        styles.labResultStatus, 
                        { backgroundColor: item.status === 'normal' ? '#e6f7e6' : '#ffebee' }
                      ]}>
                        <Text style={[
                          styles.labResultStatusText,
                          { color: item.status === 'normal' ? '#4CAF50' : '#F44336' }
                        ]}>
                          {item.status === 'normal' ? 'Normal' : 'Anormal'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.labResultDetail}>Fecha: {item.date}</Text>
                    <Text style={styles.labResultDetail}>Resultado: {item.result}</Text>
                    <Text style={styles.labResultDetail}>Rango normal: {item.normalRange}</Text>
                  </View>
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.recordsList}
              />
            )}
          </>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 5,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: '#EDF1FA',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#2D6CDF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  recordsList: {
    paddingBottom: 20,
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
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
  },
  recordDetail: {
    flexDirection: 'row',
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF1FA',
    paddingVertical: 3,
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
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    flex: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailDate: {
    fontSize: 16,
    color: '#666',
  },
  detailSpecialty: {
    fontSize: 16,
    color: '#2D6CDF',
    fontWeight: '500',
  },
  detailSection: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
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
  prescriptionItem: {
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
  prescriptionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  prescriptionDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  labResultItem: {
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
  labResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  labResultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  labResultStatus: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  labResultStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  labResultDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
}); 