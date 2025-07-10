import { PriorityColor } from '../types';

export const PRIORITY_COLORS: PriorityColor = {
  high: '#FF6B6B',      // Red
  medium: '#FFD93D',    // Yellow
  highest: '#4ECDC4',   // Green (Emergency/Highest)
  nutrition: '#6C5CE7'  // Blue
};

export const PRIORITY_LABELS = {
  high: 'High Priority',
  medium: 'Medium Priority',
  highest: 'Emergency/Highest',
  nutrition: 'Nutrition'
};

export const PRIORITY_ICONS = {
  high: '🔴',
  medium: '🟡',
  highest: '🟢',
  nutrition: '🔵'
};

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#F2F2F7',
  card: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#C6C6C8',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30'
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
}; 