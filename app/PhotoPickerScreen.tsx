import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Redirect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';

export default function PhotoPickerScreen() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  if (redirectTo) {
    return <Redirect href={redirectTo as any} />;
  }

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        Alert.alert(
          'Permisos insuficientes',
          'Se necesitan permisos de cámara y librería para cambiar tu foto de perfil.',
          [{ text: 'Entendido' }]
        );
        return false;
      }
      return true;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo capturar la foto. Intente nuevamente.');
    }
  };

  const pickImage = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen. Intente nuevamente.');
    }
  };

  const savePhoto = async () => {
    if (selectedImage) {
      try {
        // Guardar la URL de la imagen en AsyncStorage
        await AsyncStorage.setItem('@MediClinic:profileImage', selectedImage);
        
        Alert.alert(
          'Foto guardada',
          'Tu foto de perfil ha sido actualizada exitosamente.',
          [
            {
              text: 'OK',
              onPress: () => setRedirectTo('/ProfileScreen'),
            },
          ]
        );
      } catch (error) {
        Alert.alert('Error', 'No se pudo guardar la foto. Intente nuevamente.');
      }
    } else {
      Alert.alert('Error', 'Por favor selecciona o toma una foto primero.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => setRedirectTo('/ProfileScreen')}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Foto de Perfil</Text>
      </View>

      {/* Foto de perfil */}
      <View style={styles.photoContainer}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="person" size={80} color="#ccc" />
          </View>
        )}
      </View>

      {/* Opciones */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={takePhoto}>
          <Ionicons name="camera" size={28} color={Colors.white} />
          <Text style={styles.optionText}>Tomar foto</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
          <Ionicons name="images" size={28} color={Colors.white} />
          <Text style={styles.optionText}>Elegir de galería</Text>
        </TouchableOpacity>
      </View>

      {/* Botón guardar */}
      <TouchableOpacity 
        style={[styles.saveButton, !selectedImage && styles.disabledButton]} 
        onPress={savePhoto}
        disabled={!selectedImage}
      >
        <Text style={styles.saveButtonText}>Guardar foto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: Colors.textDark,
  },
  photoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  placeholderImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#eee',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 30,
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '45%',
  },
  optionText: {
    color: Colors.white,
    marginTop: 8,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 30,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 40,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
}); 