import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Day } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';
import AnimatedTaskItem from './AnimatedTaskItem';

interface AnimatedDayColumnProps {
  day: Day;
  onToggleTaskCompletion: (dayId: string, taskId: string) => void;
  onToggleSubtaskCompletion: (dayId: string, taskId: string, subtaskId: string) => void;
  onToggleTaskExpansion: (dayId: string, taskId: string) => void;
  onDeleteTask?: (dayId: string, taskId: string) => void;
  onAddTask?: (dayId: string) => void;
  onApplyTemplate?: (dayId: string) => void;
}

const AnimatedDayColumn: React.FC<AnimatedDayColumnProps> = ({
  day,
  onToggleTaskCompletion,
  onToggleSubtaskCompletion,
  onToggleTaskExpansion,
  onDeleteTask,
  onAddTask,
  onApplyTemplate,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const completedTasks = day.tasks.filter(task => task.completed).length;
  const totalTasks = day.tasks.length;
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [day.id]);

  useEffect(() => {
    // Update progress when tasks change
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = dayNames[new Date(day.date).getDay()];
  const dayNumber = new Date(day.date).getDate();
  const isToday = new Date(day.date).toDateString() === new Date().toDateString();

  const renderTask = (task: any, index: number) => (
    <Animated.View
      key={task.id}
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim },
        ],
      }}
    >
      <AnimatedTaskItem
        task={task}
        dayId={day.id}
        onToggleCompletion={onToggleTaskCompletion}
        onToggleSubtaskCompletion={onToggleSubtaskCompletion}
        onToggleExpansion={onToggleTaskExpansion}
        onDelete={onDeleteTask}
      />
    </Animated.View>
  );

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
        isToday && styles.todayContainer,
      ]}
    >
      {/* Header */}
      <View style={[styles.header, isToday && styles.todayHeader]}>
        <View style={styles.dayInfo}>
          <Text style={[styles.dayName, isToday && styles.todayText]}>
            {dayName}
          </Text>
          <Text style={[styles.dayNumber, isToday && styles.todayText]}>
            {dayNumber}
          </Text>
        </View>
        
        {isToday && (
          <Animated.View 
            style={[
              styles.todayIndicator,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.todayDot}>●</Text>
          </Animated.View>
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {completedTasks}/{totalTasks}
        </Text>
      </View>

      {/* Tasks */}
      <View style={styles.tasksContainer}>
        {day.tasks.length > 0 ? (
          day.tasks.map(renderTask)
        ) : (
          <Animated.View
            style={[
              styles.emptyState,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.emptyText}>No tasks yet</Text>
            <Text style={styles.emptySubtext}>Tap + to add one</Text>
          </Animated.View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {onAddTask && (
          <TouchableOpacity
            style={[styles.actionButton, styles.addButton]}
            onPress={() => onAddTask(day.id)}
            activeOpacity={0.8}
          >
            <Animated.Text 
              style={[
                styles.actionIcon,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              +
            </Animated.Text>
          </TouchableOpacity>
        )}
        
        {onApplyTemplate && (
          <TouchableOpacity
            style={[styles.actionButton, styles.templateButton]}
            onPress={() => onApplyTemplate(day.id)}
            activeOpacity={0.8}
          >
            <Animated.Text 
              style={[
                styles.actionIcon,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              📋
            </Animated.Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    minHeight: 320,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  todayContainer: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.primary + '05',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  todayHeader: {
    borderBottomColor: COLORS.primary + '30',
  },
  dayInfo: {
    alignItems: 'center',
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  todayText: {
    color: COLORS.primary,
  },
  todayIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayDot: {
    fontSize: 12,
    color: COLORS.primary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    marginRight: SPACING.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'right',
  },
  tasksContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  addButton: {
    backgroundColor: COLORS.primary,
  },
  templateButton: {
    backgroundColor: COLORS.secondary,
  },
  actionIcon: {
    fontSize: 18,
    color: COLORS.card,
    fontWeight: 'bold',
  },
});

export default AnimatedDayColumn; 