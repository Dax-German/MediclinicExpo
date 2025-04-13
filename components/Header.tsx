import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  rightIcon,
  onRightIconPress,
  style,
  titleStyle,
}) => {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.header, style]}>
      {showBackButton ? (
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyLeft} />
      )}
      
      <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
      
      {rightIcon ? (
        <TouchableOpacity onPress={onRightIconPress} style={styles.rightButton}>
          <Ionicons name={rightIcon} size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyRight} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
    width: 34,
  },
  emptyLeft: {
    width: 34,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  rightButton: {
    padding: 5,
    width: 34,
  },
  emptyRight: {
    width: 34,
  },
}); 