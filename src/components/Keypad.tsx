interface KeypadProps {
  onNumberClick: (number: string) => void;
  onOperatorClick: (operator: string) => void;
  onEqualsClick: () => void;
  onClearClick: () => void;
  onDeleteClick: () => void;
}

export function Keypad({
  onNumberClick,
  onOperatorClick,
  onEqualsClick,
  onClearClick,
  onDeleteClick,
}: KeypadProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Row 1 */}
      <button onClick={onClearClick} className="calculator-button bg-red-600 hover:bg-red-500">
        C
      </button>
      <button onClick={onDeleteClick} className="calculator-button">
        ⌫
      </button>
      <button onClick={() => onOperatorClick('/')} className="calculator-button-operator">
        ÷
      </button>
      <button onClick={() => onOperatorClick('*')} className="calculator-button-operator">
        ×
      </button>

      {/* Row 2 */}
      <button onClick={() => onNumberClick('7')} className="calculator-button">
        7
      </button>
      <button onClick={() => onNumberClick('8')} className="calculator-button">
        8
      </button>
      <button onClick={() => onNumberClick('9')} className="calculator-button">
        9
      </button>
      <button onClick={() => onOperatorClick('-')} className="calculator-button-operator">
        -
      </button>

      {/* Row 3 */}
      <button onClick={() => onNumberClick('4')} className="calculator-button">
        4
      </button>
      <button onClick={() => onNumberClick('5')} className="calculator-button">
        5
      </button>
      <button onClick={() => onNumberClick('6')} className="calculator-button">
        6
      </button>
      <button onClick={() => onOperatorClick('+')} className="calculator-button-operator">
        +
      </button>

      {/* Row 4 */}
      <button onClick={() => onNumberClick('1')} className="calculator-button">
        1
      </button>
      <button onClick={() => onNumberClick('2')} className="calculator-button">
        2
      </button>
      <button onClick={() => onNumberClick('3')} className="calculator-button">
        3
      </button>
      <button onClick={onEqualsClick} className="calculator-button-equals row-span-2">
        =
      </button>

      {/* Row 5 */}
      <button onClick={() => onNumberClick('0')} className="calculator-button col-span-2">
        0
      </button>
      <button onClick={() => onNumberClick('.')} className="calculator-button">
        .
      </button>
    </div>
  );
}