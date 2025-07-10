import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Text,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon: string;
  label?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon,
  label,
  color = COLORS.primary,
  size = 'medium',
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const getSize = () => {
    switch (size) {
      case 'small': return 48;
      case 'large': return 72;
      default: return 56;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'large': return 28;
      default: return 24;
    }
  };

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    // Add a satisfying bounce animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress();
  };

  const buttonSize = getSize();
  const iconSize = getIconSize();

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {label && (
        <Animated.View
          style={[
            styles.labelContainer,
            {
              opacity: scaleAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.label}>{label}</Text>
        </Animated.View>
      )}
      
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
            backgroundColor: color,
          },
          isPressed && styles.pressedButton,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Animated.Text
          style={[
            styles.icon,
            {
              fontSize: iconSize,
              transform: [
                { scale: scaleAnim },
                { rotate: rotation },
              ],
            },
          ]}
        >
          {icon}
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
    elevation: 8,
  },
  pressedButton: {
    elevation: 4,
  },
  icon: {
    color: COLORS.card,
    fontWeight: 'bold',
  },
  labelContainer: {
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  label: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
  },
});

export default FloatingActionButton; 