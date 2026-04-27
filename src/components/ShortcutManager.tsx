'use client';

import { useState } from 'react';
import { Shortcut } from '@/types/calculator';

interface ShortcutManagerProps {
  shortcuts: Shortcut[];
  onCreateShortcut: (name: string, formula: string) => void;
  onDeleteShortcut: (id: string) => void;
  onExecuteShortcut: (shortcut: Shortcut, value: number) => number;
}

export function ShortcutManager({
  shortcuts,
  onCreateShortcut,
  onDeleteShortcut,
  onExecuteShortcut,
}: ShortcutManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newShortcutName, setNewShortcutName] = useState('');
  const [newShortcutFormula, setNewShortcutFormula] = useState('');
  const [executeValues, setExecuteValues] = useState<{ [key: string]: string }>({});

  const handleCreateShortcut = () => {
    if (newShortcutName.trim() && newShortcutFormula.trim()) {
      onCreateShortcut(newShortcutName.trim(), newShortcutFormula.trim());
      setNewShortcutName('');
      setNewShortcutFormula('');
      setIsCreating(false);
    }
  };

  const handleExecuteShortcut = (shortcut: Shortcut) => {
    const value = parseFloat(executeValues[shortcut.id] || '0');
    if (!isNaN(value)) {
      const result = onExecuteShortcut(shortcut, value);
      // Speak the result if speech synthesis is available
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          `Result: ${result.toFixed(2)}`
        );
        speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Custom Shortcuts</h3>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm"
        >
          {isCreating ? 'Cancel' : 'Create New'}
        </button>
      </div>

      {isCreating && (
        <div className="mb-4 p-3 bg-gray-600 rounded">
          <div className="space-y-3">
            <div>
              <label className="block text-white text-sm mb-1">Shortcut Name</label>
              <input
                type="text"
                value={newShortcutName}
                onChange={(e) => setNewShortcutName(e.target.value)}
                placeholder="e.g., bakery pricing"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-white text-sm mb-1">
                Formula (use 'x' for input value)
              </label>
              <input
                type="text"
                value={newShortcutFormula}
                onChange={(e) => setNewShortcutFormula(e.target.value)}
                placeholder="e.g., x * 1.65"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded"
              />
            </div>
            <button
              onClick={handleCreateShortcut}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded"
            >
              Create Shortcut
            </button>
          </div>
        </div>
      )}

      {shortcuts.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">
          No shortcuts created yet. Create one to get started!
        </p>
      ) : (
        <div className="space-y-3">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.id} className="bg-gray-600 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{shortcut.name}</h4>
                <button
                  onClick={() => onDeleteShortcut(shortcut.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                  aria-label={`Delete ${shortcut.name} shortcut`}
                >
                  Delete
                </button>
              </div>
              <p className="text-gray-300 text-sm mb-3">Formula: {shortcut.formula}</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  value={executeValues[shortcut.id] || ''}
                  onChange={(e) =>
                    setExecuteValues({ ...executeValues, [shortcut.id]: e.target.value })
                  }
                  placeholder="Enter value"
                  className="flex-1 bg-gray-800 text-white px-2 py-1 rounded text-sm"
                />
                <button
                  onClick={() => handleExecuteShortcut(shortcut)}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded text-sm"
                >
                  Calculate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}