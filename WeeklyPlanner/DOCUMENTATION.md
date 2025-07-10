# Weekly Productivity Planner - Technical Documentation

## Overview

The Weekly Productivity Planner is a cross-platform React Native application that provides comprehensive task management with a weekly view, template system, and priority-based organization. The app supports iOS, Android, and Web platforms through React Native Web.

## Architecture

### Tech Stack
- **Frontend**: React Native + React Native Web
- **Language**: TypeScript
- **State Management**: Zustand
- **Storage**: AsyncStorage
- **Gestures**: React Native Gesture Handler
- **Animations**: React Native Reanimated
- **Build Tool**: Expo

### Project Structure
```
src/
├── components/          # React components
│   ├── TaskItem.tsx    # Individual task with priority colors
│   ├── DayColumn.tsx   # Day column with task list
│   ├── WeekView.tsx    # Horizontal weekly view
│   ├── TemplateModal.tsx # Template selection interface
│   ├── AddTaskModal.tsx # Task creation modal
│   └── DraggableTask.tsx # Future drag-drop implementation
├── store/              # State management
│   └── index.ts        # Zustand store with persistence
├── types/              # TypeScript definitions
│   └── index.ts        # App interfaces and types
├── utils/              # Utility functions
│   ├── constants.ts    # Design system and colors
│   └── dateUtils.ts    # Date manipulation helpers
├── hooks/              # Custom React hooks
│   └── useDragDrop.ts  # Drag and drop state management
└── App.tsx             # Main application component
```

## Core Components

### 1. TaskItem Component
**File**: `src/components/TaskItem.tsx`

**Purpose**: Renders individual tasks with priority indicators, checkboxes, and expandable subtasks.

**Features**:
- Color-coded priority indicators (🔴🟡🟢🔵)
- Checkbox completion toggle
- Expandable subtask list
- Delete functionality
- Visual feedback for completed tasks

**Props**:
```typescript
interface TaskItemProps {
  task: Task;
  dayId: string;
  onToggleCompletion: (dayId: string, taskId: string) => void;
  onToggleSubtaskCompletion: (dayId: string, taskId: string, subtaskId: string) => void;
  onToggleExpansion: (dayId: string, taskId: string) => void;
  onDelete?: (dayId: string, taskId: string) => void;
}
```

### 2. DayColumn Component
**File**: `src/components/DayColumn.tsx`

**Purpose**: Displays tasks for a single day with progress tracking and template application.

**Features**:
- Today highlighting with blue border
- Progress bar showing completion ratio
- Empty state with add task and template buttons
- Floating action button for adding tasks
- Responsive design for different screen sizes

**Props**:
```typescript
interface DayColumnProps {
  day: Day;
  onToggleTaskCompletion: (dayId: string, taskId: string) => void;
  onToggleSubtaskCompletion: (dayId: string, taskId: string, subtaskId: string) => void;
  onToggleTaskExpansion: (dayId: string, taskId: string) => void;
  onDeleteTask?: (dayId: string, taskId: string) => void;
  onAddTask?: (dayId: string) => void;
  onApplyTemplate?: (dayId: string) => void;
}
```

### 3. WeekView Component
**File**: `src/components/WeekView.tsx`

**Purpose**: Horizontal scrollable container for the weekly view with navigation and statistics.

**Features**:
- Horizontal scrolling for day columns
- Week range display
- Task statistics (total and completed)
- Responsive padding for web vs mobile

**Props**:
```typescript
interface WeekViewProps {
  week: Week;
  onToggleTaskCompletion: (dayId: string, taskId: string) => void;
  onToggleSubtaskCompletion: (dayId: string, taskId: string, subtaskId: string) => void;
  onToggleTaskExpansion: (dayId: string, taskId: string) => void;
  onDeleteTask?: (dayId: string, taskId: string) => void;
  onAddTask?: (dayId: string) => void;
  onApplyTemplate?: (dayId: string) => void;
}
```

### 4. TemplateModal Component
**File**: `src/components/TemplateModal.tsx`

**Purpose**: Modal interface for selecting and applying task templates to days.

**Features**:
- Template selection with icons and descriptions
- Application options (replace vs merge)
- Radio button interface for options
- Validation before application

**Props**:
```typescript
interface TemplateModalProps {
  visible: boolean;
  templates: Template[];
  onClose: () => void;
  onApplyTemplate: (templateId: string, options: TemplateApplicationOptions) => void;
  selectedDayId?: string;
}
```

### 5. AddTaskModal Component
**File**: `src/components/AddTaskModal.tsx`

**Purpose**: Modal for creating new tasks with priority selection and subtask management.

**Features**:
- Task description input
- Priority selection with visual indicators
- Dynamic subtask addition/removal
- Form validation
- Clean form reset on submission

**Props**:
```typescript
interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
}
```

## State Management

### Zustand Store
**File**: `src/store/index.ts`

**Structure**:
```typescript
interface AppState {
  weeks: Week[];
  templates: Template[];
  currentWeekIndex: number;
  isLoading: boolean;
}

interface AppActions {
  // Week management
  addWeek: (week: Week) => void;
  setCurrentWeek: (index: number) => void;
  updateWeek: (weekId: string, updatedWeek: Week) => void;
  deleteWeek: (weekId: string) => void;
  
  // Task management
  addTask: (dayId: string, task: Task) => void;
  updateTask: (dayId: string, taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (dayId: string, taskId: string) => void;
  toggleTaskCompletion: (dayId: string, taskId: string) => void;
  toggleSubtaskCompletion: (dayId: string, taskId: string, subtaskId: string) => void;
  toggleTaskExpansion: (dayId: string, taskId: string) => void;
  
  // Template management
  addTemplate: (template: Template) => void;
  updateTemplate: (templateId: string, updatedTemplate: Template) => void;
  deleteTemplate: (templateId: string) => void;
  applyTemplate: (templateId: string, dayId: string, options: TemplateApplicationOptions) => void;
  
  // Drag and drop
  moveTask: (sourceDayId: string, sourceIndex: number, targetDayId: string, targetIndex: number) => void;
  
  // Utility
  setLoading: (loading: boolean) => void;
}
```

**Persistence**: Uses Zustand's persist middleware with AsyncStorage for local data persistence.

## Data Models

### Core Types
```typescript
interface Task {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'highest' | 'nutrition';
  completed: boolean;
  subtasks: Subtask[];
  expanded?: boolean;
}

interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

interface Day {
  id: string;
  date: string;
  dayName: string;
  tasks: Task[];
}

interface Week {
  id: string;
  startDate: string;
  endDate: string;
  days: Day[];
}

interface Template {
  id: string;
  name: string;
  icon: string;
  tasks: Task[];
}
```

## Design System

### Colors
```typescript
export const PRIORITY_COLORS: PriorityColor = {
  high: '#FF6B6B',      // Red
  medium: '#FFD93D',    // Yellow
  highest: '#4ECDC4',   // Green (Emergency/Highest)
  nutrition: '#6C5CE7'  // Blue
};

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#F2F2F7',
  card: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#C6C6C8',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30'
};
```

### Spacing
```typescript
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};
```

### Shadows
```typescript
export const SHADOWS = {
  small: { /* iOS and Android shadow styles */ },
  medium: { /* iOS and Android shadow styles */ },
  large: { /* iOS and Android shadow styles */ }
};
```

## Platform-Specific Considerations

### Web Platform
- **Responsive Design**: Different column widths and padding for desktop
- **Mouse Interactions**: Hover states and click handlers
- **Scrolling**: Web-optimized horizontal scrolling
- **Storage**: Browser-based AsyncStorage implementation

### Mobile Platforms
- **Touch Interactions**: Touch-optimized button sizes and spacing
- **Gestures**: Native gesture handling for future drag-and-drop
- **Animations**: Platform-specific animation configurations
- **Navigation**: Native modal presentations

## Performance Optimizations

### React Native Web
- **Bundle Size**: Tree-shaking and code splitting
- **Rendering**: Optimized component re-renders
- **Memory**: Efficient list rendering with proper keys

### Mobile
- **FlatList**: Virtualized list rendering for large task lists
- **Memoization**: React.memo for expensive components
- **Gesture Performance**: Optimized gesture handling

## Future Enhancements

### Planned Features
1. **Drag and Drop**: Full implementation using React Native Reanimated
2. **Task Categories**: Additional task categorization system
3. **Data Export**: Export tasks to various formats
4. **Cloud Sync**: Multi-device synchronization
5. **Notifications**: Task reminders and notifications
6. **Analytics**: Task completion analytics and insights

### Technical Improvements
1. **Testing**: Unit and integration tests
2. **Accessibility**: Screen reader support and accessibility features
3. **Internationalization**: Multi-language support
4. **Offline Support**: Enhanced offline functionality
5. **Performance**: Further optimization for large datasets

## Development Guidelines

### Code Style
- **TypeScript**: Strict type checking enabled
- **Components**: Functional components with hooks
- **Props**: Interface-based prop definitions
- **Styling**: StyleSheet.create for performance

### State Management
- **Single Source of Truth**: All state in Zustand store
- **Immutable Updates**: Proper state immutability
- **Persistence**: Automatic data persistence
- **Actions**: Clear action naming and structure

### Component Design
- **Composition**: Favor composition over inheritance
- **Props**: Minimal, focused prop interfaces
- **Reusability**: Reusable, configurable components
- **Performance**: Optimized re-renders and updates

## Troubleshooting

### Common Issues
1. **TypeScript Errors**: Ensure all imports are properly typed
2. **Platform Differences**: Test on all target platforms
3. **Performance**: Monitor bundle size and render performance
4. **Storage**: Verify AsyncStorage implementation

### Debug Tools
- **React Native Debugger**: For mobile debugging
- **Chrome DevTools**: For web debugging
- **Expo DevTools**: For development workflow
- **TypeScript Compiler**: For type checking

---

This documentation provides a comprehensive overview of the Weekly Productivity Planner's architecture, components, and development guidelines. For specific implementation details, refer to the individual component files and type definitions. 