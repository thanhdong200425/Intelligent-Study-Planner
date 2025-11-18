import { CustomViewData } from '@/components/tasks/AddCustomViewModal';

export interface SavedCustomView extends CustomViewData {
  id: string;
  createdAt: string;
}

const STORAGE_KEY = 'studygo_custom_views';

export const CustomViewsStorage = {
  /**
   * Get all saved custom views from localStorage
   */
  getAll: (): SavedCustomView[] => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }
      return JSON.parse(stored) as SavedCustomView[];
    } catch (error) {
      console.error('Error reading custom views from localStorage:', error);
      return [];
    }
  },

  /**
   * Save a new custom view to localStorage
   */
  save: (viewData: CustomViewData): SavedCustomView => {
    if (typeof window === 'undefined') {
      throw new Error('localStorage is not available');
    }

    const views = CustomViewsStorage.getAll();
    const newView: SavedCustomView = {
      ...viewData,
      id: `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    const updatedViews = [...views, newView];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedViews));

    return newView;
  },

  /**
   * Delete a custom view by ID
   */
  delete: (id: string): void => {
    if (typeof window === 'undefined') {
      return;
    }

    const views = CustomViewsStorage.getAll();
    const filteredViews = views.filter(view => view.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredViews));
  },

  /**
   * Get a custom view by ID
   */
  getById: (id: string): SavedCustomView | undefined => {
    const views = CustomViewsStorage.getAll();
    return views.find(view => view.id === id);
  },

  /**
   * Clear all custom views
   */
  clear: (): void => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
  },
};
