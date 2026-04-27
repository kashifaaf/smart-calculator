export interface Shortcut {
  id: string;
  name: string;
  formula: string;
  createdAt: number;
}

export interface CalculatorState {
  display: string;
  operation: string | null;
  previousValue: number | null;
  waitingForNewValue: boolean;
}