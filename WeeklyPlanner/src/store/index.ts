import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Week, Task, Template, Day, Subtask } from '../types';

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
  applyTemplate: (templateId: string, dayId: string, options: { replaceExisting: boolean; mergeWithExisting: boolean }) => void;
  
  // Drag and drop
  moveTask: (sourceDayId: string, sourceIndex: number, targetDayId: string, targetIndex: number) => void;
  
  // Utility
  setLoading: (loading: boolean) => void;
}

type AppStore = AppState & AppActions;

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper function to get week by ID
const getWeekById = (weeks: Week[], weekId: string) => weeks.find(week => week.id === weekId);

// Helper function to get day by ID
const getDayById = (days: Day[], dayId: string) => days.find(day => day.id === dayId);

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      weeks: [],
      templates: [
        {
          id: 'work-day',
          name: 'Work Day',
          icon: '🏢',
          tasks: [
            {
              id: 'work-meeting',
              text: 'Meeting with manager',
              priority: 'high',
              completed: false,
              subtasks: [
                { id: 'prep-notes', text: 'Prepare notes', completed: false },
                { id: 'review-agenda', text: 'Review agenda', completed: false }
              ],
              expanded: false
            },
            {
              id: 'work-email',
              text: 'Check emails',
              priority: 'medium',
              completed: false,
              subtasks: [],
              expanded: false
            },
            {
              id: 'work-lunch',
              text: 'Lunch break',
              priority: 'nutrition',
              completed: false,
              subtasks: [],
              expanded: false
            }
          ]
        },
        {
          id: 'school-day',
          name: 'School Day',
          icon: '🎓',
          tasks: [
            {
              id: 'school-study',
              text: 'Study session',
              priority: 'highest',
              completed: false,
              subtasks: [
                { id: 'read-chapter', text: 'Read chapter 5', completed: false },
                { id: 'practice-problems', text: 'Practice problems', completed: false }
              ],
              expanded: false
            },
            {
              id: 'school-homework',
              text: 'Complete homework',
              priority: 'high',
              completed: false,
              subtasks: [],
              expanded: false
            }
          ]
        },
        {
          id: 'free-day',
          name: 'Free Day',
          icon: '🏠',
          tasks: [
            {
              id: 'free-exercise',
              text: 'Exercise',
              priority: 'medium',
              completed: false,
              subtasks: [],
              expanded: false
            },
            {
              id: 'free-relax',
              text: 'Relaxation time',
              priority: 'medium',
              completed: false,
              subtasks: [],
              expanded: false
            }
          ]
        }
      ],
      currentWeekIndex: 0,
      isLoading: false,

      // Week management actions
      addWeek: (week) => set((state) => ({ 
        weeks: [...state.weeks, week],
        currentWeekIndex: state.weeks.length 
      })),

      setCurrentWeek: (index) => set({ currentWeekIndex: index }),

      updateWeek: (weekId, updatedWeek) => set((state) => ({
        weeks: state.weeks.map(week => 
          week.id === weekId ? updatedWeek : week
        )
      })),

      deleteWeek: (weekId) => set((state) => ({
        weeks: state.weeks.filter(week => week.id !== weekId),
        currentWeekIndex: Math.max(0, state.currentWeekIndex - 1)
      })),

      // Task management actions
      addTask: (dayId, task) => set((state) => ({
        weeks: state.weeks.map(week => ({
          ...week,
          days: week.days.map(day => 
            day.id === dayId 
              ? { ...day, tasks: [...day.tasks, { ...task, id: generateId() }] }
              : day
          )
        }))
      })),

      updateTask: (dayId, taskId, updatedTask) => set((state) => ({
        weeks: state.weeks.map(week => ({
          ...week,
          days: week.days.map(day => 
            day.id === dayId 
              ? { 
                  ...day, 
                  tasks: day.tasks.map(task => 
                    task.id === taskId 
                      ? { ...task, ...updatedTask }
                      : task
                  ) 
                }
              : day
          )
        }))
      })),

      deleteTask: (dayId, taskId) => set((state) => ({
        weeks: state.weeks.map(week => ({
          ...week,
          days: week.days.map(day => 
            day.id === dayId 
              ? { ...day, tasks: day.tasks.filter(task => task.id !== taskId) }
              : day
          )
        }))
      })),

      toggleTaskCompletion: (dayId, taskId) => set((state) => ({
        weeks: state.weeks.map(week => ({
          ...week,
          days: week.days.map(day => 
            day.id === dayId 
              ? { 
                  ...day, 
                  tasks: day.tasks.map(task => 
                    task.id === taskId 
                      ? { ...task, completed: !task.completed }
                      : task
                  ) 
                }
              : day
          )
        }))
      })),

      toggleSubtaskCompletion: (dayId, taskId, subtaskId) => set((state) => ({
        weeks: state.weeks.map(week => ({
          ...week,
          days: week.days.map(day => 
            day.id === dayId 
              ? { 
                  ...day, 
                  tasks: day.tasks.map(task => 
                    task.id === taskId 
                      ? { 
                          ...task, 
                          subtasks: task.subtasks.map(subtask => 
                            subtask.id === subtaskId 
                              ? { ...subtask, completed: !subtask.completed }
                              : subtask
                          ) 
                        }
                      : task
                  ) 
                }
              : day
          )
        }))
      })),

      toggleTaskExpansion: (dayId, taskId) => set((state) => ({
        weeks: state.weeks.map(week => ({
          ...week,
          days: week.days.map(day => 
            day.id === dayId 
              ? { 
                  ...day, 
                  tasks: day.tasks.map(task => 
                    task.id === taskId 
                      ? { ...task, expanded: !task.expanded }
                      : task
                  ) 
                }
              : day
          )
        }))
      })),

      // Template management actions
      addTemplate: (template) => set((state) => ({
        templates: [...state.templates, template]
      })),

      updateTemplate: (templateId, updatedTemplate) => set((state) => ({
        templates: state.templates.map(template => 
          template.id === templateId ? updatedTemplate : template
        )
      })),

      deleteTemplate: (templateId) => set((state) => ({
        templates: state.templates.filter(template => template.id !== templateId)
      })),

      applyTemplate: (templateId, dayId, options) => set((state) => {
        const template = state.templates.find(t => t.id === templateId);
        if (!template) return state;

        return {
          weeks: state.weeks.map(week => ({
            ...week,
            days: week.days.map(day => {
              if (day.id !== dayId) return day;
              
              let newTasks: Task[];
              if (options.replaceExisting) {
                newTasks = template.tasks.map(task => ({
                  ...task,
                  id: generateId(),
                  subtasks: task.subtasks.map(subtask => ({
                    ...subtask,
                    id: generateId()
                  }))
                }));
              } else if (options.mergeWithExisting) {
                newTasks = [
                  ...day.tasks,
                  ...template.tasks.map(task => ({
                    ...task,
                    id: generateId(),
                    subtasks: task.subtasks.map(subtask => ({
                      ...subtask,
                      id: generateId()
                    }))
                  }))
                ];
              } else {
                newTasks = day.tasks;
              }
              
              return { ...day, tasks: newTasks };
            })
          }))
        };
      }),

      // Drag and drop actions
      moveTask: (sourceDayId, sourceIndex, targetDayId, targetIndex) => set((state) => {
        const sourceDay = state.weeks
          .flatMap(week => week.days)
          .find(day => day.id === sourceDayId);
        
        if (!sourceDay || sourceIndex >= sourceDay.tasks.length) return state;

        const taskToMove = sourceDay.tasks[sourceIndex];
        
        return {
          weeks: state.weeks.map(week => ({
            ...week,
            days: week.days.map(day => {
              if (day.id === sourceDayId) {
                // Remove task from source
                const newTasks = day.tasks.filter((_, index) => index !== sourceIndex);
                return { ...day, tasks: newTasks };
              }
              
              if (day.id === targetDayId) {
                // Add task to target
                const newTasks = [...day.tasks];
                newTasks.splice(targetIndex, 0, taskToMove);
                return { ...day, tasks: newTasks };
              }
              
              return day;
            })
          }))
        };
      }),

      // Utility actions
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'weekly-planner-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 