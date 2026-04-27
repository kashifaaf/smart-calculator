"use client";

import { useState } from "react";
import { Plus, Trash2, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { type Shortcut } from "@/types/shortcut";
import { type ActionResult } from "@/types/common";

interface ShortcutManagerProps {
  shortcuts: Shortcut[];
  onCreateShortcut: (name: string, formula: string) => Promise<ActionResult<Shortcut>>;
  onDeleteShortcut: (id: string) => ActionResult<void>;
  onExecuteShortcut: (id: string, value: number) => ActionResult<number>;
}

export function ShortcutManager({
  shortcuts,
  onCreateShortcut,
  onDeleteShortcut,
  onExecuteShortcut
}: ShortcutManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newFormula, setNewFormula] = useState('');
  const [executionValues, setExecutionValues] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, number>>({});
  const [error, setError] = useState<string>('');

  const handleCreateShortcut = async () => {
    if (!newName.trim() || !newFormula.trim()) {
      setError('Name and formula are required');
      return;
    }

    try {
      const result = await onCreateShortcut(newName.trim(), newFormula.trim());
      if (result.success) {
        setNewName('');
        setNewFormula('');
        setIsCreating(false);
        setError('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to create shortcut');
    }
  };

  const handleDeleteShortcut = (id: string) => {
    const result = onDeleteShortcut(id);
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleExecuteShortcut = (id: string) => {
    const value = parseFloat(executionValues[id] || '0');
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }

    const result = onExecuteShortcut(id, value);
    if (result.success) {
      setResults({ ...results, [id]: result.data });
      setError('');
    } else {
      setError(result.error);
    }
  };

  const handleValueChange = (id: string, value: string) => {
    setExecutionValues({ ...executionValues, [id]: value });
    // Clear result when value changes
    if (results[id] !== undefined) {
      const newResults = { ...results };
      delete newResults[id];
      setResults(newResults);
    }
  };

  return (
    <div className="p-4">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Create New Shortcut */}
      <div className="mb-6">
        {!isCreating ? (
          <Button
            onClick={() => setIsCreating(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Create New Shortcut
          </Button>
        ) : (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-3">Create New Shortcut</h3>
            <div className="space-y-3">
              <Input
                placeholder="Shortcut name (e.g., 'bakery pricing')"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full"
              />
              <Input
                placeholder="Formula (e.g., 'x * 1.65' where x is the input)"
                value={newFormula}
                onChange={(e) => setNewFormula(e.target.value)}
                className="w-full"
              />
              <div className="text-xs text-gray-600">
                Use 'x' as the variable in your formula. Supported operators: +, -, *, /
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateShortcut}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Create
                </Button>
                <Button
                  onClick={() => {
                    setIsCreating(false);
                    setNewName('');
                    setNewFormula('');
                    setError('');
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-black"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shortcuts List */}
      <div className="space-y-4">
        {shortcuts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No shortcuts created yet</p>
            <p className="text-sm mt-1">Create one above or use voice commands</p>
          </div>
        ) : (
          shortcuts.map((shortcut) => (
            <div key={shortcut.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-lg">{shortcut.name}</h3>
                  <p className="text-sm text-gray-600">Formula: {shortcut.formula}</p>
                </div>
                <Button
                  onClick={() => handleDeleteShortcut(shortcut.id)}
                  className="bg-red-100 hover:bg-red-200 text-red-600 p-2"
                  aria-label="Delete shortcut"
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              {/* Execution Section */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Input value:</label>
                  <Input
                    type="number"
                    placeholder="Enter number"
                    value={executionValues[shortcut.id] || ''}
                    onChange={(e) => handleValueChange(shortcut.id, e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button
                  onClick={() => handleExecuteShortcut(shortcut.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3"
                  aria-label="Execute shortcut"
                >
                  <Play size={16} />
                </Button>
              </div>

              {/* Result */}
              {results[shortcut.id] !== undefined && (
                <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg">
                  <span className="font-medium text-green-800">
                    Result: {results[shortcut.id]}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}