"use client";

import { useState, useRef, useEffect } from "react";
import { Calculator } from "@/components/Calculator";
import { VoiceInput } from "@/components/VoiceInput";
import { ShortcutManager } from "@/components/ShortcutManager";
import { useCalculator } from "@/hooks/useCalculator";
import { useVoice } from "@/hooks/useVoice";
import { useShortcuts } from "@/hooks/useShortcuts";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'shortcuts'>('calculator');
  const calculator = useCalculator();
  const voice = useVoice();
  const shortcuts = useShortcuts();

  const handleVoiceCommand = async (command: string) => {
    try {
      // Check if it's a shortcut creation command
      if (command.toLowerCase().includes('create shortcut')) {
        const nameMatch = command.match(/create shortcut called (.+)/i);
        if (nameMatch) {
          const shortcutName = nameMatch[1].trim();
          voice.speak(`What's the formula for ${shortcutName}?`);
          // Wait for formula input
          const formula = await voice.waitForInput();
          if (formula) {
            const result = await shortcuts.createShortcut(shortcutName, formula);
            if (result.success) {
              voice.speak(`Shortcut ${shortcutName} created successfully`);
            } else {
              voice.speak(`Error creating shortcut: ${result.error}`);
            }
          }
        }
        return;
      }

      // Check if it's a shortcut execution command
      const shortcut = shortcuts.findShortcutByCommand(command);
      if (shortcut) {
        const numberMatch = command.match(/[\d.]+/);
        if (numberMatch) {
          const value = parseFloat(numberMatch[0]);
          const result = shortcuts.executeShortcut(shortcut.id, value);
          if (result.success) {
            voice.speak(`Result is ${result.data}`);
            calculator.setDisplay(result.data.toString());
          } else {
            voice.speak(`Error: ${result.error}`);
          }
        }
        return;
      }

      // Handle basic calculator commands
      const calculation = parseCalculationCommand(command);
      if (calculation) {
        const result = calculator.calculate(calculation);
        voice.speak(`Result is ${result}`);
      } else {
        voice.speak("I didn't understand that command");
      }
    } catch (error) {
      voice.speak("Sorry, there was an error processing your command");
    }
  };

  const parseCalculationCommand = (command: string): string | null => {
    // Convert voice commands to calculator input
    const normalized = command.toLowerCase()
      .replace(/plus|add/g, '+')
      .replace(/minus|subtract/g, '-')
      .replace(/times|multiply/g, '*')
      .replace(/divided by|divide/g, '/')
      .replace(/equals|is/g, '=');
    
    // Extract mathematical expression
    const mathMatch = normalized.match(/([\d+\-*/().\s]+)/);
    return mathMatch ? mathMatch[1].trim() : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white shadow-xl min-h-screen">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4">
          <h1 className="text-xl font-bold text-center">Smart Calculator</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'calculator'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Calculator
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'shortcuts'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Shortcuts ({shortcuts.shortcuts.length})
          </button>
        </div>

        {/* Voice Input */}
        <div className="p-4 border-b bg-gray-50">
          <VoiceInput
            onCommand={handleVoiceCommand}
            isListening={voice.isListening}
            onStartListening={voice.startListening}
            onStopListening={voice.stopListening}
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'calculator' ? (
            <Calculator
              display={calculator.display}
              onInput={calculator.handleInput}
              onClear={calculator.clear}
              onEquals={calculator.equals}
            />
          ) : (
            <ShortcutManager
              shortcuts={shortcuts.shortcuts}
              onCreateShortcut={shortcuts.createShortcut}
              onDeleteShortcut={shortcuts.deleteShortcut}
              onExecuteShortcut={shortcuts.executeShortcut}
            />
          )}
        </div>
      </div>
    </div>
  );
}