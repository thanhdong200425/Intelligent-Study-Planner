import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  sidebarCollapsed: boolean;
  isLoading: boolean;
  notifications: {
    enabled: boolean;
    count: number;
    items: NotificationItem[];
  };
  modals: {
    isOpen: boolean;
    type: string | null;
    data: any;
  };
  toast: {
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  };
  temporaryEmail: string | null;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

const initialState: AppState = {
  theme: 'system',
  language: 'en',
  sidebarCollapsed: false,
  isLoading: false,
  notifications: {
    enabled: true,
    count: 0,
    items: [],
  },
  modals: {
    isOpen: false,
    type: null,
    data: null,
  },
  toast: {
    isVisible: false,
    message: '',
    type: 'info',
  },
  temporaryEmail: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    toggleSidebar: state => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTemporaryEmail: (state, action: PayloadAction<string | null>) => {
      state.temporaryEmail = action.payload;
    },

    // Notification actions
    addNotification: (
      state,
      action: PayloadAction<Omit<NotificationItem, 'id' | 'timestamp' | 'read'>>
    ) => {
      const notification: NotificationItem = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.notifications.items.unshift(notification);
      state.notifications.count += 1;
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.items.find(
        n => n.id === action.payload
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.notifications.count -= 1;
      }
    },
    markAllNotificationsAsRead: state => {
      state.notifications.items.forEach(notification => {
        notification.read = true;
      });
      state.notifications.count = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.items.findIndex(
        n => n.id === action.payload
      );
      if (index !== -1) {
        const notification = state.notifications.items[index];
        if (!notification.read) {
          state.notifications.count -= 1;
        }
        state.notifications.items.splice(index, 1);
      }
    },
    clearAllNotifications: state => {
      state.notifications.items = [];
      state.notifications.count = 0;
    },
    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.notifications.enabled = action.payload;
    },

    // Modal actions
    openModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.modals.isOpen = true;
      state.modals.type = action.payload.type;
      state.modals.data = action.payload.data || null;
    },
    closeModal: state => {
      state.modals.isOpen = false;
      state.modals.type = null;
      state.modals.data = null;
    },

    // Toast actions
    showToast: (
      state,
      action: PayloadAction<{
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
      }>
    ) => {
      state.toast.isVisible = true;
      state.toast.message = action.payload.message;
      state.toast.type = action.payload.type;
    },
    hideToast: state => {
      state.toast.isVisible = false;
      state.toast.message = '';
    },

    // Reset app state
    resetApp: state => {
      state.sidebarCollapsed = false;
      state.isLoading = false;
      state.notifications = {
        enabled: true,
        count: 0,
        items: [],
      };
      state.modals = {
        isOpen: false,
        type: null,
        data: null,
      };
      state.toast = {
        isVisible: false,
        message: '',
        type: 'info',
      };
    },
  },
});

export const {
  setTheme,
  setLanguage,
  toggleSidebar,
  setSidebarCollapsed,
  setLoading,
  setTemporaryEmail,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearAllNotifications,
  setNotificationsEnabled,
  openModal,
  closeModal,
  showToast,
  hideToast,
  resetApp,
} = appSlice.actions;

export default appSlice.reducer;
