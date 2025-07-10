import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { Week } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';
import AnimatedDayColumn from './AnimatedDayColumn';

interface WeekViewGridProps {
  week: Week;
  onToggleTaskCompletion: (dayId: string, taskId: string) => void;
  onToggleSubtaskCompletion: (dayId: string, taskId: string, subtaskId: string) => void;
  onToggleTaskExpansion: (dayId: string, taskId: string) => void;
  onDeleteTask?: (dayId: string, taskId: string) => void;
  onAddTask?: (dayId: string) => void;
  onApplyTemplate?: (dayId: string) => void;
}

const WeekViewGrid: React.FC<WeekViewGridProps> = ({
  week,
  onToggleTaskCompletion,
  onToggleSubtaskCompletion,
  onToggleTaskExpansion,
  onDeleteTask,
  onAddTask,
  onApplyTemplate,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const isWeb = Platform.OS === 'web';
  
  // Calculate column width based on screen size
  const getColumnWidth = () => {
    if (isWeb) {
      return Math.min(280, (screenWidth - SPACING.lg * 2) / 3);
    }
    return (screenWidth - SPACING.md * 4) / 3; // 3 columns with margins
  };

  const columnWidth = getColumnWidth();

  // Split days into rows: 3-3-1
  const firstRow = week.days.slice(0, 3); // Mon, Tue, Wed
  const secondRow = week.days.slice(3, 6); // Thu, Fri, Sat
  const thirdRow = week.days.slice(6, 7); // Sun

  const renderDayColumn = (day: any) => (
    <AnimatedDayColumn
      key={day.id}
      day={day}
      onToggleTaskCompletion={onToggleTaskCompletion}
      onToggleSubtaskCompletion={onToggleSubtaskCompletion}
      onToggleTaskExpansion={onToggleTaskExpansion}
      onDeleteTask={onDeleteTask}
      onAddTask={onAddTask}
      onApplyTemplate={onApplyTemplate}
    />
  );

  const renderRow = (days: any[], rowIndex: number) => (
    <View key={rowIndex} style={styles.row}>
      {days.map((day, index) => (
        <View 
          key={day.id} 
          style={[
            styles.columnContainer,
            { width: rowIndex === 2 ? columnWidth * 3 + SPACING.md * 2 : columnWidth }
          ]}
        >
          {renderDayColumn(day)}
        </View>
      ))}
    </View>
  );

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
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* First Row: Monday, Tuesday, Wednesday */}
        {renderRow(firstRow, 0)}
        
        {/* Second Row: Thursday, Friday, Saturday */}
        {renderRow(secondRow, 1)}
        
        {/* Third Row: Sunday (centered) */}
        {renderRow(thirdRow, 2)}
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: SPACING.md,
    gap: SPACING.lg, // for web, fallback to margin for native
  },
  columnContainer: {
    flex: 1,
    alignItems: 'stretch',
    marginHorizontal: SPACING.sm,
  },
});

export default WeekViewGrid; 