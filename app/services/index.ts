// Tipos
export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty?: string;
  profileImage?: string;
}

export interface Specialty {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  doctor?: Doctor;
  specialty?: Specialty;
  status: 'scheduled' | 'completed' | 'cancelled' | 'noshow';
  patientId: string;
  notes?: string;
  location?: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  date: string;
  isRead: boolean;
  type: 'appointment' | 'result' | 'reminder' | 'system';
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  documentType?: string;
  documentNumber?: string;
}

export interface LoginCredentials {
  documentType: string;
  documentNumber: string;
  password: string;
}

export interface RegisterData {
  documentType: string;
  documentNumber: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Usuarios de prueba para simulación
const mockUsers = [
  {
    id: '301',
    firstName: 'Pedro',
    lastName: 'García',
    email: 'pedro.garcia@example.com',
    phoneNumber: '3001234567',
    documentType: 'cedula',
    documentNumber: '1234567890',
    password: 'Password123!'
  }
];

// Mock de servicios de citas
const mockAppointments: Appointment[] = [
  {
    id: '1',
    date: '2024-08-15',
    startTime: '10:00',
    endTime: '10:30',
    doctor: {
      id: '101',
      firstName: 'Juan',
      lastName: 'Pérez',
      specialty: 'Cardiología'
    },
    specialty: {
      id: '201',
      name: 'Cardiología'
    },
    status: 'scheduled',
    patientId: '301',
    location: 'Consultorio 105'
  },
  {
    id: '2',
    date: '2024-07-10',
    startTime: '15:30',
    endTime: '16:00',
    doctor: {
      id: '102',
      firstName: 'María',
      lastName: 'González',
      specialty: 'Dermatología'
    },
    specialty: {
      id: '202',
      name: 'Dermatología'
    },
    status: 'completed',
    patientId: '301',
    notes: 'Control de rutina',
    location: 'Consultorio 203'
  },
  {
    id: '3',
    date: '2024-06-05',
    startTime: '09:00',
    endTime: '09:30',
    doctor: {
      id: '103',
      firstName: 'Carlos',
      lastName: 'Ramírez',
      specialty: 'Pediatría'
    },
    specialty: {
      id: '203',
      name: 'Pediatría'
    },
    status: 'cancelled',
    patientId: '301',
    location: 'Consultorio 108'
  }
];

// Mock de especialidades
const mockSpecialties: Specialty[] = [
  {
    id: '201',
    name: 'Cardiología',
    description: 'Especialidad médica que se ocupa del diagnóstico y tratamiento de las enfermedades del corazón'
  },
  {
    id: '202',
    name: 'Dermatología',
    description: 'Especialidad médica encargada del estudio de la piel y sus anexos'
  },
  {
    id: '203',
    name: 'Pediatría',
    description: 'Especialidad médica que estudia al niño y sus enfermedades'
  },
  {
    id: '204',
    name: 'Neurología',
    description: 'Especialidad médica que trata los trastornos del sistema nervioso'
  },
  {
    id: '205',
    name: 'Oftalmología',
    description: 'Especialidad médica que estudia las enfermedades del ojo'
  },
  {
    id: '206',
    name: 'Ginecología',
    description: 'Especialidad médica y quirúrgica que trata las enfermedades del sistema reproductor femenino'
  }
];

// Mock de alertas
const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Recordatorio de cita',
    description: 'Tiene una cita programada con el Dr. Juan Pérez mañana a las 10:00',
    date: '2024-08-14',
    isRead: false,
    type: 'appointment'
  },
  {
    id: '2',
    title: 'Resultados disponibles',
    description: 'Sus resultados de laboratorio están disponibles',
    date: '2024-07-05',
    isRead: true,
    type: 'result'
  },
  {
    id: '3',
    title: 'Recordatorio de medicación',
    description: 'Recuerde tomar su medicación según lo prescrito',
    date: '2024-07-01',
    isRead: false,
    type: 'reminder'
  }
];

// Servicio de citas
export const appointmentService = {
  // Obtener próximas citas
  getUpcomingAppointments: async (): Promise<Appointment[]> => {
    // Simulamos una llamada a la API
    return new Promise((resolve) => {
      setTimeout(() => {
        const upcomingAppointments = mockAppointments.filter(
          (appointment) => appointment.status === 'scheduled'
        );
        resolve(upcomingAppointments);
      }, 800);
    });
  },

  // Obtener historial de citas
  getAppointmentHistory: async (): Promise<Appointment[]> => {
    // Simulamos una llamada a la API
    return new Promise((resolve) => {
      setTimeout(() => {
        const historyAppointments = mockAppointments.filter(
          (appointment) => appointment.status !== 'scheduled'
        );
        resolve(historyAppointments);
      }, 800);
    });
  },

  // Obtener detalles de una cita por ID
  getAppointmentById: async (id: string): Promise<Appointment | null> => {
    // Simulamos una llamada a la API
    return new Promise((resolve) => {
      setTimeout(() => {
        const appointment = mockAppointments.find(
          (appointment) => appointment.id === id
        );
        resolve(appointment || null);
      }, 500);
    });
  },

  // Cancelar una cita
  cancelAppointment: async (id: string): Promise<boolean> => {
    // Simulamos una llamada a la API
    return new Promise((resolve) => {
      setTimeout(() => {
        const appointmentIndex = mockAppointments.findIndex(
          (appointment) => appointment.id === id
        );
        
        if (appointmentIndex !== -1) {
          mockAppointments[appointmentIndex].status = 'cancelled';
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  },

  // Programar una nueva cita
  scheduleAppointment: async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    // Simulamos una llamada a la API
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAppointment: Appointment = {
          ...appointment,
          id: `${mockAppointments.length + 1}`,
        };
        mockAppointments.push(newAppointment);
        resolve(newAppointment);
      }, 1000);
    });
  }
};

// Servicio de especialidades
export const specialtyService = {
  // Obtener todas las especialidades
  getAllSpecialties: async (): Promise<Specialty[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSpecialties);
      }, 800);
    });
  },

  // Obtener especialidad por ID
  getSpecialtyById: async (id: string): Promise<Specialty | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const specialty = mockSpecialties.find(
          (specialty) => specialty.id === id
        );
        resolve(specialty || null);
      }, 500);
    });
  }
};

// Servicio de alertas
export const alertService = {
  // Obtener todas las alertas
  getAllAlerts: async (): Promise<Alert[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAlerts);
      }, 800);
    });
  },

  // Marcar alerta como leída
  markAlertAsRead: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const alertIndex = mockAlerts.findIndex(
          (alert) => alert.id === id
        );
        
        if (alertIndex !== -1) {
          mockAlerts[alertIndex].isRead = true;
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }
};

// Servicio de autenticación
export const authService = {
  // Iniciar sesión
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simulamos una llamada a la API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Buscar usuario por tipo y número de documento
        const user = mockUsers.find(
          u => u.documentType === credentials.documentType && 
               u.documentNumber === credentials.documentNumber
        );

        if (user && user.password === credentials.password) {
          // Devolvemos datos de usuario y token ficticio
          resolve({
            user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              documentType: user.documentType,
              documentNumber: user.documentNumber
            },
            token: 'mock-jwt-token-' + Date.now()
          });
        } else {
          // Credenciales inválidas
          reject(new Error('Credenciales incorrectas'));
        }
      }, 1000);
    });
  },

  // Registrar nuevo usuario
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    // Simulamos una llamada a la API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Verificar si ya existe un usuario con el mismo documento
        const existingUser = mockUsers.find(
          u => u.documentType === userData.documentType && 
               u.documentNumber === userData.documentNumber
        );

        if (existingUser) {
          reject(new Error('Ya existe un usuario con este documento'));
          return;
        }

        // Crear nuevo usuario
        const [firstName, ...lastNameParts] = userData.name.split(' ');
        const lastName = lastNameParts.join(' ');

        const newUser = {
          id: `${300 + mockUsers.length + 1}`,
          firstName: firstName,
          lastName: lastName || '',
          email: userData.email,
          phoneNumber: userData.phone,
          documentType: userData.documentType,
          documentNumber: userData.documentNumber,
          password: userData.password
        };

        // Añadir a la lista de usuarios
        mockUsers.push(newUser);

        // Devolver respuesta
        resolve({
          user: {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            documentType: newUser.documentType,
            documentNumber: newUser.documentNumber
          },
          token: 'mock-jwt-token-' + Date.now()
        });
      }, 1500);
    });
  },

  // Enviar enlace para restablecer contraseña
  requestPasswordReset: async (email: string): Promise<boolean> => {
    // Simulamos una llamada a la API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Verificar si existe un usuario con ese email
        const user = mockUsers.find(u => u.email === email);
        
        // Siempre devolvemos true por razones de seguridad
        // (para no revelar si el email existe o no)
        resolve(true);
      }, 1000);
    });
  }
};

// API Config y Auth Service también serían añadidos aquí
// pero por simplicidad, este es un ejemplo básico 