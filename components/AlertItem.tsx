import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export type AlertType = 'appointment' | 'medication' | 'result' | 'general';

export interface AlertData {
  id: string;
  title: string;
  message: string;
  date: string;
  type: AlertType;
  read: boolean;
}

interface AlertItemProps {
  alert: AlertData;
  onPress?: () => void;
  style?: ViewStyle;
}

export const AlertItem: React.FC<AlertItemProps> = ({
  alert,
  onPress,
  style,
}) => {
  const getIconByType = (type: AlertType): IconName => {
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

  return (
    <TouchableOpacity
      style={[
        styles.container,
        alert.read ? styles.readAlert : styles.unreadAlert,
        style
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={getIconByType(alert.type)} size={24} color={Colors.primary} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{alert.title}</Text>
          <Text style={styles.date}>{alert.date}</Text>
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {alert.message}
        </Text>
      </View>
      {!alert.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  readAlert: {
    backgroundColor: Colors.white,
  },
  unreadAlert: {
    backgroundColor: Colors.secondary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textDark,
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 5,
  },
  message: {
    fontSize: 14,
    color: Colors.textMedium,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginLeft: 10,
  },
}); 