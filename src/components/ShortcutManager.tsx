'use client'

import { useState } from 'react'
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
import { CalculatorHook } from '@/hooks/useCalculator'
import { CreateShortcutForm } from './CreateShortcutForm'
import type { Shortcut } from '@/types/calculator'

interface ShortcutManagerProps {
  calculator: CalculatorHook
}

export function ShortcutManager({ calculator }: ShortcutManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingShortcut, setEditingShortcut] = useState<Shortcut | null>(null)
  const [testValues, setTestValues] = useState<Record<string, string>>({})

  const handleTestShortcut = (shortcut: Shortcut) => {
    const value = testValues[shortcut.id]
    if (value) {
      const result = calculator.executeShortcut(shortcut.id, parseFloat(value))
      if (result !== null) {
        calculator.setDisplay(result.toString())
      }
    }
  }

  const handleDeleteShortcut = (id: string) => {
    if (confirm('Are you sure you want to delete this shortcut?')) {
      calculator.deleteShortcut(id)
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Custom Shortcuts
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          New Shortcut
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <CreateShortcutForm
            calculator={calculator}
            editingShortcut={editingShortcut}
            onClose={() => {
              setShowCreateForm(false)
              setEditingShortcut(null)
            }}
          />
        </div>
      )}

      <div className="space-y-4">
        {calculator.shortcuts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No shortcuts created yet</p>
            <p className="text-sm text-gray-400">
              Create shortcuts for calculations you do frequently
            </p>
          </div>
        ) : (
          calculator.shortcuts.map((shortcut) => (
            <div key={shortcut.id} className="shortcut-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900 capitalize">
                    {shortcut.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-mono">
                    {shortcut.formula}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingShortcut(shortcut)
                      setShowCreateForm(true)
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    aria-label="Edit shortcut"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteShortcut(shortcut.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    aria-label="Delete shortcut"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Enter value"
                  value={testValues[shortcut.id] || ''}
                  onChange={(e) => setTestValues(prev => ({
                    ...prev,
                    [shortcut.id]: e.target.value
                  }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleTestShortcut(shortcut)}
                  disabled={!testValues[shortcut.id]}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Calculate
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {calculator.shortcuts.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Voice Commands</h3>
          <div className="space-y-1 text-sm text-blue-700">
            {calculator.shortcuts.map(shortcut => (
              <div key={shortcut.id}>
                "
                <span className="font-mono capitalize">{shortcut.name}</span>
                {' '}[number]"
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}