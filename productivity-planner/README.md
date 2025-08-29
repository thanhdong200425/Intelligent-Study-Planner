# Productivity Planner

A comprehensive NextJS/TypeScript productivity app with scheduling, time tracking, habit management, and analytics.

## Features

### 📚 Data Management
- **Courses**: Add courses with names and color coding
- **Deadlines**: Set deadlines with priority levels and due dates
- **Tasks**: Create tasks with time estimates and types (reading, coding, writing, problem sets)
- **Availability**: Define your available time windows throughout the week

### 📅 Weekly Planning
- **Generate Week**: Automatically schedule tasks into available time slots
- **Drag & Drop**: Move and reschedule time blocks in the calendar
- **Smart Scheduling**: Considers deadlines, priorities, and availability
- **Break Management**: Automatically inserts breaks between work sessions

### ⏱️ Time Tracking
- **Timer**: Start/pause/stop timer for any time block
- **Actual vs Estimated**: Track actual time spent vs predicted time
- **Session Logging**: All timer sessions are logged for analysis

### 🎯 Habit Tracking
- **Daily Goals**: Set target minutes for daily habits
- **Streak Tracking**: Monitor current and longest streaks
- **Visual Progress**: Week-at-a-glance progress visualization
- **Check-ins**: Log completed habit minutes daily

### 📊 Weekly Analytics
- **Task Completion**: Tasks completed vs overdue
- **Time Efficiency**: Actual vs predicted time analysis
- **Course Breakdown**: Time spent per course
- **Habit Streaks**: All habit streak tracking
- **Productivity Insights**: AI-generated insights about your most productive times

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

### 1. Add Your Data
1. Go to the **Add Data** tab
2. Start by adding **Courses** (name + color)
3. Add **Deadlines** with due dates and priorities
4. Create **Tasks** with time estimates
5. Set your **Availability** windows (when you're free to work)

### 2. Generate Your Week
1. Go to the **Calendar** tab
2. Click **"Generate Week"** to automatically schedule your tasks
3. The algorithm will place tasks in your available time slots
4. Breaks are automatically added between work sessions

### 3. Manage Your Schedule
- **Drag and drop** time blocks to reschedule them
- **Delete blocks** that you don't need
- **View** your week at a glance

### 4. Track Your Time
1. Go to the **Timer** tab
2. Select a time block from your calendar
3. Use **Start/Pause/Stop** controls to track actual time
4. The system logs actual vs estimated time for analysis

### 5. Build Habits
1. Go to the **Habits** tab
2. Add daily habits with target minutes
3. **Check in** daily by logging completed minutes
4. View your **streaks** and weekly progress

### 6. Analyze Your Productivity
1. Go to the **Analytics** tab
2. View your **weekly summary** with:
   - Task completion rates
   - Time efficiency metrics
   - Time spent per course
   - Habit streak tracking
   - Productivity insights

## Data Storage

All data is stored locally in your browser's localStorage. Your data includes:
- Courses, deadlines, tasks, and availability windows
- Time blocks and scheduling data
- Timer sessions and actual time tracking
- Habit completions and streaks
- Weekly summaries and analytics

## Technical Features

- **TypeScript**: Full type safety throughout the application
- **NextJS 14**: Modern React framework with App Router
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Drag & Drop**: Powered by @dnd-kit for intuitive scheduling
- **Date Handling**: date-fns for robust date manipulation
- **Local Storage**: Client-side data persistence
- **Responsive Design**: Works on desktop and mobile devices

## Development

### Project Structure
```
src/
├── app/                    # NextJS App Router
├── components/            # React components
│   ├── calendar/         # Calendar and time block components
│   ├── forms/            # Data entry forms
│   ├── habits/           # Habit tracking components
│   ├── timer/            # Timer functionality
│   ├── analytics/        # Weekly summary and insights
│   ├── layout/           # Navigation and layout
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and business logic
│   ├── storage.ts        # Local storage operations
│   └── scheduler.ts      # Weekly scheduling algorithm
└── types/                # TypeScript type definitions
```

### Key Technologies
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first styling
- **@dnd-kit**: Accessible drag and drop
- **date-fns**: Date manipulation library
- **Lucide React**: Beautiful icons

## Future Enhancements

Potential features to add:
- **Cloud Sync**: Save data to cloud storage
- **Team Collaboration**: Share schedules with others
- **Calendar Integration**: Sync with Google Calendar
- **Mobile App**: Native mobile application
- **Advanced Analytics**: More detailed productivity insights
- **Templates**: Pre-built schedule templates
- **Notifications**: Reminders and alerts

## Contributing

This project was built as a demonstration of modern web development practices. Feel free to fork and extend it with additional features!

## License

MIT License - feel free to use this project for personal or commercial purposes.