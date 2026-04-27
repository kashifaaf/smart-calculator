"use client";

import { useState, useCallback } from "react";

export function useCalculator() {
  const [display, setDisplay] = useState('');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = useCallback((num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay('');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, []);

  const performOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display || '0');

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result: number;

      switch (operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '*':
          result = currentValue * inputValue;
          break;
        case '/':
          result = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        default:
          return;
      }

      setDisplay(result.toString());
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  }, [display, previousValue, operation]);

  const calculate = useCallback((expression?: string) => {
    if (expression) {
      try {
        // Simple expression evaluation for voice commands
        const result = Function('"use strict"; return (' + expression + ')')();
        setDisplay(result.toString());
        return result;
      } catch (error) {
        setDisplay('Error');
        return 0;
      }
    } else {
      performOperation('=');
    }
  }, [performOperation]);

  const handleInput = useCallback((value: string) => {
    if (/\d/.test(value)) {
      inputNumber(value);
    } else if (value === '.') {
      inputDecimal();
    } else if (['+', '-', '*', '/'].includes(value)) {
      performOperation(value);
    } else if (value === 'negate') {
      const currentValue = parseFloat(display || '0');
      setDisplay((-currentValue).toString());
    } else if (value === '%') {
      const currentValue = parseFloat(display || '0');
      setDisplay((currentValue / 100).toString());
    }
  }, [inputNumber, inputDecimal, performOperation, display]);

  const equals = useCallback(() => {
    calculate();
  }, [calculate]);

  return {
    display,
    setDisplay,
    handleInput,
    clear,
    equals,
    calculate
  };
}