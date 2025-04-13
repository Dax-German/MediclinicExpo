import { Ionicons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export interface Specialty {
  id: string;
  name: string;
  icon: IconName;
  description: string;
}

export const SPECIALTIES: Specialty[] = [
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