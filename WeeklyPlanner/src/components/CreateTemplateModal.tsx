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
  Alert,
} from 'react-native';
import { Task, Template } from '../types';
import { PRIORITY_COLORS, PRIORITY_LABELS, PRIORITY_ICONS, COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';

interface CreateTemplateModalProps {
  visible: boolean;
  onClose: () => void;
  onSaveTemplate: (template: Omit<Template, 'id'>) => void;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  visible,
  onClose,
  onSaveTemplate,
}) => {
  const [templateName, setTemplateName] = useState('');
  const [templateIcon, setTemplateIcon] = useState('📋');
  const [tasks, setTasks] = useState<Omit<Task, 'id'>[]>([
    {
      text: '',
      priority: 'medium',
      completed: false,
      subtasks: [],
      expanded: false,
    }
  ]);

  const availableIcons = ['📋', '🏢', '🎓', '🏠', '💼', '🎯', '⭐', '🔥', '🚀', '💡', '📚', '🏃', '🍽️', '🧘', '🎨', '🎵'];

  const priorities: Task['priority'][] = ['high', 'medium', 'highest', 'nutrition'];

  const addTask = () => {
    setTasks([...tasks, {
      text: '',
      priority: 'medium',
      completed: false,
      subtasks: [],
      expanded: false,
    }]);
  };

  const removeTask = (index: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  const updateTask = (index: number, field: keyof Task, value: any) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTasks(newTasks);
  };

  const addSubtask = (taskIndex: number) => {
    const newTasks = [...tasks];
    newTasks[taskIndex].subtasks.push({
      id: Date.now().toString(),
      text: '',
      completed: false,
    });
    setTasks(newTasks);
  };

  const removeSubtask = (taskIndex: number, subtaskIndex: number) => {
    const newTasks = [...tasks];
    newTasks[taskIndex].subtasks.splice(subtaskIndex, 1);
    setTasks(newTasks);
  };

  const updateSubtask = (taskIndex: number, subtaskIndex: number, text: string) => {
    const newTasks = [...tasks];
    newTasks[taskIndex].subtasks[subtaskIndex].text = text;
    setTasks(newTasks);
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      Alert.alert('Error', 'Please enter a template name');
      return;
    }

    const validTasks = tasks.filter(task => task.text.trim());
    if (validTasks.length === 0) {
      Alert.alert('Error', 'Please add at least one task');
      return;
    }

    const newTemplate: Omit<Template, 'id'> = {
      name: templateName.trim(),
      icon: templateIcon,
      tasks: validTasks.map(task => ({
        ...task,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        subtasks: task.subtasks.filter(subtask => subtask.text.trim()).map(subtask => ({
          ...subtask,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        }))
      }))
    };

    onSaveTemplate(newTemplate);
    setTemplateName('');
    setTemplateIcon('📋');
    setTasks([{
      text: '',
      priority: 'medium',
      completed: false,
      subtasks: [],
      expanded: false,
    }]);
    onClose();
  };

  const renderTask = (task: Omit<Task, 'id'>, index: number) => (
    <View key={index} style={styles.taskContainer}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskNumber}>Task {index + 1}</Text>
        <TouchableOpacity
          style={styles.removeTaskButton}
          onPress={() => removeTask(index)}
          disabled={tasks.length === 1}
        >
          <Text style={styles.removeTaskText}>×</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.taskInput}
        value={task.text}
        onChangeText={(text) => updateTask(index, 'text', text)}
        placeholder="Enter task description..."
        multiline
      />

      <View style={styles.priorityContainer}>
        <Text style={styles.sectionLabel}>Priority:</Text>
        <View style={styles.priorityOptions}>
          {priorities.map(priority => (
            <TouchableOpacity
              key={priority}
              style={[
                styles.priorityOption,
                task.priority === priority && styles.selectedPriority
              ]}
              onPress={() => updateTask(index, 'priority', priority)}
            >
              <View style={[styles.priorityIndicator, { backgroundColor: PRIORITY_COLORS[priority] }]}>
                <Text style={styles.priorityIcon}>{PRIORITY_ICONS[priority]}</Text>
              </View>
              <Text style={styles.priorityLabel}>{PRIORITY_LABELS[priority]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.subtasksSection}>
        <View style={styles.subtasksHeader}>
          <Text style={styles.sectionLabel}>Subtasks:</Text>
          <TouchableOpacity
            style={styles.addSubtaskButton}
            onPress={() => addSubtask(index)}
          >
            <Text style={styles.addSubtaskText}>+ Add Subtask</Text>
          </TouchableOpacity>
        </View>
        
        {task.subtasks.map((subtask, subtaskIndex) => (
          <View key={subtaskIndex} style={styles.subtaskContainer}>
            <TextInput
              style={styles.subtaskInput}
              value={subtask.text}
              onChangeText={(text) => updateSubtask(index, subtaskIndex, text)}
              placeholder={`Subtask ${subtaskIndex + 1}...`}
            />
            <TouchableOpacity
              style={styles.removeSubtaskButton}
              onPress={() => removeSubtask(index, subtaskIndex)}
            >
              <Text style={styles.removeSubtaskText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
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
          <Text style={styles.title}>Create Personal Template</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Template Details</Text>
            
            <TextInput
              style={styles.nameInput}
              value={templateName}
              onChangeText={setTemplateName}
              placeholder="Template name..."
              maxLength={50}
            />

            <View style={styles.iconSection}>
              <Text style={styles.sectionLabel}>Choose Icon:</Text>
              <View style={styles.iconGrid}>
                {availableIcons.map(icon => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconOption,
                      templateIcon === icon && styles.selectedIcon
                    ]}
                    onPress={() => setTemplateIcon(icon)}
                  >
                    <Text style={styles.iconText}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.tasksHeader}>
              <Text style={styles.sectionTitle}>Tasks</Text>
              <TouchableOpacity
                style={styles.addTaskButton}
                onPress={addTask}
              >
                <Text style={styles.addTaskText}>+ Add Task</Text>
              </TouchableOpacity>
            </View>
            
            {tasks.map((task, index) => renderTask(task, index))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Template</Text>
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
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  nameInput: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  iconSection: {
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
  },
  selectedIcon: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  iconText: {
    fontSize: 24,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  addTaskButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  addTaskText: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: '600',
  },
  taskContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  taskNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  removeTaskButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeTaskText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    marginBottom: SPACING.md,
  },
  priorityOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 120,
  },
  selectedPriority: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
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
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
  subtasksSection: {
    marginTop: SPACING.sm,
  },
  subtasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  addSubtaskButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  addSubtaskText: {
    color: COLORS.card,
    fontSize: 12,
    fontWeight: '600',
  },
  subtaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  subtaskInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    fontSize: 12,
    color: COLORS.text,
  },
  removeSubtaskButton: {
    marginLeft: SPACING.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeSubtaskText: {
    color: COLORS.card,
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
    ...SHADOWS.medium,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.border,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateTemplateModal; 