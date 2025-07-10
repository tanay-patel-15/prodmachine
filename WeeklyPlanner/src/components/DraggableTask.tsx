import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../utils/constants';
import TaskItem from './TaskItem';
import { Task } from '../types';

interface DraggableTaskProps {
  task: Task;
  dayId: string;
  onToggleCompletion: (dayId: string, taskId: string) => void;
  onToggleSubtaskCompletion: (dayId: string, taskId: string, subtaskId: string) => void;
  onToggleExpansion: (dayId: string, taskId: string) => void;
  onDelete?: (dayId: string, taskId: string) => void;
  isDragging?: boolean;
}

const DraggableTask: React.FC<DraggableTaskProps> = ({
  task,
  dayId,
  onToggleCompletion,
  onToggleSubtaskCompletion,
  onToggleExpansion,
  onDelete,
  isDragging = false,
}) => {
  return (
    <View style={[styles.container, isDragging && styles.dragging]}>
      <TaskItem
        task={task}
        dayId={dayId}
        onToggleCompletion={onToggleCompletion}
        onToggleSubtaskCompletion={onToggleSubtaskCompletion}
        onToggleExpansion={onToggleExpansion}
        onDelete={onDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    opacity: 1,
  },
  dragging: {
    opacity: 0.5,
    transform: [{ scale: 1.05 }],
    ...SHADOWS.large,
  },
});

export default DraggableTask; 