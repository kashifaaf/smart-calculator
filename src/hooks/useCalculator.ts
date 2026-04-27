'use client'

import { useState, useCallback } from 'react'

export function useCalculator() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)

  const clear = useCallback(() => {
    setDisplay('0')
    setExpression('')
    setPreviousValue(null)
    setOperator(null)
    setWaitingForNewValue(false)
  }, [])

  const calculate = useCallback(() => {
    if (previousValue === null || operator === null) return

    const currentValue = parseFloat(display)
    let result: number

    switch (operator) {
      case '+':
        result = previousValue + currentValue
        break
      case '-':
        result = previousValue - currentValue
        break
      case '×':
        result = previousValue * currentValue
        break
      case '÷':
        result = currentValue !== 0 ? previousValue / currentValue : 0
        break
      case '%':
        result = previousValue % currentValue
        break
      default:
        return
    }

    setDisplay(result.toString())
    setExpression(`${previousValue} ${operator} ${currentValue} = ${result}`)
    setPreviousValue(null)
    setOperator(null)
    setWaitingForNewValue(true)
  }, [display, previousValue, operator])

  const handleInput = useCallback((input: string) => {
    if (input === '.') {
      if (display.includes('.')) return
      if (waitingForNewValue) {
        setDisplay('0.')
        setWaitingForNewValue(false)
      } else {
        setDisplay(display + '.')
      }
      return
    }

    if (input === '±') {
      const currentValue = parseFloat(display)
      setDisplay((currentValue * -1).toString())
      return
    }

    if (['+', '-', '×', '÷', '%'].includes(input)) {
      const currentValue = parseFloat(display)
      
      if (previousValue !== null && operator !== null && !waitingForNewValue) {
        calculate()
        setPreviousValue(parseFloat(display))
      } else {
        setPreviousValue(currentValue)
      }
      
      setOperator(input)
      setExpression(`${currentValue} ${input}`)
      setWaitingForNewValue(true)
      return
    }

    // Number input
    if (waitingForNewValue) {
      setDisplay(input)
      setWaitingForNewValue(false)
    } else {
      setDisplay(display === '0' ? input : display + input)
    }
  }, [display, previousValue, operator, waitingForNewValue, calculate])

  const evaluateExpression = useCallback((expr: string): number => {
    // Simple expression evaluator for voice commands
    const cleanExpr = expr
      .toLowerCase()
      .replace(/times|multiply|multiplied by/g, '*')
      .replace(/divided by|divide by/g, '/')
      .replace(/plus/g, '+')
      .replace(/minus/g, '-')
      .replace(/percent/g, '/100')
    
    try {
      // Basic safety check - only allow numbers and operators
      if (!/^[\d\s+\-*/.()]+$/.test(cleanExpr)) {
        throw new Error('Invalid expression')
      }
      
      return Function('"use strict"; return (' + cleanExpr + ')')()
    } catch (error) {
      throw new Error('Could not evaluate expression')
    }
  }, [])

  return {
    display,
    expression,
    handleInput,
    clear,
    calculate,
    setDisplay,
    evaluateExpression
  }
}