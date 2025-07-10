export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'highest' | 'nutrition';
  completed: boolean;
  subtasks: Subtask[];
  expanded?: boolean;
}

export interface Day {
  id: string;
  date: string;
  dayName: string;
  tasks: Task[];
}

export interface Week {
  id: string;
  startDate: string;
  endDate: string;
  days: Day[];
}

export interface Template {
  id: string;
  name: string;
  icon: string;
  tasks: Task[];
}

export interface TemplateApplicationOptions {
  replaceExisting: boolean;
  mergeWithExisting: boolean;
}

export type PriorityColor = {
  high: string;
  medium: string;
  highest: string;
  nutrition: string;
};

export interface DragDropData {
  taskId: string;
  sourceDayId: string;
  sourceIndex: number;
  targetDayId?: string;
  targetIndex?: number;
} 