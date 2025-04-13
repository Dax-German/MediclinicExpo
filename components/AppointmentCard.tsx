import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';
import { Card } from './ui/Card';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface AppointmentData {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  location?: string;
}

interface AppointmentCardProps {
  appointment: AppointmentData;
  onPress?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
  onViewDetails?: () => void;
  style?: ViewStyle;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onPress,
  onReschedule,
  onCancel,
  onViewDetails,
  style,
}) => {
  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
      case 'upcoming':
        return '';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return '';
    }
  };

  const getStatusStyle = (status: AppointmentStatus) => {
    switch (status) {
      case 'upcoming':
        return {};
      case 'completed':
        return styles.completedStatus;
      case 'cancelled':
        return styles.cancelledStatus;
      default:
        return {};
    }
  };

  const getStatusTextStyle = (status: AppointmentStatus) => {
    switch (status) {
      case 'upcoming':
        return {};
      case 'completed':
        return styles.completedStatusText;
      case 'cancelled':
        return styles.cancelledStatusText;
      default:
        return {};
    }
  };

  const statusText = getStatusText(appointment.status);

  return (
    <Card variant="elevated" style={{ ...styles.card, ...style }}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.appointmentHeader}>
          <Text style={styles.doctorName}>{appointment.doctor}</Text>
          {statusText ? (
            <View style={[styles.statusBadge, getStatusStyle(appointment.status)]}>
              <Text style={[styles.statusText, getStatusTextStyle(appointment.status)]}>
                {statusText}
              </Text>
            </View>
          ) : null}
        </View>
        
        <Text style={styles.specialty}>{appointment.specialty}</Text>
        
        {appointment.location ? (
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={16} color={Colors.textMedium} />
            <Text style={styles.infoText}>{appointment.location}</Text>
          </View>
        ) : null}
        
        <View style={styles.divider} />
        
        <View style={styles.appointmentInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textMedium} />
            <Text style={styles.infoText}>{appointment.date}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={16} color={Colors.textMedium} />
            <Text style={styles.infoText}>{appointment.time}</Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          {appointment.status === 'upcoming' ? (
            <>
              {onReschedule && (
                <TouchableOpacity style={styles.rescheduleButton} onPress={onReschedule}>
                  <Text style={styles.rescheduleButtonText}>Reprogramar</Text>
                </TouchableOpacity>
              )}
              {onCancel && (
                <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              )}
            </>
          ) : appointment.status === 'completed' && onViewDetails ? (
            <TouchableOpacity style={styles.viewDetailsButton} onPress={onViewDetails}>
              <Text style={styles.viewDetailsButtonText}>Ver detalles</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  container: {
    padding: 15,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textDark,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cancelledStatus: {
    backgroundColor: Colors.statusCancelled,
  },
  completedStatus: {
    backgroundColor: Colors.statusCompleted,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cancelledStatusText: {
    color: Colors.statusCancelledText,
  },
  completedStatusText: {
    color: Colors.statusCompletedText,
  },
  specialty: {
    fontSize: 14,
    color: Colors.textMedium,
    marginTop: 4,
    marginBottom: 5,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  appointmentInfo: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textMedium,
    marginLeft: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rescheduleButton: {
    backgroundColor: Colors.statusUpcoming,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  rescheduleButtonText: {
    color: Colors.statusUpcomingText,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: Colors.statusCancelled,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: Colors.statusCancelledText,
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewDetailsButton: {
    backgroundColor: Colors.statusUpcoming,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  viewDetailsButtonText: {
    color: Colors.statusUpcomingText,
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 