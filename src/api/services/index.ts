import appointmentService from './appointmentService';
import appointmentTypeService from './appointmentTypeService';
import authService from './authService';
import availabilityService from './availabilityService';
import doctorService from './doctorService';
import locationService from './locationService';
import notificationService from './notificationService';
import reminderService from './reminderService';
import specialtyService from './specialtyService';
import userService from './userService';

// Tipos exportados de los servicios
export type {
  Appointment,
  AppointmentStatus,
  Doctor,
  Specialty
} from './appointmentService';

export type {
  AppointmentType
} from './appointmentTypeService';

export type {
  LoginCredentials,
  RegisterUserData,
  User
} from './authService';

export type {
  Availability,
  AvailabilitySlot
} from './availabilityService';

export type {
  DoctorAvailabilityResponse
} from './doctorService';

export type {
  PhysicalLocation
} from './locationService';

export type {
  Notification,
  NotificationSettings,
  NotificationType
} from './notificationService';

export type {
  Reminder
} from './reminderService';

export type {
  ImageData, ProfileData
} from './userService';

// Exportar todos los servicios
export {
  appointmentService,
  appointmentTypeService,
  authService,
  availabilityService,
  doctorService,
  locationService,
  notificationService,
  reminderService,
  specialtyService,
  userService
};

// Definición de tipo para la exportación por defecto
interface ApiServices {
  auth: typeof authService;
  user: typeof userService;
  appointments: typeof appointmentService;
  appointmentTypes: typeof appointmentTypeService;
  specialties: typeof specialtyService;
  notifications: typeof notificationService;
  reminders: typeof reminderService;
  availability: typeof availabilityService;
  locations: typeof locationService;
  doctors: typeof doctorService;
}

// Exportar por defecto un objeto con todos los servicios para uso más conveniente
const apiServices: ApiServices = {
  auth: authService,
  user: userService,
  appointments: appointmentService,
  appointmentTypes: appointmentTypeService,
  specialties: specialtyService,
  notifications: notificationService,
  reminders: reminderService,
  availability: availabilityService,
  locations: locationService,
  doctors: doctorService
};

export default apiServices; 