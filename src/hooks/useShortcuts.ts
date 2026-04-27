"use client";

import { useState, useEffect, useCallback } from "react";
import { type Shortcut } from "@/types/shortcut";
import { type ActionResult } from "@/types/common";

export function useShortcuts() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

  // Load shortcuts from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('calculator-shortcuts');
        if (stored) {
          const parsed = JSON.parse(stored);
          setShortcuts(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('Failed to load shortcuts:', error);
      }
    }
  }, []);

  // Save shortcuts to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('calculator-shortcuts', JSON.stringify(shortcuts));
      } catch (error) {
        console.error('Failed to save shortcuts:', error);
      }
    }
  }, [shortcuts]);

  const createShortcut = useCallback(async (name: string, formula: string): Promise<ActionResult<Shortcut>> => {
    try {
      // Validate formula by trying to parse it
      const testFormula = formula.toLowerCase().replace(/x/g, '1');
      try {
        Function('"use strict"; return (' + testFormula + ')')();
      } catch {
        return { success: false, error: 'Invalid formula. Use x as the variable and basic operators (+, -, *, /)' };
      }

      // Check for duplicate names
      if (shortcuts.some(s => s.name.toLowerCase() === name.toLowerCase())) {
        return { success: false, error: 'A shortcut with this name already exists' };
      }

      const newShortcut: Shortcut = {
        id: crypto.randomUUID(),
        name,
        formula,
        createdAt: Date.now()
      };

      setShortcuts(prev => [...prev, newShortcut]);
      return { success: true, data: newShortcut };
    } catch (error) {
      return { success: false, error: 'Failed to create shortcut' };
    }
  }, [shortcuts]);

  const deleteShortcut = useCallback((id: string): ActionResult<void> => {
    try {
      setShortcuts(prev => prev.filter(s => s.id !== id));
      return { success: true, data: undefined };
    } catch (error) {
      return { success: false, error: 'Failed to delete shortcut' };
    }
  }, []);

  const executeShortcut = useCallback((id: string, value: number): ActionResult<number> => {
    try {
      const shortcut = shortcuts.find(s => s.id === id);
      if (!shortcut) {
        return { success: false, error: 'Shortcut not found' };
      }

      // Replace x with the actual value and evaluate
      const expression = shortcut.formula.toLowerCase().replace(/x/g, value.toString());
      
      try {
        const result = Function('"use strict"; return (' + expression + ')')();
        
        if (typeof result !== 'number' || !isFinite(result)) {
          return { success: false, error: 'Formula produced invalid result' };
        }
        
        return { success: true, data: result };
      } catch {
        return { success: false, error: 'Error evaluating formula' };
      }
    } catch (error) {
      return { success: false, error: 'Failed to execute shortcut' };
    }
  }, [shortcuts]);

  const findShortcutByCommand = useCallback((command: string): Shortcut | null => {
    const lowerCommand = command.toLowerCase();
    return shortcuts.find(shortcut => 
      lowerCommand.includes(shortcut.name.toLowerCase())
    ) || null;
  }, [shortcuts]);

  return {
    shortcuts,
    createShortcut,
    deleteShortcut,
    executeShortcut,
    findShortcutByCommand
  };
}