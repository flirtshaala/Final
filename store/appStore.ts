import { create } from 'zustand';

interface AppState {
  responses: Array<{
    id: string;
    originalText: string;
    response: string;
    type: 'flirty' | 'witty' | 'savage';
    timestamp: number;
    imageUri?: string;
  }>;
  addResponse: (response: any) => void;
  clearResponses: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  responses: [],
  addResponse: (response) =>
    set((state) => ({
      responses: [response, ...state.responses],
    })),
  clearResponses: () => set({ responses: [] }),
}));