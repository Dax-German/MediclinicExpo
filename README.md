# MediClinic - Aplicación Móvil para Gestión de Citas Médicas

Una aplicación móvil desarrollada con React Native y Expo que permite a los usuarios gestionar sus citas médicas, ver especialidades médicas, recibir alertas y administrar su perfil médico.

## Estructura de la Aplicación

La aplicación utiliza Expo Router para la navegación y está estructurada de la siguiente manera:

### Pantallas Principales

- **LoginScreen**: Pantalla de inicio de sesión con verificación por tipo y número de documento
- **RegisterScreen**: Pantalla de registro de usuarios con validaciones avanzadas
- **ForgotPasswordScreen**: Recuperación de contraseña mediante correo electrónico
- **HomeScreen**: Pantalla principal con resumen de información, especialidades y acceso rápido
- **AppointmentsScreen**: Gestión de citas médicas (programadas e históricas)
- **ScheduleAppointmentScreen**: Proceso paso a paso para agendar nuevas citas
- **SpecialtiesScreen**: Lista de especialidades médicas disponibles
- **AlertsScreen**: Notificaciones y alertas para el usuario
- **ProfileScreen**: Información del perfil del usuario

### Navegación

La aplicación utiliza un navegador de pestañas en la parte inferior con las siguientes opciones:

- Inicio
- Citas
- Especialidades
- Alertas
- Perfil

Cada pestaña redirige a su pantalla correspondiente.

## Organización del Código

### Carpeta `components`

Contiene componentes reutilizables organizados de la siguiente manera:

- **components/ui**: Componentes de interfaz básicos (Button, Input, Card)
- **components/AppointmentCard**: Tarjeta para mostrar citas médicas
- **components/SpecialtyCard**: Tarjeta para mostrar especialidades
- **components/Header**: Componente de encabezado reutilizable
- **components/AlertItem**: Componente para mostrar alertas

### Carpeta `constants`

Almacena valores constantes utilizados en toda la aplicación:

- **constants/Colors.ts**: Paleta de colores de la aplicación
- **constants/Layout.ts**: Constantes relacionadas con dimensiones y diseño
- **constants/Api.ts**: Configuración de API
- **constants/Specialties.ts**: Datos de especialidades médicas

### Carpeta `hooks`

Contiene hooks personalizados para lógica reutilizable:

- **hooks/useAuth.ts**: Gestión de autenticación y registro
- **hooks/useAppointments.ts**: Gestión de citas médicas
- **hooks/useAlerts.ts**: Gestión de alertas y notificaciones
- **hooks/useColorScheme.ts**: Gestión del tema (claro/oscuro)

### Carpeta `scripts`

Scripts de utilidad para desarrollo:

- **scripts/reset-project.js**: Reinicia el proyecto a estado inicial
- **scripts/api-mock.js**: Datos simulados para desarrollo

## Características Principales

### Sistema de Autenticación

- Inicio de sesión mediante tipo y número de documento + contraseña
- Registro con validaciones de seguridad (contraseña con requisitos avanzados)
- Recuperación de contraseña por correo electrónico
- Persistencia de sesión con AsyncStorage

### Gestión de Citas Médicas

- Visualización de citas programadas e históricas
- Programación de nuevas citas mediante proceso paso a paso
- Selección de especialidad médica
- Selección de médico por disponibilidad
- Selección de fecha y hora según disponibilidad
- Cancelación y reprogramación de citas existentes
- Limitación a una cita activa por usuario (según requisitos)

### Especialidades Médicas

La aplicación gestiona las siguientes especialidades médicas:
- Medicina general
- Pediatría
- Planificación familiar
- Odontología
- Optometría

### Integración con Chatbot de Telegram

Acceso directo al servicio de chatbot de Telegram para consultas frecuentes desde la aplicación.

## Requisitos

- Node.js 14.x o superior
- npm 7.x o superior
- Expo CLI 5.x o superior
- React Native 0.70.x o superior
- Un dispositivo móvil o emulador para pruebas

## Instalación de Dependencias

1. Clonar el repositorio
```bash
git clone https://github.com/usuario/mediclinicexpo.git
cd mediclinicexpo
```

2. Instalar dependencias principales
```bash
npm install
```

3. Instalar Expo CLI globalmente (opcional si ya lo tienes instalado)
```bash
npm install -g expo-cli
```

4. Instalar dependencias específicas
```bash
# Navegación y manejo de rutas
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install expo-router

# Componentes UI y gestión de formularios
npm install @react-native-picker/picker
npm install react-native-reanimated
npx pod-install # Para usuarios de iOS

# Almacenamiento
npm install @react-native-async-storage/async-storage

# Utilidades
npm install date-fns
npm install expo-linking
npm install expo-constants
npm install expo-status-bar
npm install expo-font
npm install expo-splash-screen
```

5. Iniciar la aplicación
```bash
npm start
# O para abrir directamente en un emulador específico:
npm run android
npm run ios
```

## Características

- Sistema de autenticación
- Gestión de citas médicas
- Búsqueda de especialidades médicas
- Sistema de alertas y notificaciones
- Perfil de usuario personalizable

## Tecnologías Utilizadas

- React Native
- Expo
- TypeScript
- Expo Router
- AsyncStorage (para almacenamiento local)

## Capturas de Pantalla

(Aquí se incluirán capturas de pantalla de la aplicación en funcionamiento)

## Implementaciones Recientes

### Rediseño Completo de la Interfaz de Usuario

Se ha rediseñado la interfaz de usuario para proporcionar una experiencia más intuitiva y moderna:
- Encabezado con logo de la clínica y acceso al perfil
- Secciones organizadas por funcionalidad
- Tarjetas visuales para médicos y especialidades
- Botón flotante para acceso rápido al chatbot de Telegram

### Sistema Completo de Programación de Citas

Se ha implementado un flujo paso a paso para la programación de citas médicas:
1. Selección de especialidad médica
2. Selección de médico disponible
3. Selección de fecha y hora
4. Confirmación de la cita

El sistema incluye validaciones para evitar conflictos de horarios y limita a los usuarios a una cita activa a la vez.

### Mejoras en el Sistema de Autenticación

- Nuevo sistema de login basado en tipo y número de documento
- Validaciones de seguridad en contraseñas (mínimo 10 caracteres, inclusión de mayúsculas, minúsculas, números y caracteres especiales)
- Prevención de retorno a pantallas de autenticación una vez iniciada la sesión

### Integración de Imágenes e Iconos Personalizados

Se han incorporado imágenes e iconos personalizados en toda la aplicación para mejorar la identidad visual:
- Iconos personalizados para especialidades médicas
- Imágenes de perfil para médicos
- Iconos de navegación y acción personalizados

## Notas Importantes para Desarrollo

- La aplicación utiliza TypeScript para proporcionar tipado estático y mejorar la robustez del código
- Se recomienda el uso de Visual Studio Code con las extensiones ESLint y Prettier
- Para pruebas de integración con el bot de Telegram, es necesario configurar el enlace adecuado

## Estado del Proyecto

El proyecto se encuentra en fase de desarrollo activo, con nuevas características y mejoras siendo implementadas regularmente.

## Próximas Funcionalidades

- Integración con servicios de notificaciones push
- Historial médico detallado
- Recordatorios de medicación
- Visualización de resultados de laboratorio
- Pago en línea de servicios médicos
