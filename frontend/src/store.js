import { create } from 'zustand';
import { api } from './api';

export const useStore = create((set, get) => ({
  carState: {
    ac: { is_on: false, temperature: 24.0 },
    tires: { front_left: 2.4, front_right: 2.4, rear_left: 2.4, rear_right: 2.4 },
    lights: { is_on: false },
    doors: { is_locked: true }
  },
  chatHistory: [
    { role: 'agent', content: 'Xin chào, tôi là trợ lý thông minh VinFast. Bạn cần giúp gì về xe không?' }
  ],
  isPolling: false,
  isAgentTyping: false,

  fetchCarState: async () => {
    try {
      const state = await api.getCarState();
      set({ carState: state });
    } catch (e) {
      console.error("Failed to fetch car state", e);
    }
  },

  startPolling: () => {
    if (get().isPolling) return;
    set({ isPolling: true });
    // First load
    get().fetchCarState();
    // Start interval
    setInterval(() => {
      get().fetchCarState();
    }, 2500);
  },

  addMessage: (msg) => set((state) => ({ chatHistory: [...state.chatHistory, msg] })),

  sendMessage: async (message) => {
    get().addMessage({ role: 'user', content: message });
    set({ isAgentTyping: true });
    try {
      const res = await api.chat(message);
      get().addMessage({ role: 'agent', content: res.response });
      // Fetch immediately to reflect fast state changes
      setTimeout(() => get().fetchCarState(), 500);
    } catch (e) {
      get().addMessage({ role: 'agent', content: 'Hệ thống đang lỗi kết nối AI. Vui lòng thử lại sau.' });
    } finally {
      set({ isAgentTyping: false });
    }
  }
}));
