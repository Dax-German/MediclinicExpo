import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DebugScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [rawData, setRawData] = useState<string>('');
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [allKeys, setAllKeys] = useState<string[]>([]);
  const [keyValues, setKeyValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Cargar datos del usuario
        const userJson = await AsyncStorage.getItem('@MediClinic:user');
        if (userJson) {
          setUserData(JSON.parse(userJson));
          setRawData(userJson);
        }
        
        // Obtener todas las claves en AsyncStorage
        const keys = await AsyncStorage.getAllKeys();
        setAllKeys([...keys]);
        
        // Obtener valores de las claves
        const values: Record<string, string> = {};
        for (const key of keys) {
          const value = await AsyncStorage.getItem(key);
          values[key] = value || 'null';
        }
        setKeyValues(values);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    
    loadUserData();
  }, []);

  const handleBackPress = () => {
    setRedirectTo('/ProfileScreen');
  };

  const handleClearStorage = async () => {
    try {
      await AsyncStorage.clear();
      // Recargar los datos
      setUserData(null);
      setRawData('');
      setAllKeys([]);
      setKeyValues({});
      alert('AsyncStorage limpiado correctamente');
    } catch (error) {
      console.error('Error al limpiar AsyncStorage:', error);
      alert('Error al limpiar AsyncStorage');
    }
  };

  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen options={{ 
        headerShown: false 
      }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Depuración</Text>
        <TouchableOpacity onPress={handleClearStorage} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.dataContainer}>
          <Text style={styles.sectionTitle}>Datos del usuario (@MediClinic:user)</Text>
          
          {userData ? (
            <>
              <Text style={styles.infoLabel}>ID: <Text style={styles.infoValue}>{userData.id}</Text></Text>
              <Text style={styles.infoLabel}>Nombre: <Text style={styles.infoValue}>
                {userData.firstName && userData.lastName 
                  ? `${userData.firstName} ${userData.lastName}`
                  : userData.name || 'No disponible'}
              </Text></Text>
              <Text style={styles.infoLabel}>Email: <Text style={styles.infoValue}>{userData.email || 'No disponible'}</Text></Text>
              <Text style={styles.infoLabel}>Teléfono: <Text style={styles.infoValue}>{userData.phone || 'No disponible'}</Text></Text>
              <Text style={styles.infoLabel}>Dirección: <Text style={styles.infoValue}>{userData.address || 'No disponible'}</Text></Text>
              <Text style={styles.infoLabel}>Documento: <Text style={styles.infoValue}>
                {userData.documentType && userData.documentNumber 
                  ? `${userData.documentType} ${userData.documentNumber}`
                  : 'No disponible'}
              </Text></Text>
              
              <Text style={styles.sectionTitle}>Datos en formato JSON:</Text>
              <Text style={styles.jsonData}>{rawData}</Text>
            </>
          ) : (
            <Text style={styles.noDataText}>No hay datos de usuario almacenados</Text>
          )}
        </View>
        
        <View style={styles.dataContainer}>
          <Text style={styles.sectionTitle}>Todas las claves en AsyncStorage</Text>
          
          {allKeys.length > 0 ? (
            <>
              {allKeys.map((key, index) => (
                <View key={index} style={styles.keyValueContainer}>
                  <Text style={styles.keyText}>{key}</Text>
                  <Text style={styles.valueText}>{
                    keyValues[key]?.length > 100 
                      ? keyValues[key].substring(0, 100) + '...' 
                      : keyValues[key]
                  }</Text>
                </View>
              ))}
            </>
          ) : (
            <Text style={styles.noDataText}>No hay claves en AsyncStorage</Text>
          )}
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
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 8,
    backgroundColor: 'rgba(255,0,0,0.3)',
    borderRadius: 5,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  dataContainer: {
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
    marginTop: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  infoValue: {
    color: '#333',
    fontWeight: '500',
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  jsonData: {
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  keyValueContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  keyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  valueText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#777',
  },
}); 