import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, Platform } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export default function TabLayout() {
  useEffect(() => {
    console.log('[TabLayout] Montando componente TabLayout');
    
    // Imprimir información de la plataforma
    console.log('[TabLayout] Plataforma:', Platform.OS);
    console.log('[TabLayout] Versión:', Platform.Version);
    
    return () => {
      console.log('[TabLayout] Desmontando componente TabLayout');
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2D6CDF',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={require('../../assets/Iconos/app.png')}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Citas',
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={require('../../assets/Iconos/calendario.png')}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="specialties"
        options={{
          title: 'Especialidades',
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={require('../../assets/Iconos/estetoscopio.png')}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={require('../../assets/Iconos/app.png')}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={require('../../assets/Iconos/app-medica.png')}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
