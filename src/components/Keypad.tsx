interface KeypadProps {
  onButtonPress: (value: string) => void
  onClear: () => void
  onEquals: () => void
}

export function Keypad({ onButtonPress, onClear, onEquals }: KeypadProps) {
  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '', '.', '=']
  ]

  const getButtonClass = (button: string) => {
    const base = 'h-16 rounded-xl font-medium text-lg transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
    
    if (button === 'C') {
      return `${base} bg-red-500 hover:bg-red-600 text-white`
    }
    if (['±', '%'].includes(button)) {
      return `${base} bg-gray-200 hover:bg-gray-300 text-gray-800`
    }
    if (['÷', '×', '-', '+', '='].includes(button)) {
      return `${base} bg-blue-500 hover:bg-blue-600 text-white`
    }
    if (button === '0') {
      return `${base} bg-gray-100 hover:bg-gray-200 text-gray-800 col-span-2`
    }
    if (button === '') {
      return `${base} invisible`
    }
    return `${base} bg-gray-100 hover:bg-gray-200 text-gray-800`
  }

  const handleClick = (button: string) => {
    if (button === 'C') {
      onClear()
    } else if (button === '=') {
      onEquals()
    } else if (button !== '') {
      onButtonPress(button)
    }
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {buttons.flat().map((button, index) => (
        <button
          key={index}
          onClick={() => handleClick(button)}
          className={getButtonClass(button)}
          disabled={button === ''}
          aria-label={button === '±' ? 'Plus minus' : button === '×' ? 'Multiply' : button === '÷' ? 'Divide' : button}
        >
          {button}
        </button>
      ))}
    </div>
  )
}