import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  isLargeDevice: height > 800,
  
  // Espaciado
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Bordes redondeados
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 20,
    xl: 25,
    xxl: 40,
    circular: 999, // Para elementos circulares
  },
  
  // Paddings estándar
  padding: {
    screen: 20,
    card: 15,
    button: 15,
    input: 15,
  },
  
  // Alturas estándar
  height: {
    input: 50,
    button: 50,
    header: 60,
    tabBar: Platform.OS === 'ios' ? 85 : 65,
    iconButton: 40,
  },
  
  // Dimensiones de iconos
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  },
  
  // Elevaciones (sombras)
  elevation: {
    none: 0,
    xs: 1,
    sm: 2,
    md: 4,
    lg: 8,
    xl: 16,
  },
  
  // Estilos de sombras
  shadowStyle: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
}; 