# Weekly Productivity Planner

A cross-platform productivity app built with React Native and React Native Web for iOS, Android, and Web platforms.

## Features

### 🗓️ Weekly Task Management
- **Horizontal weekly view** showing all 7 days
- **Color-coded priority system**:
  - 🔴 Red - High priority
  - 🟡 Yellow - Medium priority  
  - 🟢 Green - Emergency/Highest priority
  - 🔵 Blue - Nutrition-related
- **Checkbox completion** for tasks and subtasks
- **Expandable subtasks** with unlimited nesting
- **Add new weeks** and navigate between them
- **Progress tracking** per day

### 📋 Routine Templates
- **Pre-built templates**:
  - 🏢 Work Day - Professional tasks and meetings
  - 🎓 School Day - Study sessions and homework
  - 🏠 Free Day - Exercise and relaxation
- **One-click template application** with options to:
  - Replace existing tasks
  - Merge with existing tasks
- **Customizable templates** with default tasks and priorities

### 🎯 Task Features
- **Hierarchical tasks** with unlimited subtasks
- **Drag & drop reordering** within and between days
- **Priority color coding** for quick visual identification
- **Task completion tracking** with progress indicators
- **Today highlighting** for current day focus

### 🔧 Technical Features
- **Cross-platform** support (iOS, Android, Web)
- **TypeScript** for type safety
- **Zustand** for state management
- **AsyncStorage** for local persistence
- **Responsive design** for mobile and desktop
- **Modern UI** with smooth animations

## Tech Stack

- **React Native** with **React Native Web**
- **TypeScript** for type safety
- **Zustand** for state management
- **AsyncStorage** for local storage
- **React Native Gesture Handler** for interactions
- **React Native Reanimated** for animations

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WeeklyPlanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # For Web
   npm run web
   ```

## Project Structure

```
src/
├── components/          # React components
│   ├── TaskItem.tsx    # Individual task component
│   ├── DayColumn.tsx   # Day column with tasks
│   ├── WeekView.tsx    # Weekly view container
│   └── TemplateModal.tsx # Template selection modal
├── store/              # State management
│   └── index.ts        # Zustand store
├── types/              # TypeScript definitions
│   └── index.ts        # App types and interfaces
├── utils/              # Utility functions
│   ├── constants.ts    # App constants and colors
│   └── dateUtils.ts    # Date manipulation utilities
├── hooks/              # Custom React hooks
│   └── useDragDrop.ts  # Drag and drop functionality
└── App.tsx             # Main app component
```

## Usage

### Adding Tasks
1. Tap the "+" button on any day column
2. Select a template or create a custom task
3. Set priority and add subtasks as needed

### Applying Templates
1. Tap "📋 Apply Template" on any day
2. Select from available templates
3. Choose application method:
   - **Replace existing**: Removes all current tasks
   - **Merge with existing**: Adds template tasks to current tasks

### Navigating Weeks
- Use "← Previous" and "Next →" buttons to navigate
- The app automatically creates new weeks as needed
- Current week is highlighted with a blue border

### Managing Tasks
- **Complete tasks**: Tap the checkbox
- **Expand subtasks**: Tap the arrow (▶) next to tasks with subtasks
- **Delete tasks**: Tap the "×" button (if enabled)
- **Reorder tasks**: Drag and drop (coming soon)

## Platform-Specific Features

### Mobile (iOS/Android)
- Native gesture handling
- Platform-specific animations
- Touch-optimized interface
- Native navigation patterns

### Web
- Mouse and keyboard support
- Responsive design for desktop
- Web-optimized scrolling
- Browser-based storage

## Development

### Adding New Features
1. Create components in `src/components/`
2. Add types in `src/types/index.ts`
3. Update store in `src/store/index.ts`
4. Add utilities in `src/utils/`

### Styling
- Use the design system in `src/utils/constants.ts`
- Follow the spacing and color guidelines
- Ensure cross-platform compatibility

### State Management
- All state is managed through Zustand store
- Actions are defined in the store interface
- Persistence is handled automatically

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple platforms
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub.

---

**Note**: This is a development version. Some features like drag-and-drop and task creation modals are planned for future iterations. 