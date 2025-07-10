import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { Task } from '../types';
import { PRIORITY_COLORS, PRIORITY_LABELS, PRIORITY_ICONS, COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onAddTask,
}) => {
  const [taskText, setTaskText] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Task['priority']>('medium');
  const [subtasks, setSubtasks] = useState<string[]>(['']);

  const priorities: Task['priority'][] = ['high', 'medium', 'highest', 'nutrition'];

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, '']);
  };

  const handleSubtaskChange = (index: number, text: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = text;
    setSubtasks(newSubtasks);
  };

  const handleRemoveSubtask = (index: number) => {
    if (subtasks.length > 1) {
      setSubtasks(subtasks.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    if (taskText.trim()) {
      const newTask: Omit<Task, 'id'> = {
        text: taskText.trim(),
        priority: selectedPriority,
        completed: false,
        subtasks: subtasks
          .filter(subtask => subtask.trim())
          .map(subtask => ({
            id: Math.random().toString(36).substr(2, 9),
            text: subtask.trim(),
            completed: false,
          })),
        expanded: false,
      };
      
      onAddTask(newTask);
      setTaskText('');
      setSelectedPriority('medium');
      setSubtasks(['']);
      onClose();
    }
  };

  const renderPriorityOption = (priority: Task['priority']) => (
    <TouchableOpacity
      key={priority}
      style={[
        styles.priorityOption,
        selectedPriority === priority && styles.selectedPriority
      ]}
      onPress={() => setSelectedPriority(priority)}
    >
      <View style={[styles.priorityIndicator, { backgroundColor: PRIORITY_COLORS[priority] }]}>
        <Text style={styles.priorityIcon}>{PRIORITY_ICONS[priority]}</Text>
      </View>
      <Text style={styles.priorityLabel}>{PRIORITY_LABELS[priority]}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Add New Task</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Task Description</Text>
            <TextInput
              style={styles.textInput}
              value={taskText}
              onChangeText={setTaskText}
              placeholder="Enter task description..."
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Priority</Text>
            <View style={styles.priorityContainer}>
              {priorities.map(renderPriorityOption)}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.subtasksHeader}>
              <Text style={styles.sectionTitle}>Subtasks</Text>
              <TouchableOpacity onPress={handleAddSubtask} style={styles.addSubtaskButton}>
                <Text style={styles.addSubtaskText}>+ Add</Text>
              </TouchableOpacity>
            </View>
            {subtasks.map((subtask, index) => (
              <View key={index} style={styles.subtaskInputContainer}>
                <TextInput
                  style={styles.subtaskInput}
                  value={subtask}
                  onChangeText={(text) => handleSubtaskChange(index, text)}
                  placeholder={`Subtask ${index + 1}...`}
                />
                {subtasks.length > 1 && (
                  <TouchableOpacity
                    onPress={() => handleRemoveSubtask(index)}
                    style={styles.removeSubtaskButton}
                  >
                    <Text style={styles.removeSubtaskText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, !taskText.trim() && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!taskText.trim()}
          >
            <Text style={styles.submitButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.small,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  closeButtonText: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  textInput: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 120,
  },
  selectedPriority: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  priorityIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  priorityIcon: {
    fontSize: 10,
  },
  priorityLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  subtasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  addSubtaskButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  addSubtaskText: {
    color: COLORS.card,
    fontSize: 12,
    fontWeight: '600',
  },
  subtaskInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  subtaskInput: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    fontSize: 14,
    color: COLORS.text,
  },
  removeSubtaskButton: {
    marginLeft: SPACING.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeSubtaskText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.medium,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  submitButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddTaskModal; 