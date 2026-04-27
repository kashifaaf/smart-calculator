'use client'

import { useState } from 'react'
import { Shortcut } from '@/types/shortcut'

interface ShortcutManagerProps {
  shortcuts: Shortcut[]
  onDelete: (id: string) => void
  onExecute: (id: string, params: string) => void
}

export function ShortcutManager({ shortcuts, onDelete, onExecute }: ShortcutManagerProps) {
  const [executingId, setExecutingId] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')

  const handleExecute = (shortcut: Shortcut) => {
    if (!inputValue.trim()) return
    
    setExecutingId(shortcut.id)
    onExecute(shortcut.id, inputValue)
    setInputValue('')
    
    setTimeout(() => setExecutingId(null), 500)
  }

  if (shortcuts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Shortcuts Yet</h3>
        <p className="text-gray-600 mb-4">Create shortcuts using voice commands</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <p className="text-blue-800 font-medium mb-2">Try saying:</p>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>"Create shortcut called bakery pricing"</li>
            <li>"Create shortcut daily split"</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Your Shortcuts</h3>
      
      <div className="space-y-3">
        {shortcuts.map((shortcut) => (
          <div key={shortcut.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 capitalize">{shortcut.name}</h4>
                <p className="text-sm text-gray-600 mt-1">Formula: {shortcut.formula}</p>
              </div>
              <button
                onClick={() => onDelete(shortcut.id)}
                className="ml-2 p-1 text-red-500 hover:text-red-700 transition-colors"
                aria-label={`Delete ${shortcut.name} shortcut`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <div className="flex gap-2">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label={`Input value for ${shortcut.name}`}
              />
              <button
                onClick={() => handleExecute(shortcut)}
                disabled={!inputValue.trim() || executingId === shortcut.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  executingId === shortcut.id
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300 disabled:text-gray-500'
                }`}
                aria-label={`Execute ${shortcut.name} shortcut`}
              >
                {executingId === shortcut.id ? '✓' : 'Calculate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}