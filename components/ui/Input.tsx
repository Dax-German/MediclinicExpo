import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/Colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  inputContainerStyle,
  labelStyle,
  errorStyle,
  leftIcon,
  rightIcon,
  isPassword = false,
  secureTextEntry,
  style,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const secureEntry = isPassword ? !isPasswordVisible : secureTextEntry;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          inputContainerStyle,
          error ? styles.inputContainerError : null,
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            (rightIcon || isPassword) ? styles.inputWithRightIcon : null,
            style,
          ]}
          placeholderTextColor={Colors.textLight}
          secureTextEntry={secureEntry}
          {...rest}
        />
        {isPassword ? (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color={Colors.textLight}
            />
          </TouchableOpacity>
        ) : (
          rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>
      {error ? <Text style={[styles.errorText, errorStyle]}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: Colors.textDark,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  inputContainerError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: Colors.textDark,
    paddingHorizontal: 15,
  },
  inputWithLeftIcon: {
    paddingLeft: 45,
  },
  inputWithRightIcon: {
    paddingRight: 45,
  },
  leftIconContainer: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: 15,
    zIndex: 1,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 5,
  },
}); 