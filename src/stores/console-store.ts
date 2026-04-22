import { create } from 'zustand';
import type { ConsoleMessage, RoutingMode } from '@/types/dashboard';

interface ConsoleState {
  messages: ConsoleMessage[];
  currentModel: string;
  routingMode: RoutingMode;
  temperature: number;
  maxTokens: number;
  topP: number;
  systemPrompt: string;
  isStreaming: boolean;
  setModel: (model: string) => void;
  setRoutingMode: (mode: RoutingMode) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
  setTopP: (topP: number) => void;
  setSystemPrompt: (prompt: string) => void;
  addMessage: (message: ConsoleMessage) => void;
  clearMessages: () => void;
  setStreaming: (streaming: boolean) => void;
}

export const useConsoleStore = create<ConsoleState>()((set) => ({
  messages: [],
  currentModel: 'gpt-4.1',
  routingMode: 'auto',
  temperature: 1,
  maxTokens: 4096,
  topP: 1,
  systemPrompt: '',
  isStreaming: false,

  setModel: (model) => set({ currentModel: model }),
  setRoutingMode: (mode) => set({ routingMode: mode }),
  setTemperature: (temp) => set({ temperature: temp }),
  setMaxTokens: (tokens) => set({ maxTokens: tokens }),
  setTopP: (topP) => set({ topP }),
  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  setStreaming: (streaming) => set({ isStreaming: streaming }),
}));
