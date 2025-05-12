# Zen Mind - Project Guidelines

## Project Overview

Zen Mind is a meditation and mindfulness application built with React Native and Expo. The app helps users develop a meditation practice through guided sessions, track their progress, maintain a journal, and view their meditation statistics.

## Project Structure

The project follows a modular structure optimized for React Native with Expo Router:

```
zen-mind/
├── app/                   # Main application screens (Expo Router)
│   ├── (tabs)/            # Tab-based navigation screens
│   │   ├── home/          # Home screen
│   │   ├── meditate/      # Meditation screens
│   │   ├── journal/       # Journal screens
│   │   ├── stats/         # Statistics screens
│   │   ├── settings/      # Settings screens
│   │   └── _layout.tsx    # Tab navigation layout
│   ├── _layout.tsx        # Root layout with providers
│   └── +not-found.tsx     # 404 page
│
├── components/            # Reusable UI components
│   ├── common/            # Shared components
│   ├── home/              # Home screen components
│   ├── meditation/        # Meditation components
│   ├── journal/           # Journal components
│   └── stats/             # Statistics components
│
├── context/               # React Context providers
│   ├── AppDataContext.tsx # App data state management
│   └── ThemeContext.tsx   # Theme state management
│
├── data/                  # Static data and constants
│
├── hooks/                 # Custom React hooks
│
├── types/                 # TypeScript type definitions
│   └── index.ts           # Core type definitions
│
├── utils/                 # Utility functions
│
└── assets/                # Static assets (images, fonts, etc.)
```

## Navigation Architecture

The app uses Expo Router for navigation, which is built on top of React Navigation:

- `app/_layout.tsx` - Sets up the root layout with theme and data providers
- `app/(tabs)/_layout.tsx` - Configures the bottom tab navigation with 5 main sections:
  - Home
  - Meditate
  - Journal
  - Stats
  - Settings

## Data Management

### Context Providers

The app uses React Context for state management:

1. **AppDataContext** - Manages all app data including:
   - Meditation sessions
   - Journal entries
   - App statistics
   - CRUD operations for sessions and journal entries
   - AsyncStorage integration for persistence

2. **ThemeContext** - Handles theme-related functionality:
   - Light and dark theme support
   - Responsive to system theme preferences
   - Theme toggle functionality
   - Consistent color and spacing values

### Data Models

Core data structures defined in `types/index.ts`:

- **MeditationSession** - Records of completed meditation sessions
- **JournalEntry** - User journal entries
- **AppStats** - Aggregated meditation statistics
- **BreathingPattern** - Predefined breathing exercise patterns
- **MeditationType** - Types of meditation available in the app

## Key Features

### 1. Home Screen
- Daily greeting and date
- Streak tracking
- Quick start meditation buttons
- Today's progress visualization
- Upcoming reminders
- Recent sessions list

### 2. Meditation
- Timer functionality
- Different meditation types
- Guided breathing exercises
- Mood tracking (before and after)
- Session completion and saving

### 3. Journal
- Create and edit journal entries
- View past entries
- Search and filter capabilities

### 4. Statistics
- Visualization of meditation trends
- Streak tracking
- Session duration analytics
- Mood improvement tracking

### 5. Settings
- Theme toggle (light/dark mode)
- Notification preferences
- Data management (reset/export)

## Styling Approach

The app uses a consistent styling approach:

- Theme-based styling through the ThemeContext
- React Native StyleSheet for component styling
- Consistent spacing through theme spacing values
- Custom fonts (Inter) loaded via Expo Font
- Responsive layouts that adapt to different screen sizes

## Data Persistence

The app uses AsyncStorage for local data persistence:

- Meditation sessions stored as 'meditation_sessions'
- Journal entries stored as 'journal_entries'
- Data is loaded on app startup and saved whenever it changes

## Icon System

The app uses:
- Lucide React Native for UI icons
- Expo Vector Icons for additional icons

## Development Workflow

1. Start the development server:
   ```
   npm run dev
   ```

2. Build for web:
   ```
   npm run build:web
   ```

3. Lint the codebase:
   ```
   npm run lint
   ```

## Dependencies

Key dependencies include:
- **Expo** - Core development framework
- **React Navigation** - Navigation library
- **AsyncStorage** - Local data persistence
- **Reanimated** - Advanced animations
- **Expo Router** - File-based routing
- **Lucide React Native** - Icon library
- **Expo Font** - Custom font loading

## Best Practices

When contributing to this project:

1. Follow the established project structure
2. Use TypeScript for type safety
3. Leverage the context providers for state management
4. Create reusable components in the appropriate component folder
5. Ensure theme compatibility (both light and dark modes)
6. Write meaningful commit messages
7. Update this guide when significant architectural changes are made
