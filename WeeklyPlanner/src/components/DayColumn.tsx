import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Day, Task } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';
import TaskItem from './TaskItem';

interface DayColumnProps {
  day: Day;
  onToggleTaskCompletion: (dayId: string, taskId: string) => void;
  onToggleSubtaskCompletion: (dayId: string, taskId: string, subtaskId: string) => void;
  onToggleTaskExpansion: (dayId: string, taskId: string) => void;
  onDeleteTask?: (dayId: string, taskId: string) => void;
  onAddTask?: (dayId: string) => void;
  onApplyTemplate?: (dayId: string) => void;
}

const DayColumn: React.FC<DayColumnProps> = ({
  day,
  onToggleTaskCompletion,
  onToggleSubtaskCompletion,
  onToggleTaskExpansion,
  onDeleteTask,
  onAddTask,
  onApplyTemplate,
}) => {
  const isToday = new Date(day.date).toDateString() === new Date().toDateString();
  const completedTasks = day.tasks.filter(task => task.completed).length;
  const totalTasks = day.tasks.length;

  return (
    <View style={[styles.container, isToday && styles.todayContainer]}>
      <View style={[styles.header, isToday && styles.todayHeader]}>
        <Text style={[styles.dayName, isToday && styles.todayText]}>
          {day.dayName}
        </Text>
        <Text style={[styles.date, isToday && styles.todayText]}>
          {new Date(day.date).getDate()}
        </Text>
        {totalTasks > 0 && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {completedTasks}/{totalTasks}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(completedTasks / totalTasks) * 100}%` }
                ]} 
              />
            </View>
          </View>
        )}
      </View>

      <ScrollView 
        style={styles.tasksContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tasksContent}
      >
        {day.tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks</Text>
            {onAddTask && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => onAddTask(day.id)}
              >
                <Text style={styles.addButtonText}>+ Add Task</Text>
              </TouchableOpacity>
            )}
            {onApplyTemplate && (
              <TouchableOpacity
                style={styles.templateButton}
                onPress={() => onApplyTemplate(day.id)}
              >
                <Text style={styles.templateButtonText}>📋 Apply Template</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          day.tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              dayId={day.id}
              onToggleCompletion={onToggleTaskCompletion}
              onToggleSubtaskCompletion={onToggleSubtaskCompletion}
              onToggleExpansion={onToggleTaskExpansion}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </ScrollView>

      {day.tasks.length > 0 && onAddTask && (
        <TouchableOpacity
          style={styles.addTaskButton}
          onPress={() => onAddTask(day.id)}
        >
          <Text style={styles.addTaskButtonText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Platform.OS === 'web' ? 280 : 250,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.sm,
    ...SHADOWS.medium,
  },
  todayContainer: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  header: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  todayHeader: {
    backgroundColor: COLORS.primary,
  },
  dayName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  todayText: {
    color: COLORS.card,
  },
  date: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  progressContainer: {
    marginTop: SPACING.sm,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
  },
  tasksContainer: {
    flex: 1,
  },
  tasksContent: {
    paddingVertical: SPACING.sm,
  },
  emptyState: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  addButtonText: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: '600',
  },
  templateButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  templateButtonText: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: '600',
  },
  addTaskButton: {
    position: 'absolute',
    bottom: SPACING.md,
    right: SPACING.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  addTaskButtonText: {
    color: COLORS.card,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default DayColumn; 