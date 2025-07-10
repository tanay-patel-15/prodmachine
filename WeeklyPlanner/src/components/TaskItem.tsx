import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Task, Subtask } from '../types';
import { PRIORITY_COLORS, PRIORITY_ICONS, COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';

interface TaskItemProps {
  task: Task;
  dayId: string;
  onToggleCompletion: (dayId: string, taskId: string) => void;
  onToggleSubtaskCompletion: (dayId: string, taskId: string, subtaskId: string) => void;
  onToggleExpansion: (dayId: string, taskId: string) => void;
  onDelete?: (dayId: string, taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  dayId,
  onToggleCompletion,
  onToggleSubtaskCompletion,
  onToggleExpansion,
  onDelete,
}) => {
  const priorityColor = PRIORITY_COLORS[task.priority];
  const priorityIcon = PRIORITY_ICONS[task.priority];

  const renderSubtask = (subtask: Subtask) => (
    <TouchableOpacity
      key={subtask.id}
      style={styles.subtaskContainer}
      onPress={() => onToggleSubtaskCompletion(dayId, task.id, subtask.id)}
    >
      <View style={[styles.checkbox, subtask.completed && styles.checkboxCompleted]}>
        {subtask.completed && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={[
        styles.subtaskText,
        subtask.completed && styles.completedText
      ]}>
        {subtask.text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, SHADOWS.small]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.mainContent}
          onPress={() => onToggleCompletion(dayId, task.id)}
        >
          <View style={[styles.checkbox, task.completed && styles.checkboxCompleted]}>
            {task.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <View style={styles.taskInfo}>
            <Text style={[
              styles.taskText,
              task.completed && styles.completedText
            ]}>
              {task.text}
            </Text>
            <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]}>
              <Text style={styles.priorityIcon}>{priorityIcon}</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.actions}>
          {task.subtasks.length > 0 && (
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => onToggleExpansion(dayId, task.id)}
            >
              <Text style={styles.expandIcon}>
                {task.expanded ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(dayId, task.id)}
            >
              <Text style={styles.deleteIcon}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {task.expanded && task.subtasks.length > 0 && (
        <View style={styles.subtasksContainer}>
          {task.subtasks.map(renderSubtask)}
        </View>
      )}
    </View>
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
    width: 20,
    height: 20,
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
    fontSize: 12,
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
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  priorityIcon: {
    fontSize: 12,
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
  },
  deleteIcon: {
    fontSize: 18,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  subtaskText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default TaskItem; 