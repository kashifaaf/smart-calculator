'use client';

import { useState, useEffect } from 'react';
import { Shortcut } from '@/types/calculator';

export function useShortcuts() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

  // Load shortcuts from localStorage on mount
  useEffect(() => {
    const savedShortcuts = localStorage.getItem('calculator-shortcuts');
    if (savedShortcuts) {
      try {
        setShortcuts(JSON.parse(savedShortcuts));
      } catch (error) {
        console.error('Error loading shortcuts:', error);
      }
    }
  }, []);

  // Save shortcuts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calculator-shortcuts', JSON.stringify(shortcuts));
  }, [shortcuts]);

  const createShortcut = (name: string, formula: string) => {
    const newShortcut: Shortcut = {
      id: Date.now().toString(),
      name,
      formula,
      createdAt: Date.now(),
    };

    setShortcuts((prev) => [...prev, newShortcut]);
    
    // Announce creation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`Shortcut ${name} created successfully`);
      speechSynthesis.speak(utterance);
    }
  };

  const deleteShortcut = (id: string) => {
    setShortcuts((prev) => prev.filter((shortcut) => shortcut.id !== id));
  };

  const findShortcut = (name: string): Shortcut | undefined => {
    return shortcuts.find((shortcut) => 
      shortcut.name.toLowerCase().includes(name.toLowerCase())
    );
  };

  const executeShortcut = (shortcut: Shortcut, value: number): number => {
    try {
      // Replace 'x' with the actual value in the formula
      const formula = shortcut.formula.toLowerCase().replace(/x/g, value.toString());
      
      // Basic formula evaluation (supports +, -, *, /)
      // For security and simplicity, we'll use a simple parser instead of eval
      const result = evaluateFormula(formula);
      return result;
    } catch (error) {
      console.error('Error executing shortcut:', error);
      return value;
    }
  };

  return {
    shortcuts,
    createShortcut,
    deleteShortcut,
    findShortcut,
    executeShortcut,
  };
}

function evaluateFormula(formula: string): number {
  // Simple formula evaluator that supports basic operations
  // This is a simplified version - in production, you'd want a more robust parser
  try {
    // Remove spaces and validate characters
    const cleanFormula = formula.replace(/\s/g, '');
    
    // Only allow numbers, operators, and decimal points
    if (!/^[\d+\-*/.()]+$/.test(cleanFormula)) {
      throw new Error('Invalid characters in formula');
    }

    // Use Function constructor for safer evaluation than eval
    return new Function('return ' + cleanFormula)();
  } catch (error) {
    console.error('Formula evaluation error:', error);
    throw error;
  }
}