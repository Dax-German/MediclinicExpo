# MediClinic - Aplicación Móvil para Gestión de Citas Médicas

Una aplicación móvil desarrollada con React Native y Expo que permite a los usuarios gestionar sus citas médicas, ver especialidades médicas, recibir alertas y administrar su perfil médico.

## Requisitos

- Node.js 14.x o superior
- npm 7.x o superior
- Expo CLI 5.x o superior
- React Native 0.76.x
- Dispositivo móvil o emulador con **Expo Go SDK 52** instalado

## Instalación de Dependencias

1. Clonar el repositorio
```bash
git clone https://github.com/usuario/mediclinicexpo.git
cd mediclinicexpo
```

2. Instalar dependencias
```bash
npm install
```

3. Iniciar la aplicación
```bash
npm start
npx expo start
```

4. Escanear el código QR con la aplicación Expo Go (disponible en Google Play o App Store)

## Pantallas de la Aplicación

### Autenticación y Registro
- **LoginScreen**: Pantalla de inicio de sesión con verificación por tipo y número de documento
- **RegisterScreen**: Registro de usuarios nuevos con validaciones avanzadas
- **ForgotPasswordScreen**: Recuperación de contraseña mediante correo electrónico

### Navegación Principal
- **HomeScreen**: Pantalla principal con acceso rápido a especialidades y resumen de información
- **AppointmentsScreen**: Vista y gestión de citas médicas (próximas e históricas)
- **ScheduleAppointmentScreen**: Proceso paso a paso para agendar nuevas citas
- **SpecialtiesScreen**: Lista completa de especialidades médicas disponibles
- **AlertsScreen**: Centro de notificaciones y alertas para el usuario

### Perfil y Configuración
- **ProfileScreen**: Información general del perfil del usuario
- **EditProfileScreen**: Edición de datos básicos del perfil
- **PhotoPickerScreen**: Selección y edición de foto de perfil
- **PersonalInfoScreen**: Información personal detallada
- **MedicalHistoryScreen**: Historial médico del usuario
- **SettingsScreen**: Configuración general de la aplicación
- **SupportScreen**: Ayuda y soporte técnico

## Dependencias Principales

```json
"dependencies": {
  "@expo/vector-icons": "^14.1.0",
  "@react-native-async-storage/async-storage": "^2.1.2",
  "@react-native-picker/picker": "^2.11.0",
  "@react-navigation/bottom-tabs": "^7.2.0",
  "@react-navigation/native": "^7.0.14",
  "expo": "~52.0.42",
  "expo-blur": "~14.0.3",
  "expo-constants": "~17.0.8",
  "expo-font": "~13.0.4",
  "expo-haptics": "~14.0.1",
  "expo-image-picker": "^16.0.6",
  "expo-linking": "~7.0.5",
  "expo-router": "~4.0.19",
  "expo-splash-screen": "~0.29.22",
  "expo-status-bar": "~2.0.1",
  "expo-symbols": "~0.2.2",
  "expo-system-ui": "~4.0.9",
  "expo-web-browser": "~14.0.2",
  "react": "18.3.1",
  "react-native": "0.76.8",
  "react-native-gesture-handler": "~2.20.2",
  "react-native-reanimated": "~3.16.1",
  "react-native-safe-area-context": "4.12.0",
  "react-native-screens": "~4.4.0",
  "react-native-webview": "13.12.5"
}
```

## Características Principales

### Sistema de Autenticación
- Inicio de sesión mediante tipo y número de documento
- Registro con validaciones de seguridad (contraseña con requisitos avanzados)
- Recuperación de contraseña por correo electrónico
- Persistencia de sesión con AsyncStorage

### Gestión de Citas Médicas
- Visualización de citas programadas e históricas
- Programación de nuevas citas mediante proceso de 3 pasos:
  1. Selección de especialidad médica
  2. Selección de médico
  3. Selección de fecha y hora
- Cancelación de citas existentes
- Gestión de disponibilidad de médicos

### Gestión de Perfil de Usuario
- Visualización y edición de datos personales
- Carga y actualización de foto de perfil con la cámara o galería
- Historial médico personal
- Configuración de notificaciones y preferencias

### Especialidades Médicas
La aplicación gestiona varias especialidades médicas incluyendo:
- Medicina general
- Pediatría
- Planificación familiar
- Odontología
- Optometría
- Cardiología
- Dermatología

### Sistema de Alertas
- Notificaciones sobre citas próximas
- Recordatorios médicos
- Alertas del sistema

### Integración con Chatbot de Telegram
- Acceso directo al servicio de chatbot para consultas frecuentes desde la aplicación

## Navegación

La aplicación utiliza Expo Router para la navegación entre pantallas. La estructura de navegación incluye:

- Navegación por pestañas en la parte inferior
- Navegación modal para procesos como agendamiento de citas
- Navegación de pila para secciones como perfil y configuración

## Almacenamiento Local

La aplicación utiliza AsyncStorage para almacenar datos localmente como:
- Información de sesión del usuario
- Configuraciones personalizadas
- Imagen de perfil
- Datos temporales de formularios

## Notas Importantes

1. **Compatibilidad**: Esta aplicación requiere Expo Go SDK 52 para funcionar correctamente.
2. **Imágenes de Perfil**: Las imágenes se almacenan localmente utilizando AsyncStorage.
3. **Simulación de API**: Actualmente la aplicación utiliza datos simulados. Los servicios API han sido eliminados temporalmente.

## Instrucciones para Desarrolladores

### Ejecutar en Modo Desarrollo
```bash
npm start
```

### Ejecutar en Dispositivo Android
```bash
npm run android
```

### Ejecutar en Dispositivo iOS
```bash
npm run ios
```

### Reiniciar Proyecto (Limpia Caché)
```bash
npm run reset-project
```

## Estado del Proyecto

El proyecto se encuentra en fase de desarrollo activo, con nuevas características y mejoras siendo implementadas regularmente. Los servicios de backend han sido eliminados temporalmente y serán reintegrados en próximas actualizaciones.



