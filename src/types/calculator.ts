export interface Shortcut {
  id: string
  name: string
  formula: string
  createdAt: number
}

export interface CalculationResult {
  value: number
  expression: string
}

export type CalculatorOperation = '+' | '-' | '*' | '/'