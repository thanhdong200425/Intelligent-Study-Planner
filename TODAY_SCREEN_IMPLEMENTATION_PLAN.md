# Today Screen Re-implementation Plan

## 📋 Overview

This plan outlines the complete re-implementation of the "Today" screen to match the new Figma design. The implementation is divided into frontend and backend tasks.

**Design Reference**: [Figma Design](https://www.figma.com/design/ZYP8cN2wCueQjLev4X5kkf/StudyGo-Main-Screens?node-id=275-263)

## 🎨 Phase 1: Frontend - Component Structure

### 1.1 Create New Components

- [ ] Create `TodayGreetingCard` component (NEW)
  - Dark gradient header with time-based greeting
  - Display current date and motivational quote
  - Settings buttons (brightness, theme, menu)
  - Tasks completion percentage badge
- [ ] **Enhance existing `TaskCard`** component (`components/tasks/TaskCard.tsx`)
  - ✅ Already has: Checkbox, title, strikethrough, badges (type, priority, course), time duration
  - Add: Hover state with "Start Focus" button (currently has opacity-0 button in Figma)
  - Note: Currently uses @heroui components (Checkbox, Chip, Button, Dropdown)
- [ ] **Enhance existing `TaskList`** component (`components/tasks/TaskList.tsx`)
  - ✅ Already has: List rendering, empty state handling
  - Add: Section header with task count and "View All" button
  - Add: Filter for today's tasks only
  - Update: Use enhanced TaskCard
- [ ] Create `DeadlineCard` component (NEW)
  - Deadline title
  - Priority badge
  - Course name with color coding
  - Due date countdown ("In X days")
  - Note: Can reference existing `DeadlinesList.tsx` structure
- [ ] Create `UpcomingDeadlines` component (NEW)
  - Section header with calendar icon
  - List of DeadlineCard components
  - "View Calendar" button
  - Note: Currently `Assignments.tsx` exists but uses static data
- [ ] **Utilize existing `StatCard`** component (`components/home/StatCard.tsx`)
  - ✅ Already has: Icon, title, value, colored backgrounds
  - Update: Adjust styling to match new Figma design (larger, different layout)
  - Current props: `icon`, `title`, `value`, `bgColor`, `iconColor`

### 1.2 Update Main Page Layout

- [ ] Refactor `fe/src/app/page.tsx` to use new components
- [ ] Implement grid layout matching Figma design

### 1.3 Styling & Design System

- [ ] Create/update color palette constants
  - ✅ Priority badges already implemented in `TaskCard.tsx`:
    - High: `bg-[#ffe2e2]`, `border-[#ffc9c9]`, `text-[#c10007]`
    - Medium: `bg-[#fef9c2]`, `border-[#fff085]`, `text-[#a65f00]`
    - Low: `bg-gray-100`, `border-gray-200`, `text-gray-600`
  - Add: Course color variants (blue, pink, amber, emerald, rose, violet)
  - Add: Stat card backgrounds (blue-100, orange-100, red-100, green-100)
  - Add: Gradient for header card (`from-[#101828] to-[#1e2939]`)
- [ ] **Use existing @heroui `Chip` component** for badges
  - ✅ Already in use: `TaskCard.tsx` uses `Chip` from @heroui
  - Support for `variant='bordered'` and custom colors
  - Icon support via `startContent` prop

---

## 🔧 Phase 2: Backend - Data Structure & APIs

### 2.1 Database Schema Updates

- [] **Task model already has all required fields:**
  - ✅ `type` field (enum: reading, coding, writing, pset, other)
  - ✅ `estimateMinutes` field for duration
  - ✅ `priority` field (low, medium, high, unknown)
  - ✅ `completed` boolean field
  - ✅ `actualMinutes` for tracking time spent
  - ✅ Relations: `courseId`, `deadlineId`, `userId`
  - Note: Missing `completedAt` timestamp
- [x] **Deadline model already has all required fields:**
  - ✅ Relation to Course (`courseId`)
  - ✅ Priority field (`DeadlinePriority`: LOW, MEDIUM, HIGH)
  - ✅ Due date field (`dueDate`)
  - ✅ `completed` boolean field

### 2.2 API Endpoints - Today's Tasks

- [ ] **Create new `GET /tasks/today` endpoint** (`tasks.controller.ts`)
  - ✅ Existing: `GET /tasks` returns all tasks with optional status filter
  - Add: New endpoint to filter tasks due today only
  - Include: task type, priority, course info (via Prisma `include`)
  - Include: estimated duration (already in model)
  - Sort: by priority and created time
  - Return: completion status
- [x] **`PATCH /tasks/:id/toggle-complete` endpoint already exists**
  - ✅ Current implementation toggles completion status
  - Update: Add `completedAt` timestamp update

### 2.3 API Endpoints - Deadlines

- [ ] **Create new `GET /deadlines/upcoming` endpoint** (`deadlines.controller.ts`)
  - ✅ Existing: `GET /deadlines` returns all deadlines sorted by due date
  - Add: New endpoint or query param to filter deadlines in next 7 days
  - Add: Include course information (via Prisma `include: { course: true }`)
  - ✅ Priority already in response
  - Add: Calculate relative due date in response ("In X days")
  - ✅ Already sorted by due date ascending

### 2.4 API Endpoints - Statistics

- [ ] **Create new `GET /stats/today` endpoint** (new controller or add to tasks)
  - Return: tasks completed count / total count for today
  - Return: remaining time (sum of `estimateMinutes` for incomplete tasks)
  - Return: count of high priority tasks
  - Note: Can query existing Task model data

---

## 🔌 Phase 3: Frontend - API Integration

### 3.1 Create API Service Functions

- [ ] **Update existing `services/task.ts`**

  - ✅ Already has: `getAllTasks()`, `handleToggleCompleteStatus(taskId)`
  - ✅ Already has: `createTask()`, `updateTask()`, `deleteTask()`
  - Add: `getTodayTasks()` - fetch tasks for today only
  - Note: Can reuse existing `handleToggleCompleteStatus` for toggle

- [ ] **Create new `services/deadline.ts`**
  - `getAllDeadlines()` - fetch all deadlines
  - `getUpcomingDeadlines(days?: number)` - fetch deadlines in next X days
  - `createDeadline()`, `updateDeadline()`, `deleteDeadline()`
- [ ] **Create new `services/stats.ts`**
  - `getTodayStats()` - fetch today's statistics
  - Returns: tasks completed/total, remaining time, high priority count
- [ ] **Create new `services/preferences.ts`**
  - `getUserPreferences()` - fetch user settings
  - `updateUserPreferences(data)` - update settings
  - Types: theme, default focus duration, etc.

### 3.2 State Management

- [ ] **Create Redux slice for today's data** (`store/slices/todaySlice.ts`)
  - ✅ App uses Redux (existing slices: app, auth, spotify, user)
  - State: tasks array, deadlines array, statistics object
  - State: loading states (tasksLoading, deadlinesLoading, statsLoading)
  - State: error states
  - Actions: fetchTodayTasks, fetchDeadlines, fetchStats, toggleTaskComplete
- [ ] **Create Redux slice for preferences** (`store/slices/preferencesSlice.ts`) (Please check whether they exist before creating new, if they exist, add a new field rather than create new)
  - State: theme ('light' | 'dark')
  - State: defaultFocusDuration
  - State: other UI preferences
  - Actions: setTheme, setFocusDuration, updatePreferences
- [ ] **Note:** App uses React Query for data fetching (see `TaskList.tsx`)
  - Consider using React Query instead of Redux for server state
  - Redux better for client-side UI state (theme, preferences)
  - React Query better for server state (tasks, deadlines, stats)

### 3.3 Implement Data Fetching

- [ ] Add data fetching in main Today page
  - Fetch on component mount
  - Implement loading states
  - Implement error states
  - Add refresh functionality
- [ ] Add optimistic updates for task completion
  - Update UI immediately on checkbox click
  - Revert on API error

---

## 🎯 Phase 4: Interactive Features

### 4.1 Task Interactions

- [ ] Implement checkbox toggle animation
- [ ] Add hover state for "Start Focus" button
- [ ] Implement "Start Focus" action
  - Navigate to timer session page
  - Pre-populate task information

### 4.2 Navigation Actions

- [ ] Implement "View All" button for tasks
  - Navigate to full tasks page
- [ ] Implement "View Calendar" button
  - Navigate to planner page

### 4.3 Header Card Features

- [ ] Implement dynamic greeting based on time of day
  - Morning (5am-12pm): "Good Morning"
  - Afternoon (12pm-5pm): "Good Afternoon"
  - Evening (5pm-9pm): "Good Evening"
  - Night (9pm-5am): "Good Night"
- [ ] Implement theme toggle button
- [ ] Implement brightness/display settings
- [ ] Add random motivational quote rotation
  - Create quotes array
  - Rotate daily
