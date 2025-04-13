import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Alert = {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'appointment' | 'medication' | 'result' | 'general';
  read: boolean;
};

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'Recordatorio de cita',
      message: 'Tienes una cita con el Dr. Carlos Rodríguez mañana a las 9:30 AM.',
      date: '01/04/2024',
      type: 'appointment',
      read: false,
    },
    {
      id: '2',
      title: 'Resultados disponibles',
      message: 'Tus resultados de laboratorio ya están disponibles para consulta.',
      date: '30/03/2024',
      type: 'result',
      read: false,
    },
    {
      id: '3',
      title: 'Recordatorio de medicación',
      message: 'No olvides tomar tu medicación diaria.',
      date: '28/03/2024',
      type: 'medication',
      read: true,
    },
    {
      id: '4',
      title: 'Información general',
      message: 'Nuevos horarios de atención durante Semana Santa.',
      date: '25/03/2024',
      type: 'general',
      read: true,
    },
  ]);

  const getIconByType = (type: Alert['type']): IconName => {
    switch (type) {
      case 'appointment':
        return 'calendar-outline';
      case 'medication':
        return 'medkit-outline';
      case 'result':
        return 'document-text-outline';
      case 'general':
        return 'information-circle-outline';
      default:
        return 'notifications-outline';
    }
  };

  const markAsRead = (id: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };

  const renderAlert = ({ item }: { item: Alert }) => (
    <TouchableOpacity
      style={[styles.alertItem, item.read ? styles.readAlert : styles.unreadAlert]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.alertIcon}>
        <Ionicons name={getIconByType(item.type)} size={24} color="#2D6CDF" />
      </View>
      <View style={styles.alertContent}>
        <View style={styles.alertHeader}>
          <Text style={styles.alertTitle}>{item.title}</Text>
          <Text style={styles.alertDate}>{item.date}</Text>
        </View>
        <Text style={styles.alertMessage}>{item.message}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alertas</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <View style={styles.alertsHeader}>
          <Text style={styles.alertsCount}>
            {alerts.filter(a => !a.read).length} no leídas
          </Text>
          <TouchableOpacity onPress={() => setAlerts(alerts.map(a => ({ ...a, read: true })))}>
            <Text style={styles.markAllRead}>Marcar todas como leídas</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={alerts}
          renderItem={renderAlert}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.alertsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={50} color="#ccc" />
              <Text style={styles.emptyStateText}>No tienes alertas</Text>
            </View>
          }
        />
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
    padding: 20,
  },
  alertsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  alertsCount: {
    fontSize: 14,
    color: '#555',
  },
  markAllRead: {
    fontSize: 14,
    color: '#2D6CDF',
    fontWeight: '500',
  },
  alertsList: {
    paddingBottom: 20,
  },
  alertItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  unreadAlert: {
    backgroundColor: '#EDF1FA',
  },
  readAlert: {
    backgroundColor: 'white',
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDF1FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertDate: {
    fontSize: 12,
    color: '#777',
  },
  alertMessage: {
    fontSize: 14,
    color: '#555',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2D6CDF',
    marginLeft: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#777',
    marginTop: 10,
  },
}); 