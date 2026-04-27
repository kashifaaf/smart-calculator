'use client'

import { useState, useEffect, useCallback } from 'react'
import { Shortcut } from '@/types/shortcut'

export function useShortcuts() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([])

  useEffect(() => {
    // Load shortcuts from localStorage
    const saved = localStorage.getItem('calculator-shortcuts')
    if (saved) {
      try {
        setShortcuts(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to parse saved shortcuts:', error)
      }
    }
  }, [])

  const saveShortcuts = useCallback((newShortcuts: Shortcut[]) => {
    setShortcuts(newShortcuts)
    localStorage.setItem('calculator-shortcuts', JSON.stringify(newShortcuts))
  }, [])

  const addShortcut = useCallback((shortcut: Omit<Shortcut, 'id' | 'createdAt'>) => {
    const newShortcut: Shortcut = {
      ...shortcut,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    const newShortcuts = [...shortcuts, newShortcut]
    saveShortcuts(newShortcuts)
    return newShortcut
  }, [shortcuts, saveShortcuts])

  const deleteShortcut = useCallback((id: string) => {
    const newShortcuts = shortcuts.filter(s => s.id !== id)
    saveShortcuts(newShortcuts)
  }, [shortcuts, saveShortcuts])

  const findByName = useCallback((name: string): Shortcut | undefined => {
    return shortcuts.find(s => 
      s.name.toLowerCase() === name.toLowerCase() ||
      s.name.toLowerCase().includes(name.toLowerCase())
    )
  }, [shortcuts])

  const executeShortcut = useCallback((id: string, params: string): number => {
    const shortcut = shortcuts.find(s => s.id === id)
    if (!shortcut) {
      throw new Error('Shortcut not found')
    }

    try {
      // Replace 'x' with the parameter value
      const formula = shortcut.formula.replace(/x/g, params)
      
      // Basic safety check
      if (!/^[\d\s+\-*/.()]+$/.test(formula)) {
        throw new Error('Invalid formula')
      }
      
      const result = Function('"use strict"; return (' + formula + ')')()
      
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Invalid calculation result')
      }
      
      return result
    } catch (error) {
      throw new Error('Could not execute shortcut')
    }
  }, [shortcuts])

  return {
    shortcuts,
    addShortcut,
    deleteShortcut,
    findByName,
    executeShortcut
  }
}