import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  PanGestureHandler,
  State,
} from 'react-native';
import { Task, Subtask } from '../types';
import { PRIORITY_COLORS, PRIORITY_ICONS, COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';

interface AnimatedTaskItemProps {
  task: Task;
  dayId: string;
  onToggleCompletion: (dayId: string, taskId: string) => void;
  onToggleSubtaskCompletion: (dayId: string, taskId: string, subtaskId: string) => void;
  onToggleExpansion: (dayId: string, taskId: string) => void;
  onDelete?: (dayId: string, taskId: string) => void;
}

const AnimatedTaskItem: React.FC<AnimatedTaskItemProps> = ({
  task,
  dayId,
  onToggleCompletion,
  onToggleSubtaskCompletion,
  onToggleExpansion,
  onDelete,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const priorityColor = PRIORITY_COLORS[task.priority];
  const priorityIcon = PRIORITY_ICONS[task.priority];

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleToggleCompletion = () => {
    // Add a satisfying animation when completing
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    
    onToggleCompletion(dayId, task.id);
  };

  const handleToggleExpansion = () => {
    Animated.spring(rotateAnim, {
      toValue: task.expanded ? 0 : 1,
      useNativeDriver: true,
    }).start();
    
    onToggleExpansion(dayId, task.id);
  };

  const handleDelete = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDelete) {
        onDelete(dayId, task.id);
      }
    });
  };

  const renderSubtask = (subtask: Subtask) => (
    <Animated.View
      key={subtask.id}
      style={[
        styles.subtaskContainer,
        {
          opacity: opacityAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.subtaskTouchable}
        onPress={() => onToggleSubtaskCompletion(dayId, task.id, subtask.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, subtask.completed && styles.checkboxCompleted]}>
          {subtask.completed && (
            <Animated.Text 
              style={[
                styles.checkmark,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              ✓
            </Animated.Text>
          )}
        </View>
        <Text style={[
          styles.subtaskText,
          subtask.completed && styles.completedText
        ]}>
          {subtask.text}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const expandIconRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { scale: scaleAnim },
            { translateX: slideAnim },
          ],
          opacity: opacityAnim,
        },
        SHADOWS.medium,
        isPressed && styles.pressedContainer,
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.mainContent}
          onPress={handleToggleCompletion}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          <Animated.View 
            style={[
              styles.checkbox, 
              task.completed && styles.checkboxCompleted,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {task.completed && (
              <Animated.Text 
                style={[
                  styles.checkmark,
                  {
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                ✓
              </Animated.Text>
            )}
          </Animated.View>
          
          <View style={styles.taskInfo}>
            <Animated.Text 
              style={[
                styles.taskText,
                task.completed && styles.completedText,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {task.text}
            </Animated.Text>
            
            <Animated.View 
              style={[
                styles.priorityIndicator, 
                { backgroundColor: priorityColor },
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Text style={styles.priorityIcon}>{priorityIcon}</Text>
            </Animated.View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.actions}>
          {task.subtasks.length > 0 && (
            <TouchableOpacity
              style={styles.expandButton}
              onPress={handleToggleExpansion}
              activeOpacity={0.7}
            >
              <Animated.Text 
                style={[
                  styles.expandIcon,
                  {
                    transform: [{ rotate: expandIconRotation }],
                  },
                ]}
              >
                ▶
              </Animated.Text>
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity
              style={[styles.deleteButton, { borderWidth: 1, borderColor: 'red' }]}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Animated.Text 
                style={[
                  styles.deleteIcon,
                  {
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                🗑️
              </Animated.Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {task.expanded && task.subtasks.length > 0 && (
        <Animated.View 
          style={[
            styles.subtasksContainer,
            {
              opacity: opacityAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {task.subtasks.map(renderSubtask)}
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    marginVertical: SPACING.xs,
    marginHorizontal: SPACING.sm,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 3,
  },
  pressedContainer: {
    backgroundColor: COLORS.primary + '10',
    borderColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  checkboxCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkmark: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  priorityIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  priorityIcon: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandButton: {
    padding: SPACING.xs,
    marginRight: SPACING.xs,
  },
  expandIcon: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  deleteButton: {
    padding: SPACING.xs,
    backgroundColor: COLORS.error + '20',
    borderRadius: BORDER_RADIUS.sm,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: 16,
    color: COLORS.error,
    fontWeight: 'bold',
  },
  subtasksContainer: {
    marginTop: SPACING.sm,
    paddingLeft: SPACING.md,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.border,
  },
  subtaskContainer: {
    marginVertical: SPACING.xs,
  },
  subtaskTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtaskText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default AnimatedTaskItem; 