"use client";

import { Button } from "@/components/ui/Button";

interface CalculatorProps {
  display: string;
  onInput: (value: string) => void;
  onClear: () => void;
  onEquals: () => void;
}

export function Calculator({ display, onInput, onClear, onEquals }: CalculatorProps) {
  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  const handleButtonPress = (value: string) => {
    switch (value) {
      case 'C':
        onClear();
        break;
      case '=':
        onEquals();
        break;
      case '±':
        onInput('negate');
        break;
      case '%':
        onInput('%');
        break;
      case '÷':
        onInput('/');
        break;
      case '×':
        onInput('*');
        break;
      default:
        onInput(value);
    }
  };

  const getButtonStyle = (value: string) => {
    if (value === '=') {
      return 'bg-blue-600 hover:bg-blue-700 text-white col-span-2';
    }
    if (['÷', '×', '-', '+'].includes(value)) {
      return 'bg-orange-500 hover:bg-orange-600 text-white';
    }
    if (['C', '±', '%'].includes(value)) {
      return 'bg-gray-300 hover:bg-gray-400 text-black';
    }
    if (value === '0') {
      return 'bg-gray-100 hover:bg-gray-200 text-black col-span-2';
    }
    return 'bg-gray-100 hover:bg-gray-200 text-black';
  };

  return (
    <div className="p-4">
      {/* Display */}
      <div className="bg-black text-white p-4 rounded-lg mb-4">
        <div className="text-right text-3xl font-mono min-h-[50px] flex items-end justify-end">
          {display || '0'}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-3">
        {buttons.map((row, rowIndex) =>
          row.map((button, colIndex) => (
            <Button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleButtonPress(button)}
              className={`h-16 text-xl font-semibold rounded-xl transition-colors ${getButtonStyle(button)}`}
              aria-label={button === '×' ? 'multiply' : button === '÷' ? 'divide' : button}
            >
              {button}
            </Button>
          ))
        )}
      </div>
    </div>
  );
}