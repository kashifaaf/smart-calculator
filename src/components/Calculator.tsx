'use client'

import { useState, useEffect } from 'react'
import { Display } from './Display'
import { Keypad } from './Keypad'
import { VoiceButton } from './VoiceButton'
import { ShortcutManager } from './ShortcutManager'
import { useCalculator } from '@/hooks/useCalculator'
import { useVoice } from '@/hooks/useVoice'
import { useShortcuts } from '@/hooks/useShortcuts'

export function Calculator() {
  const [showShortcuts, setShowShortcuts] = useState(false)
  const calculator = useCalculator()
  const shortcuts = useShortcuts()
  const voice = useVoice({
    onCommand: (command) => handleVoiceCommand(command),
    onResult: (result) => calculator.setDisplay(result)
  })

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase().trim()
    
    // Check for shortcut creation
    if (lowerCommand.includes('create shortcut')) {
      const nameMatch = lowerCommand.match(/create shortcut (?:called )?(.*?)(?:\s|$)/)
      if (nameMatch && nameMatch[1]) {
        voice.startShortcutCreation(nameMatch[1])
        return
      }
    }
    
    // Check for shortcut execution
    const shortcut = shortcuts.findByName(lowerCommand.split(' ')[0])
    if (shortcut) {
      const params = lowerCommand.split(' ').slice(1).join(' ')
      try {
        const result = shortcuts.executeShortcut(shortcut.id, params)
        calculator.setDisplay(result.toString())
        voice.speak(`Result is ${result}`)
      } catch (error) {
        voice.speak('Error executing shortcut')
      }
      return
    }
    
    // Handle basic calculations
    try {
      const result = calculator.evaluateExpression(command)
      calculator.setDisplay(result.toString())
      voice.speak(`Result is ${result}`)
    } catch (error) {
      voice.speak('Could not calculate that')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 space-y-6">
        <Display 
          value={calculator.display}
          expression={calculator.expression}
        />
        
        <div className="flex gap-4">
          <VoiceButton
            isListening={voice.isListening}
            isSupported={voice.isSupported}
            onToggle={voice.toggleListening}
          />
          
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors"
            aria-label="Toggle shortcuts"
          >
            {showShortcuts ? 'Hide' : 'Show'} Shortcuts
          </button>
        </div>

        {voice.isCreatingShortcut && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-800 font-medium">Creating shortcut: {voice.shortcutName}</p>
            <p className="text-blue-600 text-sm mt-1">
              Say the formula (e.g., "ingredient cost times 1.65")
            </p>
          </div>
        )}

        {showShortcuts ? (
          <ShortcutManager 
            shortcuts={shortcuts.shortcuts}
            onDelete={shortcuts.deleteShortcut}
            onExecute={(id, params) => {
              try {
                const result = shortcuts.executeShortcut(id, params)
                calculator.setDisplay(result.toString())
              } catch (error) {
                console.error('Error executing shortcut:', error)
              }
            }}
          />
        ) : (
          <Keypad
            onButtonPress={calculator.handleInput}
            onClear={calculator.clear}
            onEquals={calculator.calculate}
          />
        )}
      </div>
    </div>
  )
}