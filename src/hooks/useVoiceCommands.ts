'use client';

import { useState, useCallback } from 'react';
import { useCalculator } from './useCalculator';
import { useShortcuts } from './useShortcuts';

export function useVoiceCommands(
  calculator: ReturnType<typeof useCalculator>,
  shortcuts: ReturnType<typeof useShortcuts>
) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [awaitingShortcutDetails, setAwaitingShortcutDetails] = useState<{
    name: string;
    step: 'formula';
  } | null>(null);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  }, []);

  const processCommand = useCallback(async (transcript: string) => {
    setIsProcessing(true);
    const command = transcript.toLowerCase().trim();

    try {
      // Handle shortcut creation flow
      if (awaitingShortcutDetails) {
        if (awaitingShortcutDetails.step === 'formula') {
          // Convert spoken formula to math notation
          let formula = command
            .replace(/times|multiplied by/g, '*')
            .replace(/plus/g, '+')
            .replace(/minus/g, '-')
            .replace(/divided by/g, '/')
            .replace(/point/g, '.');

          shortcuts.createShortcut(awaitingShortcutDetails.name, formula);
          speak(`Shortcut ${awaitingShortcutDetails.name} created with formula ${formula}`);
          setAwaitingShortcutDetails(null);
          setIsProcessing(false);
          return;
        }
      }

      // Create shortcut command
      if (command.startsWith('create shortcut')) {
        const nameMatch = command.match(/create shortcut (?:called )?(.+)/);
        if (nameMatch) {
          const shortcutName = nameMatch[1].trim();
          setAwaitingShortcutDetails({ name: shortcutName, step: 'formula' });
          speak(`Creating shortcut ${shortcutName}. Please say the formula using x as the variable.`);
        } else {
          speak('Please specify a name for the shortcut. Say "create shortcut called" followed by the name.');
        }
        setIsProcessing(false);
        return;
      }

      // Execute shortcut command
      const shortcutMatch = command.match(/^(.+?)\s+(\d+(?:\.\d+)?)$/);
      if (shortcutMatch) {
        const shortcutName = shortcutMatch[1].trim();
        const value = parseFloat(shortcutMatch[2]);
        
        const shortcut = shortcuts.findShortcut(shortcutName);
        if (shortcut) {
          const result = shortcuts.executeShortcut(shortcut, value);
          calculator.setDisplayValue(result.toString());
          speak(`${shortcutName} result: ${result.toFixed(2)}`);
          setIsProcessing(false);
          return;
        }
      }

      // Basic calculator operations
      if (command.includes('plus') || command.includes('add')) {
        const numbers = extractNumbers(command);
        if (numbers.length >= 2) {
          const result = numbers.reduce((sum, num) => sum + num, 0);
          calculator.setDisplayValue(result.toString());
          speak(`Result: ${result}`);
        }
      } else if (command.includes('minus') || command.includes('subtract')) {
        const numbers = extractNumbers(command);
        if (numbers.length >= 2) {
          const result = numbers.reduce((diff, num, index) => index === 0 ? num : diff - num);
          calculator.setDisplayValue(result.toString());
          speak(`Result: ${result}`);
        }
      } else if (command.includes('times') || command.includes('multiply')) {
        const numbers = extractNumbers(command);
        if (numbers.length >= 2) {
          const result = numbers.reduce((product, num) => product * num, 1);
          calculator.setDisplayValue(result.toString());
          speak(`Result: ${result}`);
        }
      } else if (command.includes('divided by') || command.includes('divide')) {
        const numbers = extractNumbers(command);
        if (numbers.length >= 2) {
          const result = numbers.reduce((quotient, num, index) => 
            index === 0 ? num : quotient / num
          );
          calculator.setDisplayValue(result.toString());
          speak(`Result: ${result.toFixed(2)}`);
        }
      } else if (command === 'clear') {
        calculator.clear();
        speak('Calculator cleared');
      } else {
        // Try to parse as a number
        const number = parseFloat(command.replace(/[^\d.-]/g, ''));
        if (!isNaN(number)) {
          calculator.setDisplayValue(number.toString());
          speak(`Set to ${number}`);
        } else {
          speak('Command not recognized. Try saying create shortcut, a calculation, or use an existing shortcut.');
        }
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      speak('Sorry, there was an error processing your command.');
    }

    setIsProcessing(false);
  }, [calculator, shortcuts, awaitingShortcutDetails, speak]);

  const toggleListening = useCallback(() => {
    setIsListening((prev) => !prev);
  }, []);

  return {
    isListening,
    isProcessing,
    processCommand,
    toggleListening,
  };
}

function extractNumbers(text: string): number[] {
  const numbers: number[] = [];
  const numberWords: { [key: string]: number } = {
    zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10
  };

  // Extract written numbers and digits
  const words = text.toLowerCase().split(/\s+/);
  
  for (const word of words) {
    // Check for written numbers
    if (numberWords[word] !== undefined) {
      numbers.push(numberWords[word]);
    } else {
      // Check for digit sequences
      const match = word.match(/\d+(?:\.\d+)?/);
      if (match) {
        numbers.push(parseFloat(match[0]));
      }
    }
  }

  return numbers;
}