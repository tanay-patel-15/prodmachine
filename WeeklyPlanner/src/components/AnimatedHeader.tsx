import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
  onPreviousWeek?: () => void;
  onNextWeek?: () => void;
  onToday?: () => void;
  scrollY?: Animated.Value;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  title,
  subtitle,
  onPreviousWeek,
  onNextWeek,
  onToday,
  scrollY,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const headerHeight = scrollY?.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 80],
    extrapolate: 'clamp',
  }) || 120;

  const titleOpacity = scrollY?.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  }) || 1;

  const subtitleOpacity = scrollY?.interpolate({
    inputRange: [0, 30],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  }) || 1;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: headerHeight,
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
        SHADOWS.large,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: titleOpacity,
              },
            ]}
          >
            {title}
          </Animated.Text>
          
          {subtitle && (
            <Animated.Text
              style={[
                styles.subtitle,
                {
                  opacity: subtitleOpacity,
                },
              ]}
            >
              {subtitle}
            </Animated.Text>
          )}
        </View>

        <View style={styles.actions}>
          {onPreviousWeek && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onPreviousWeek}
              activeOpacity={0.7}
            >
              <Animated.Text
                style={[
                  styles.actionIcon,
                  {
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                ◀
              </Animated.Text>
            </TouchableOpacity>
          )}

          {onToday && (
            <TouchableOpacity
              style={[styles.actionButton, styles.todayButton]}
              onPress={onToday}
              activeOpacity={0.7}
            >
              <Animated.Text
                style={[
                  styles.actionIcon,
                  {
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                📅
              </Animated.Text>
            </TouchableOpacity>
          )}

          {onNextWeek && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onNextWeek}
              activeOpacity={0.7}
            >
              <Animated.Text
                style={[
                  styles.actionIcon,
                  {
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                ▶
              </Animated.Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Decorative elements */}
      <Animated.View
        style={[
          styles.decorativeCircle,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.decorativeCircle2,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  todayButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  actionIcon: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  decorativeCircle: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '10',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.secondary + '10',
  },
});

export default AnimatedHeader; 