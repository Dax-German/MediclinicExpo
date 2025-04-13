import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export interface SpecialtyData {
  id: string;
  name: string;
  icon: IconName;
  description: string;
}

interface SpecialtyCardProps {
  specialty: SpecialtyData;
  onPress?: () => void;
  style?: ViewStyle;
}

export const SpecialtyCard: React.FC<SpecialtyCardProps> = ({
  specialty,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, style]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={specialty.icon} size={28} color={Colors.primary} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{specialty.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {specialty.description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textMedium,
  },
}); 