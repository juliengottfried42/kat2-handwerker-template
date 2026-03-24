export interface ChatStep {
  id: string;
  step_order: number;
  question: string;
  options: { label: string; value: string; next_step?: number }[];
  next_step: number | null;
  show_upload: boolean;
  show_calendar: boolean;
}

export interface ChatMessage {
  id: string;
  type: "bot" | "user";
  text: string;
  timestamp: number;
}

export interface ChatState {
  messages: ChatMessage[];
  currentStep: number;
  answers: Record<string, string>;
  photos: string[];
  preferredDate: string | null;
  isComplete: boolean;
  isTyping: boolean;
}

export function getInitialState(): ChatState {
  return {
    messages: [],
    currentStep: 1,
    answers: {},
    photos: [],
    preferredDate: null,
    isComplete: false,
    isTyping: false,
  };
}

export function findStep(steps: ChatStep[], stepOrder: number): ChatStep | undefined {
  return steps.find((s) => s.step_order === stepOrder);
}

export function getNextStepOrder(step: ChatStep, selectedValue?: string): number | null {
  if (selectedValue) {
    const option = step.options.find((o) => o.value === selectedValue);
    if (option?.next_step !== undefined) return option.next_step;
  }
  return step.next_step;
}

export function createBotMessage(text: string): ChatMessage {
  return { id: crypto.randomUUID(), type: "bot", text, timestamp: Date.now() };
}

export function createUserMessage(text: string): ChatMessage {
  return { id: crypto.randomUUID(), type: "user", text, timestamp: Date.now() };
}
