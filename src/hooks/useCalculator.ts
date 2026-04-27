'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Shortcut } from '@/types/calculator'

export interface CalculatorHook {
  display: string
  shortcuts: Shortcut[]
  isCreatingShortcut: boolean
  pendingShortcutName: string | null
  clear: () => void
  inputNumber: (num: string) => void
  inputOperator: (op: string) => void
  inputDecimal: () => void
  inputExpression: (expression: string) => void
  calculate: () => void
  toggleSign: () => void
  percentage: () => void
  setDisplay: (value: string) => void
  createShortcut: (name: string, formula: string) => void
  updateShortcut: (id: string, updates: Partial<Shortcut>) => void
  deleteShortcut: (id: string) => void
  executeShortcut: (id: string, value: number) => number | null
  startShortcutCreation: (name: string) => void
}

export function useCalculator(): CalculatorHook {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([])
  const [isCreatingShortcut, setIsCreatingShortcut] = useState(false)
  const [pendingShortcutName, setPendingShortcutName] = useState<string | null>(null)

  // Load shortcuts from localStorage on mount
  useEffect(() => {
    try {
      const savedShortcuts = localStorage.getItem('calculator-shortcuts')
      if (savedShortcuts) {
        setShortcuts(JSON.parse(savedShortcuts))
      }
    } catch (error) {
      console.error('Failed to load shortcuts:', error)
    }
  }, [])

  // Save shortcuts to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('calculator-shortcuts', JSON.stringify(shortcuts))
    } catch (error) {
      console.error('Failed to save shortcuts:', error)
    }
  }, [shortcuts])

  const clear = useCallback(() => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }, [])

  const inputNumber = useCallback((num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }, [display, waitingForOperand])

  const inputOperator = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = performCalculation(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }, [display, previousValue, operation])

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }, [display, waitingForOperand])

  const inputExpression = useCallback((expression: string) => {
    setDisplay(expression)
    setWaitingForOperand(false)
  }, [])

  const calculate = useCallback(() => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = performCalculation(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }, [display, previousValue, operation])

  const toggleSign = useCallback(() => {
    if (display !== '0') {
      setDisplay(display.charAt(0) === '-' ? display.slice(1) : '-' + display)
    }
  }, [display])

  const percentage = useCallback(() => {
    const value = parseFloat(display)
    setDisplay(String(value / 100))
  }, [display])

  const performCalculation = (firstOperand: number, secondOperand: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstOperand + secondOperand
      case '-':
        return firstOperand - secondOperand
      case '*':
        return firstOperand * secondOperand
      case '/':
        return firstOperand / secondOperand
      default:
        return secondOperand
    }
  }

  const createShortcut = useCallback((name: string, formula: string) => {
    const newShortcut: Shortcut = {
      id: crypto.randomUUID(),
      name,
      formula,
      createdAt: Date.now()
    }
    setShortcuts(prev => [...prev, newShortcut])
    setIsCreatingShortcut(false)
    setPendingShortcutName(null)
  }, [])

  const updateShortcut = useCallback((id: string, updates: Partial<Shortcut>) => {
    setShortcuts(prev => prev.map(shortcut => 
      shortcut.id === id ? { ...shortcut, ...updates } : shortcut
    ))
  }, [])

  const deleteShortcut = useCallback((id: string) => {
    setShortcuts(prev => prev.filter(shortcut => shortcut.id !== id))
  }, [])

  const executeShortcut = useCallback((id: string, value: number): number | null => {
    const shortcut = shortcuts.find(s => s.id === id)
    if (!shortcut) return null

    try {
      // Replace 'x' with the actual value and evaluate
      const formula = shortcut.formula.replace(/x/g, String(value))
      const result = Function(`"use strict"; return (${formula})`)()
      
      if (typeof result === 'number' && isFinite(result)) {
        return Math.round(result * 100) / 100 // Round to 2 decimal places
      }
      return null
    } catch (error) {
      console.error('Error executing shortcut:', error)
      return null
    }
  }, [shortcuts])

  const startShortcutCreation = useCallback((name: string) => {
    setIsCreatingShortcut(true)
    setPendingShortcutName(name)
  }, [])

  return {
    display,
    shortcuts,
    isCreatingShortcut,
    pendingShortcutName,
    clear,
    inputNumber,
    inputOperator,
    inputDecimal,
    inputExpression,
    calculate,
    toggleSign,
    percentage,
    setDisplay,
    createShortcut,
    updateShortcut,
    deleteShortcut,
    executeShortcut,
    startShortcutCreation
  }
}