'use client';

import { useState, useEffect, useRef } from 'react';

interface VoiceInputProps {
  onResult: (transcript: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
}

export function VoiceInput({ onResult, isListening, onToggleListening }: VoiceInputProps) {
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase().trim();
          onResult(transcript);
        };

        recognition.onend = () => {
          // Recognition ended, update state if needed
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
        };
      }
    }
  }, [onResult]);

  const handleToggleListening = () => {
    if (!recognitionRef.current || !isSupported) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    onToggleListening();
  };

  if (!isSupported) {
    return (
      <div className="text-center">
        <div className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm">
          Voice recognition not supported in this browser
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <button
        onClick={handleToggleListening}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
          isListening
            ? 'bg-red-600 hover:bg-red-500 animate-pulse'
            : 'bg-blue-600 hover:bg-blue-500'
        }`}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>
      <p className="text-gray-300 text-sm mt-2">
        {isListening ? 'Listening...' : 'Tap to speak'}
      </p>
      <p className="text-gray-400 text-xs mt-1">
        Say "create shortcut" or use existing shortcuts
      </p>
    </div>
  );
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}