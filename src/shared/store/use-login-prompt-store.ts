"use client";

import { create } from "zustand";

type LoginPromptState = {
  open: boolean;
  message: string | null;
};

type LoginPromptActions = {
  prompt: (message?: string) => void;
  dismiss: () => void;
};

const DEFAULT_MESSAGE = "로그인이 필요한 기능입니다.";

export const useLoginPromptStore = create<LoginPromptState & LoginPromptActions>(
  (set) => ({
    open: false,
    message: null,
    prompt: (message) =>
      set({ open: true, message: message ?? DEFAULT_MESSAGE }),
    dismiss: () => set({ open: false, message: null })
  })
);
