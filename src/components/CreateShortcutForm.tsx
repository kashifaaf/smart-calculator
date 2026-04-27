'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CalculatorHook } from '@/hooks/useCalculator'
import type { Shortcut } from '@/types/calculator'

interface CreateShortcutFormProps {
  calculator: CalculatorHook
  editingShortcut?: Shortcut | null
  onClose: () => void
}

export function CreateShortcutForm({ 
  calculator, 
  editingShortcut, 
  onClose 
}: CreateShortcutFormProps) {
  const [name, setName] = useState(editingShortcut?.name || '')
  const [formula, setFormula] = useState(editingShortcut?.formula || '')
  const [error, setError] = useState('')

  const validateFormula = (formula: string): boolean => {
    // Check if formula contains 'x' as the variable
    if (!formula.includes('x')) {
      setError('Formula must contain "x" as the variable (e.g., "x * 1.65")')
      return false
    }

    // Basic validation for allowed characters
    const allowedPattern = /^[x0-9+\-*/().\s]+$/
    if (!allowedPattern.test(formula)) {
      setError('Formula can only contain numbers, x, +, -, *, /, (, ), and .')
      return false
    }

    // Test the formula with a sample value
    try {
      const testFormula = formula.replace(/x/g, '1')
      const result = Function(`"use strict"; return (${testFormula})`)()
      if (typeof result !== 'number' || !isFinite(result)) {
        setError('Invalid formula - please check your math expression')
        return false
      }
    } catch {
      setError('Invalid formula - please check your math expression')
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Name is required')
      return
    }

    if (!formula.trim()) {
      setError('Formula is required')
      return
    }

    if (!validateFormula(formula.trim())) {
      return
    }

    // Check for duplicate names (excluding current shortcut when editing)
    const existingShortcut = calculator.shortcuts.find(s => 
      s.name.toLowerCase() === name.trim().toLowerCase() && 
      s.id !== editingShortcut?.id
    )
    if (existingShortcut) {
      setError('A shortcut with this name already exists')
      return
    }

    if (editingShortcut) {
      calculator.updateShortcut(editingShortcut.id, {
        name: name.trim(),
        formula: formula.trim()
      })
    } else {
      calculator.createShortcut(name.trim(), formula.trim())
    }

    onClose()
  }

  const commonFormulas = [
    { label: 'Add 65% markup', formula: 'x * 1.65' },
    { label: 'Add 20% tax', formula: 'x * 1.20' },
    { label: 'Subtract 10% discount', formula: 'x * 0.90' },
    { label: 'Split in half', formula: 'x / 2' },
    { label: 'Triple the value', formula: 'x * 3' },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {editingShortcut ? 'Edit Shortcut' : 'Create New Shortcut'}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close form"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Shortcut Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., bakery pricing, daily split"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="formula" className="block text-sm font-medium text-gray-700 mb-2">
            Formula (use "x" for the input value)
          </label>
          <input
            type="text"
            id="formula"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="e.g., x * 1.65, x / 2, x + 100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use "x" as the variable that will be replaced with the spoken number
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Common Formulas:</p>
          <div className="grid grid-cols-1 gap-2">
            {commonFormulas.map((preset) => (
              <button
                key={preset.formula}
                type="button"
                onClick={() => setFormula(preset.formula)}
                className="text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
              >
                <span className="font-medium">{preset.label}:</span>
                <span className="font-mono ml-2 text-gray-600">{preset.formula}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {editingShortcut ? 'Update Shortcut' : 'Create Shortcut'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}