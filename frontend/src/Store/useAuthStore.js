import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isLoading: false,
  isError: false,
  error: null,
  
  // For tracking registration progress
  registrationStep: localStorage.getItem('registrationStep') || 'initial',
  tempUserId: localStorage.getItem('userId') || null,

  // Signup Function - Step 1: Basic Registration
  signup: async (data) => {
    try {
      set({ isLoading: true, isError: false, error: null });

      const response = await axiosInstance.post('/auth/register', data);
      
      // Extract the response data
      const { userId, tempToken } = response.data.data;
      
      // Store temporary data for the next step
      localStorage.setItem('tempToken', tempToken);
      localStorage.setItem('userId', userId);
      localStorage.setItem('registrationStep', 'roleSelection');
      
      // Update store
      set({ 
        isLoading: false, 
        registrationStep: 'roleSelection',
        tempUserId: userId 
      });

      toast.success('Registration successful! Please select your role.');

      return { userId, tempToken };
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error?.response?.data?.message || 'Registration failed. Please try again.';
      
      set({ isError: true, error: errorMessage, isLoading: false });

      toast.error(errorMessage);
      throw error;
    }
  },

  // Login Function
  login: async (data) => {
    try {
      set({ isLoading: true, isError: false, error: null });

      const response = await axiosInstance.post('/auth/login', data);
      
      // Extract user and token from the response structure
      const { user, token } = response.data.data;

      // Store credentials
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Configure axios for future requests
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({ user, isLoading: false });

      toast.success(`Welcome back, ${user.firstName}! 🚀`);

      return user;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error?.response?.data?.message || 'Login failed. Check your credentials.';

      set({ isError: true, error: errorMessage, isLoading: false });

      toast.error(errorMessage);
      throw error;
    }
  },

  // Logout Function
  logout: async () => {
    try {
      set({ isLoading: true, isError: false, error: null });

      // Configure headers with the token
      const token = localStorage.getItem('token');
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await axiosInstance.get('/auth/logout');

      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tempToken');
      localStorage.removeItem('profileToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('registrationStep');
      localStorage.removeItem('selectedRole');
      
      // Remove auth header
      delete axiosInstance.defaults.headers.common['Authorization'];

      set({ 
        user: null, 
        isLoading: false,
        registrationStep: 'initial',
        tempUserId: null
      });

      toast.success('Logged out successfully. See you soon! 👋');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if the server call fails, we should clear everything locally
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tempToken');
      localStorage.removeItem('profileToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('registrationStep');
      localStorage.removeItem('selectedRole');
      
      delete axiosInstance.defaults.headers.common['Authorization'];
      
      set({ 
        user: null, 
        isLoading: false,
        registrationStep: 'initial',
        tempUserId: null
      });

      toast.success('Logged out successfully.');
    }
  },

  // Step 2: Role Selection Function
  selectRole: async (data) => {
    try {
      set({ isLoading: true, isError: false, error: null });

      // Configure headers with the temp token
      const tempToken = localStorage.getItem('tempToken');
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${tempToken}`;

      const response = await axiosInstance.post('/auth/register/role', data);
      
      // Extract the response data
      const { userId, role, profileToken } = response.data.data;
      
      // Store data for the next step
      localStorage.setItem('profileToken', profileToken);
      localStorage.setItem('selectedRole', role);
      localStorage.setItem('registrationStep', 'profileCompletion');
      
      // Update store
      set({ 
        isLoading: false,
        registrationStep: 'profileCompletion'
      });

      toast.success(`Role selected as ${role}. Complete your profile.`);

      return { userId, role, profileToken };
    } catch (error) {
      console.error('Role selection error:', error);
      const errorMessage = error?.response?.data?.message || 'Role selection failed. Please try again.';
      
      set({ isError: true, error: errorMessage, isLoading: false });

      toast.error(errorMessage);
      throw error;
    }
  },

  // Step 3: Complete Profile Function
  completeProfile: async (data) => {
    try {
      set({ isLoading: true, isError: false, error: null });

      // Configure headers with the profile token
      const profileToken = localStorage.getItem('profileToken');
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${profileToken}`;

      const response = await axiosInstance.post('/auth/register/complete-profile', data);
      
      // Extract the user and permanent token
      const { user, token } = response.data.data;
      
      // Store the permanent credentials
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Clear registration process data
      localStorage.removeItem('tempToken');
      localStorage.removeItem('profileToken');
      localStorage.removeItem('registrationStep');
      localStorage.removeItem('selectedRole');
      
      // Update store with final user data
      set({ 
        user,
        isLoading: false,
        registrationStep: 'completed'
      });

      toast.success(`Welcome, ${user.firstName}! Registration complete.`);

      return user;
    } catch (error) {
      console.error('Profile completion error:', error);
      const errorMessage = error?.response?.data?.message || 'Profile completion failed. Please try again.';
      
      set({ isError: true, error: errorMessage, isLoading: false });

      toast.error(errorMessage);
      throw error;
    }
  },
  
  // Reset the registration process (for debugging or error recovery)
  resetRegistration: () => {
    localStorage.removeItem('tempToken');
    localStorage.removeItem('profileToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('registrationStep');
    localStorage.removeItem('selectedRole');
    
    set({
      registrationStep: 'initial',
      tempUserId: null,
      isError: false,
      error: null
    });
    
    toast.success('Registration process reset.');
  }
}));