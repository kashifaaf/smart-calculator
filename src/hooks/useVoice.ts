"use client";

import { useState, useCallback, useRef } from "react";

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const resolveRef = useRef<((value: string | null) => void) | null>(null);

  // Initialize speech recognition and synthesis on first use
  const initializeSpeech = useCallback(() => {
    if (typeof window === 'undefined') return false;

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
      }
      setIsSupported(true);
      return true;
    }
    
    setIsSupported(false);
    return false;
  }, []);

  const speak = useCallback((text: string) => {
    if (!speechSynthesisRef.current) {
      initializeSpeech();
    }

    if (speechSynthesisRef.current) {
      // Cancel any ongoing speech
      speechSynthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      speechSynthesisRef.current.speak(utterance);
    }
  }, [initializeSpeech]);

  const startListening = useCallback((onResult?: (result: string) => void) => {
    if (!initializeSpeech()) {
      console.warn('Speech recognition not supported');
      return;
    }

    if (recognitionRef.current && !isListening) {
      setIsListening(true);

      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        console.log('Voice input:', result);
        if (onResult) {
          onResult(result);
        }
        if (resolveRef.current) {
          resolveRef.current(result);
          resolveRef.current = null;
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (resolveRef.current) {
          resolveRef.current(null);
          resolveRef.current = null;
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setIsListening(false);
      }
    }
  }, [isListening, initializeSpeech]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  // Promise-based voice input for sequential operations
  const waitForInput = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      startListening();
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (resolveRef.current) {
          resolveRef.current(null);
          resolveRef.current = null;
          stopListening();
        }
      }, 10000);
    });
  }, [startListening, stopListening]);

  return {
    isListening,
    isSupported,
    speak,
    startListening,
    stopListening,
    waitForInput
  };
}