import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Week } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';
import DayColumn from './DayColumn';

interface WeekViewProps {
  week: Week;
  onToggleTaskCompletion: (dayId: string, taskId: string) => void;
  onToggleSubtaskCompletion: (dayId: string, taskId: string, subtaskId: string) => void;
  onToggleTaskExpansion: (dayId: string, taskId: string) => void;
  onDeleteTask?: (dayId: string, taskId: string) => void;
  onAddTask?: (dayId: string) => void;
  onApplyTemplate?: (dayId: string) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  week,
  onToggleTaskCompletion,
  onToggleSubtaskCompletion,
  onToggleTaskExpansion,
  onDeleteTask,
  onAddTask,
  onApplyTemplate,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.weekTitle}>
          Week of {new Date(week.startDate).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })} - {new Date(week.endDate).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {week.days.reduce((total, day) => total + day.tasks.length, 0)} total tasks
          </Text>
          <Text style={styles.statsText}>
            {week.days.reduce((total, day) => 
              total + day.tasks.filter(task => task.completed).length, 0
            )} completed
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {week.days.map((day) => (
          <DayColumn
            key={day.id}
            day={day}
            onToggleTaskCompletion={onToggleTaskCompletion}
            onToggleSubtaskCompletion={onToggleSubtaskCompletion}
            onToggleTaskExpansion={onToggleTaskExpansion}
            onDeleteTask={onDeleteTask}
            onAddTask={onAddTask}
            onApplyTemplate={onApplyTemplate}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.small,
  },
  weekTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: SPACING.md,
    paddingHorizontal: Platform.OS === 'web' ? SPACING.lg : SPACING.sm,
  },
});

export default WeekView; 