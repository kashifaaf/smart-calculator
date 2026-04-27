'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

interface UseVoiceOptions {
  onCommand: (command: string) => void
  onResult: (result: string) => void
}

export function useVoice({ onCommand, onResult }: UseVoiceOptions) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [isCreatingShortcut, setIsCreatingShortcut] = useState(false)
  const [shortcutName, setShortcutName] = useState('')
  const recognitionRef = useRef<any>(null)
  const synth = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'
    }

    // Check for speech synthesis support
    if ('speechSynthesis' in window) {
      synth.current = window.speechSynthesis
    }
  }, [])

  const speak = useCallback((text: string) => {
    if (!synth.current) return
    
    synth.current.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8
    synth.current.speak(utterance)
  }, [])

  const startShortcutCreation = useCallback((name: string) => {
    setIsCreatingShortcut(true)
    setShortcutName(name)
    speak(`Creating shortcut ${name}. Please say the formula.`)
  }, [speak])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }, [])

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return

    setIsListening(true)
    
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      
      if (isCreatingShortcut && shortcutName) {
        // Handle shortcut formula definition
        try {
          const formula = transcript
            .toLowerCase()
            .replace(/times|multiply|multiplied by/g, '* ')
            .replace(/divided by|divide by/g, '/ ')
            .replace(/plus/g, '+ ')
            .replace(/minus/g, '- ')
            .replace(/ingredient cost|cost|x/g, 'x')
            .trim()
          
          // Save shortcut to localStorage
          const shortcuts = JSON.parse(localStorage.getItem('calculator-shortcuts') || '[]')
          const newShortcut = {
            id: Date.now().toString(),
            name: shortcutName,
            formula: formula,
            createdAt: new Date().toISOString()
          }
          shortcuts.push(newShortcut)
          localStorage.setItem('calculator-shortcuts', JSON.stringify(shortcuts))
          
          speak(`Shortcut ${shortcutName} created successfully`)
          setIsCreatingShortcut(false)
          setShortcutName('')
        } catch (error) {
          speak('Could not create shortcut. Please try again.')
        }
      } else {
        onCommand(transcript)
      }
      
      setIsListening(false)
    }

    recognitionRef.current.onerror = () => {
      setIsListening(false)
      speak('Could not understand. Please try again.')
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current.start()
  }, [isSupported, onCommand, isCreatingShortcut, shortcutName, speak])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return {
    isListening,
    isSupported,
    isCreatingShortcut,
    shortcutName,
    toggleListening,
    speak,
    startShortcutCreation
  }
}