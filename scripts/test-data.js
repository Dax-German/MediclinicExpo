/**
 * Este script contiene datos de prueba para el desarrollo de la aplicación MediClinic.
 * Estos datos pueden ser utilizados para simular el comportamiento de la aplicación
 * sin necesidad de conectarse a un backend real.
 */

// Datos de especialidades médicas
export const MOCK_SPECIALTIES = [
  {
    id: '1',
    name: 'Cardiología',
    icon: 'heart-outline',
    description: 'Especialidad médica que se ocupa del diagnóstico y tratamiento de las enfermedades del corazón.',
  },
  {
    id: '2',
    name: 'Dermatología',
    icon: 'body-outline',
    description: 'Especialidad médica encargada del estudio de la piel, su estructura, función y enfermedades.',
  },
  {
    id: '3',
    name: 'Pediatría',
    icon: 'people-outline',
    description: 'Rama de la medicina que se especializa en la salud y enfermedades de los niños.',
  },
  {
    id: '4',
    name: 'Traumatología',
    icon: 'fitness-outline',
    description: 'Especialidad médica que trata lesiones del sistema músculo-esquelético.',
  },
  {
    id: '5',
    name: 'Oftalmología',
    icon: 'eye-outline',
    description: 'Especialidad médica que estudia y trata las enfermedades de los ojos.',
  },
  {
    id: '6',
    name: 'Neurología',
    icon: 'medical-outline',
    description: 'Especialidad médica que trata los trastornos del sistema nervioso.',
  },
  {
    id: '7',
    name: 'Odontología',
    icon: 'medical-outline',
    description: 'Especialidad que se ocupa del diagnóstico, tratamiento y prevención de enfermedades bucales.',
  },
  {
    id: '8',
    name: 'Ginecología',
    icon: 'woman-outline',
    description: 'Especialidad médica de la medicina que se ocupa del sistema reproductor femenino.',
  },
];

// Datos de médicos
export const MOCK_DOCTORS = [
  {
    id: '1',
    name: 'Dr. Carlos Rodríguez',
    specialty: 'Cardiología',
    specialtyId: '1',
    rating: 4.8,
    experience: '15 años',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
    about: 'Especialista en cardiología con amplia experiencia en el tratamiento de enfermedades cardiovasculares.',
  },
  {
    id: '2',
    name: 'Dra. María González',
    specialty: 'Dermatología',
    specialtyId: '2',
    rating: 4.9,
    experience: '10 años',
    photo: 'https://randomuser.me/api/portraits/women/2.jpg',
    about: 'Dermatóloga con especialización en tratamientos para problemas de piel como acné, rosácea y psoriasis.',
  },
  {
    id: '3',
    name: 'Dr. José Fernández',
    specialty: 'Traumatología',
    specialtyId: '4',
    rating: 4.7,
    experience: '12 años',
    photo: 'https://randomuser.me/api/portraits/men/3.jpg',
    about: 'Traumatólogo con experiencia en tratamiento de lesiones deportivas y cirugía ortopédica.',
  },
  {
    id: '4',
    name: 'Dra. Ana Martínez',
    specialty: 'Oftalmología',
    specialtyId: '5',
    rating: 4.6,
    experience: '8 años',
    photo: 'https://randomuser.me/api/portraits/women/4.jpg',
    about: 'Oftalmóloga especializada en cirugía láser y tratamiento de enfermedades de la retina.',
  },
  {
    id: '5',
    name: 'Dr. Miguel Torres',
    specialty: 'Neurología',
    specialtyId: '6',
    rating: 4.9,
    experience: '20 años',
    photo: 'https://randomuser.me/api/portraits/men/5.jpg',
    about: 'Neurólogo con amplia experiencia en el diagnóstico y tratamiento de enfermedades neurológicas.',
  },
  {
    id: '6',
    name: 'Dra. Laura Sánchez',
    specialty: 'Pediatría',
    specialtyId: '3',
    rating: 4.8,
    experience: '14 años',
    photo: 'https://randomuser.me/api/portraits/women/6.jpg',
    about: 'Pediatra con especialización en desarrollo infantil y enfermedades respiratorias.',
  },
];

// Datos de citas
export const MOCK_APPOINTMENTS = [
  {
    id: '1',
    doctor: 'Dr. Carlos Rodríguez',
    doctorId: '1',
    specialty: 'Cardiología',
    date: '10 Abril, 2024',
    time: '9:30 AM',
    status: 'upcoming',
    location: 'Clínica Central, Piso 3, Consultorio 302',
  },
  {
    id: '2',
    doctor: 'Dra. María González',
    doctorId: '2',
    specialty: 'Dermatología',
    date: '15 Abril, 2024',
    time: '11:00 AM',
    status: 'upcoming',
    location: 'Clínica Norte, Consultorio 105',
  },
  {
    id: '3',
    doctor: 'Dr. José Fernández',
    doctorId: '3',
    specialty: 'Traumatología',
    date: '20 Marzo, 2024',
    time: '10:00 AM',
    status: 'completed',
  },
  {
    id: '4',
    doctor: 'Dra. Ana Martínez',
    doctorId: '4',
    specialty: 'Oftalmología',
    date: '5 Marzo, 2024',
    time: '16:30 PM',
    status: 'cancelled',
  },
];

// Datos de alertas
export const MOCK_ALERTS = [
  {
    id: '1',
    title: 'Recordatorio de cita',
    message: 'Tienes una cita con el Dr. Carlos Rodríguez mañana a las 9:30 AM.',
    date: '01/04/2024',
    type: 'appointment',
    read: false,
  },
  {
    id: '2',
    title: 'Resultados disponibles',
    message: 'Tus resultados de laboratorio ya están disponibles para consulta.',
    date: '30/03/2024',
    type: 'result',
    read: false,
  },
  {
    id: '3',
    title: 'Recordatorio de medicación',
    message: 'No olvides tomar tu medicación diaria.',
    date: '28/03/2024',
    type: 'medication',
    read: true,
  },
  {
    id: '4',
    title: 'Información general',
    message: 'Nuevos horarios de atención durante Semana Santa.',
    date: '25/03/2024',
    type: 'general',
    read: true,
  },
];

// Datos de usuario de prueba
export const MOCK_USER = {
  id: '1',
  name: 'Juan García',
  email: 'juan.garcia@example.com',
  phone: '123456789',
  birthDate: '15/05/1985',
  bloodType: 'O+',
  allergies: ['Penicilina', 'Polen'],
  chronicConditions: ['Hipertensión'],
}; 