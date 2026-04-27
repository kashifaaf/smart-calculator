"use client";

import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface VoiceInputProps {
  onCommand: (command: string) => void;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
}

export function VoiceInput({
  onCommand,
  isListening,
  onStartListening,
  onStopListening
}: VoiceInputProps) {
  const handleToggleListening = () => {
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  return (
    <div className="text-center">
      <Button
        onClick={handleToggleListening}
        className={`w-16 h-16 rounded-full transition-all duration-200 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white shadow-lg`}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? (
          <MicOff size={24} />
        ) : (
          <Mic size={24} />
        )}
      </Button>
      <p className="mt-2 text-sm text-gray-600">
        {isListening ? 'Listening...' : 'Tap to speak'}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Say "create shortcut called [name]" or "[shortcut name], [number]"
      </p>
    </div>
  );
}