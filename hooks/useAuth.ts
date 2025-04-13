import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Cargar el usuario desde AsyncStorage al inicio
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('@MediClinic:user');
        if (userData) {
          const user = JSON.parse(userData);
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Error al cargar los datos del usuario',
        });
      }
    };

    loadUser();
  }, []);

  // Función para registrar un usuario
  const register = async (data: RegisterData): Promise<boolean> => {
    setState({ ...state, isLoading: true, error: null });

    try {
      // Simulación de llamada a API
      // En una aplicación real, esto sería una llamada a un endpoint de registro
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Crear usuario simulado
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email,
        phone: data.phone,
      };

      // Guardar token y datos del usuario en AsyncStorage
      // await AsyncStorage.setItem('@MediClinic:token', 'fake-token-' + newUser.id);
      // Solo guardamos los datos, pero no autenticamos
      
      setState({
        ...state,
        isLoading: false,
      });

      return true;
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Error al registrar el usuario',
      });
      return false;
    }
  };

  // Función para iniciar sesión
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setState({ ...state, isLoading: true, error: null });

    try {
      // Simulación de llamada a API
      // En una aplicación real, esto sería una llamada a un endpoint de login
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validación básica (en una app real se haría desde el backend)
      if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
        // Usuario simulado
        const user: User = {
          id: '1',
          name: 'Demo User',
          email: credentials.email,
        };

        // Guardar token y datos del usuario en AsyncStorage
        await AsyncStorage.setItem('@MediClinic:token', 'fake-token-1');
        await AsyncStorage.setItem('@MediClinic:user', JSON.stringify(user));

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return true;
      } else {
        setState({
          ...state,
          isLoading: false,
          error: 'Credenciales incorrectas',
        });
        return false;
      }
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Error al iniciar sesión',
      });
      return false;
    }
  };

  // Función para cerrar sesión
  const logout = async (): Promise<void> => {
    setState({ ...state, isLoading: true });

    try {
      // Eliminar token y datos del usuario de AsyncStorage
      await AsyncStorage.removeItem('@MediClinic:token');
      await AsyncStorage.removeItem('@MediClinic:user');

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Error al cerrar sesión',
      });
    }
  };

  // Actualizar los datos del usuario
  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    if (!state.user) return false;

    setState({ ...state, isLoading: true });

    try {
      // Actualizar datos del usuario
      const updatedUser = { ...state.user, ...userData };

      // Guardar en AsyncStorage
      await AsyncStorage.setItem('@MediClinic:user', JSON.stringify(updatedUser));

      setState({
        ...state,
        user: updatedUser,
        isLoading: false,
      });

      return true;
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Error al actualizar los datos del usuario',
      });
      return false;
    }
  };

  // Limpiar errores
  const clearError = () => {
    setState({ ...state, error: null });
  };

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    register,
    login,
    logout,
    updateUser,
    clearError,
  };
} 