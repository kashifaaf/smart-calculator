'use client'

import { useState, useEffect } from 'react'
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid'
import { CalculatorHook } from '@/hooks/useCalculator'
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition'

interface VoiceInputProps {
  calculator: CalculatorHook
}

export function VoiceInput({ calculator }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const voiceRecognition = useVoiceRecognition()

  useEffect(() => {
    if (voiceRecognition.isSupported && voiceRecognition.transcript) {
      setTranscript(voiceRecognition.transcript)
      processVoiceCommand(voiceRecognition.transcript)
    }
  }, [voiceRecognition.transcript])

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase().trim()
    
    // Check for shortcut creation
    if (lowerCommand.includes('create shortcut')) {
      const name = extractShortcutName(lowerCommand)
      if (name) {
        calculator.startShortcutCreation(name)
        speak(`Creating shortcut ${name}. What's the formula?`)
        return
      }
    }

    // Check for shortcut execution
    const shortcut = calculator.shortcuts.find(s => 
      lowerCommand.includes(s.name.toLowerCase())
    )
    if (shortcut) {
      const number = extractNumber(lowerCommand)
      if (number !== null) {
        const result = calculator.executeShortcut(shortcut.id, number)
        speak(`Result: ${result}`)
        return
      }
    }

    // Process basic calculations
    processBasicCalculation(lowerCommand)
  }

  const extractShortcutName = (command: string): string | null => {
    const match = command.match(/create shortcut (?:called )?(.+)/i)
    return match ? match[1].trim() : null
  }

  const extractNumber = (command: string): number | null => {
    const numbers = command.match(/\d+(?:\.\d+)?/g)
    return numbers ? parseFloat(numbers[numbers.length - 1]) : null
  }

  const processBasicCalculation = (command: string) => {
    // Replace spoken operators with symbols
    const normalizedCommand = command
      .replace(/\bplus\b|\badd\b/g, '+')
      .replace(/\bminus\b|\bsubtract\b/g, '-')
      .replace(/\btimes\b|\bmultiply\b|\bmultiplied by\b/g, '*')
      .replace(/\bdivided? by\b|\bover\b/g, '/')
      .replace(/\bequals?\b|\bis\b/g, '=')

    // Extract mathematical expression
    const mathExpression = normalizedCommand.match(/[\d+\-*/().= ]+/g)?.[0]
    if (mathExpression) {
      try {
        calculator.clear()
        calculator.inputExpression(mathExpression.replace(/=/g, '').trim())
        calculator.calculate()
        speak(`Result: ${calculator.display}`)
      } catch (error) {
        speak('Sorry, I couldn\'t calculate that.')
      }
    }
  }

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      speechSynthesis.speak(utterance)
    }
  }

  const toggleListening = () => {
    if (isListening) {
      voiceRecognition.stop()
      setIsListening(false)
    } else {
      voiceRecognition.start()
      setIsListening(true)
    }
  }

  if (!voiceRecognition.isSupported) {
    return (
      <div className="p-4 bg-yellow-50 border-b border-yellow-200">
        <p className="text-yellow-800 text-sm text-center">
          Voice recognition is not supported in your browser
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-blue-50 border-b border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-blue-900">Voice Commands</h3>
        <button
          onClick={toggleListening}
          className={`p-2 rounded-full transition-all duration-200 ${
            isListening 
              ? 'bg-red-600 text-white voice-recording' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? (
            <StopIcon className="w-5 h-5" />
          ) : (
            <MicrophoneIcon className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {transcript && (
        <div className="text-sm text-blue-800 bg-blue-100 rounded-lg p-2">
          "{transcript}"
        </div>
      )}
      
      <div className="text-xs text-blue-700 mt-2">
        Try: "5 plus 3", "Create shortcut bakery pricing", or "Bakery pricing 10"
      </div>
    </div>
  )
}