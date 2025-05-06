import React from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * Componente que oculta visualmente los mensajes de error en la parte inferior de la pantalla
 */
const ErrorHider: React.FC = () => {
  return (
    <View style={styles.errorCover} pointerEvents="none" />
  );
};

const styles = StyleSheet.create({
  errorCover: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30, // Altura suficiente para cubrir los mensajes de error
    backgroundColor: '#fff', // Usa el color de fondo de tu aplicación
    zIndex: 9999,
    elevation: 9999,
  }
});

export default ErrorHider; 