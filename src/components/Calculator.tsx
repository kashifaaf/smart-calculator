'use client';

import { useState, useCallback } from 'react';
import { Display } from './Display';
import { Keypad } from './Keypad';
import { VoiceInput } from './VoiceInput';
import { ShortcutManager } from './ShortcutManager';
import { useCalculator } from '@/hooks/useCalculator';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { useShortcuts } from '@/hooks/useShortcuts';

export function Calculator() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const calculator = useCalculator();
  const shortcuts = useShortcuts();
  const voiceCommands = useVoiceCommands(calculator, shortcuts);

  const handleVoiceResult = useCallback((transcript: string) => {
    voiceCommands.processCommand(transcript);
  }, [voiceCommands]);

  return (
    <div className="max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl p-6">
      <Display 
        value={calculator.display} 
        operation={calculator.operation}
        isLoading={voiceCommands.isProcessing}
      />
      
      <div className="mt-6">
        <VoiceInput 
          onResult={handleVoiceResult}
          isListening={voiceCommands.isListening}
          onToggleListening={voiceCommands.toggleListening}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setShowShortcuts(!showShortcuts)}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          {showShortcuts ? 'Hide' : 'Show'} Shortcuts ({shortcuts.shortcuts.length})
        </button>
      </div>

      {showShortcuts && (
        <div className="mt-4">
          <ShortcutManager 
            shortcuts={shortcuts.shortcuts}
            onCreateShortcut={shortcuts.createShortcut}
            onDeleteShortcut={shortcuts.deleteShortcut}
            onExecuteShortcut={shortcuts.executeShortcut}
          />
        </div>
      )}

      <div className="mt-6">
        <Keypad 
          onNumberClick={calculator.inputNumber}
          onOperatorClick={calculator.inputOperator}
          onEqualsClick={calculator.calculate}
          onClearClick={calculator.clear}
          onDeleteClick={calculator.deleteLast}
        />
      </div>
    </div>
  );
}