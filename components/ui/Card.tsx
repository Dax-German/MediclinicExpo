import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';

interface CardProps extends ViewProps {
  style?: ViewStyle;
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  style,
  children,
  variant = 'default',
  ...rest
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return [styles.card, styles.elevatedCard, style];
      case 'flat':
        return [styles.card, styles.flatCard, style];
      default:
        return [styles.card, styles.defaultCard, style];
    }
  };

  return (
    <View style={getCardStyle()} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  defaultCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  elevatedCard: {
    backgroundColor: Colors.white,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  flatCard: {
    backgroundColor: Colors.secondary,
  },
}); 