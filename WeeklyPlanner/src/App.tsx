import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useStore } from './store';
import { generateWeek, getCurrentWeekStart } from './utils/dateUtils';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from './utils/constants';
import { Task, Template } from './types';
import WeekViewGrid from './components/WeekViewGrid';
import TemplateModal from './components/TemplateModal';
import AddTaskModal from './components/AddTaskModal';
import CreateTemplateModal from './components/CreateTemplateModal';

const App: React.FC = () => {
  const {
    weeks,
    templates,
    currentWeekIndex,
    addWeek,
    setCurrentWeek,
    addTask,
    addTemplate,
    toggleTaskCompletion,
    toggleSubtaskCompletion,
    toggleTaskExpansion,
    deleteTask,
    applyTemplate,
  } = useStore();

  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [createTemplateModalVisible, setCreateTemplateModalVisible] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string | undefined>();

  // Initialize with current week if no weeks exist
  useEffect(() => {
    if (weeks.length === 0) {
      const currentWeek = generateWeek(getCurrentWeekStart());
      addWeek(currentWeek);
    }
  }, [weeks.length, addWeek]);

  const currentWeek = weeks[currentWeekIndex];

  const handleAddWeek = () => {
    const lastWeek = weeks[weeks.length - 1];
    const nextWeekStart = new Date(lastWeek.endDate);
    nextWeekStart.setDate(nextWeekStart.getDate() + 1);
    const newWeek = generateWeek(nextWeekStart);
    addWeek(newWeek);
  };

  const handlePreviousWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeek(currentWeekIndex - 1);
    }
  };

  const handleNextWeek = () => {
    if (currentWeekIndex < weeks.length - 1) {
      setCurrentWeek(currentWeekIndex + 1);
    } else {
      handleAddWeek();
    }
  };

  const handleAddTask = (dayId: string) => {
    setSelectedDayId(dayId);
    setAddTaskModalVisible(true);
  };

  const handleAddTaskSubmit = (task: Omit<Task, 'id'>) => {
    if (selectedDayId) {
      // Generate a unique id for the new task
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
      };
      addTask(selectedDayId, newTask);
    }
  };

  const handleDeleteTask = (dayId: string, taskId: string) => {
    console.log('Delete task called:', { dayId, taskId });
    
    if (Platform.OS === 'web') {
      // Use browser confirm for web
      if (window.confirm('Are you sure you want to delete this task?')) {
        console.log('Deleting task (web):', { dayId, taskId });
        deleteTask(dayId, taskId);
      }
    } else {
      // Use Alert for mobile
      Alert.alert(
        'Delete Task',
        'Are you sure you want to delete this task?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive', 
            onPress: () => {
              console.log('Deleting task (mobile):', { dayId, taskId });
              deleteTask(dayId, taskId);
            }
          }
        ]
      );
    }
  };

  const handleApplyTemplate = (dayId: string) => {
    setSelectedDayId(dayId);
    setTemplateModalVisible(true);
  };

  const handleTemplateApply = (templateId: string, options: { replaceExisting: boolean; mergeWithExisting: boolean }) => {
    if (selectedDayId) {
      applyTemplate(templateId, selectedDayId, options);
    }
  };

  const handleCreateTemplate = (template: Omit<Template, 'id'>) => {
    addTemplate(template);
  };

  if (!currentWeek) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handlePreviousWeek}
          disabled={currentWeekIndex === 0}
        >
          <Text style={[styles.navButtonText, currentWeekIndex === 0 && styles.navButtonDisabled]}>
            ← Previous
          </Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>Weekly Planner</Text>
          <Text style={styles.weekIndicator}>
            Week {currentWeekIndex + 1} of {weeks.length}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.navButton}
          onPress={handleNextWeek}
        >
          <Text style={styles.navButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>

      {/* Week View Grid */}
      <WeekViewGrid
        week={currentWeek}
        onToggleTaskCompletion={toggleTaskCompletion}
        onToggleSubtaskCompletion={toggleSubtaskCompletion}
        onToggleTaskExpansion={toggleTaskExpansion}
        onDeleteTask={handleDeleteTask}
        onAddTask={handleAddTask}
        onApplyTemplate={handleApplyTemplate}
      />

      {/* Template Modal */}
      <TemplateModal
        visible={templateModalVisible}
        templates={templates}
        onClose={() => setTemplateModalVisible(false)}
        onApplyTemplate={handleTemplateApply}
        selectedDayId={selectedDayId}
      />

      {/* Add Task Modal */}
      <AddTaskModal
        visible={addTaskModalVisible}
        onClose={() => setAddTaskModalVisible(false)}
        onAddTask={handleAddTaskSubmit}
      />

      {/* Create Template Modal */}
      <CreateTemplateModal
        visible={createTemplateModalVisible}
        onClose={() => setCreateTemplateModalVisible(false)}
        onSaveTemplate={handleCreateTemplate}
      />

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => handleAddWeek()}
        >
          <Text style={styles.quickActionText}>📅 Add Week</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => setTemplateModalVisible(true)}
        >
          <Text style={styles.quickActionText}>📋 Templates</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => setCreateTemplateModalVisible(true)}
        >
          <Text style={styles.quickActionText}>✨ Create Template</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.medium,
  },
  navButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    minWidth: 80,
    alignItems: 'center',
  },
  navButtonText: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: '600',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  weekIndicator: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.medium,
  },
  quickActionButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 120,
    alignItems: 'center',
  },
  quickActionText: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default App; 