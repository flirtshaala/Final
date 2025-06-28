// Mock AsyncStorage for web compatibility
const mockStorage: { [key: string]: string } = {};

export default {
  getItem: async (key: string): Promise<string | null> => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return mockStorage[key] || null;
  },
  
  setItem: async (key: string, value: string): Promise<void> => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    } else {
      mockStorage[key] = value;
    }
  },
  
  removeItem: async (key: string): Promise<void> => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    } else {
      delete mockStorage[key];
    }
  },
  
  clear: async (): Promise<void> => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    } else {
      Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    }
  },
  
  getAllKeys: async (): Promise<string[]> => {
    if (typeof window !== 'undefined') {
      return Object.keys(localStorage);
    }
    return Object.keys(mockStorage);
  },
};