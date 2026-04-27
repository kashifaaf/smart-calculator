'use client'

import { CalculatorHook } from '@/hooks/useCalculator'

interface CalculatorButtonsProps {
  calculator: CalculatorHook
}

export function CalculatorButtons({ calculator }: CalculatorButtonsProps) {
  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ]

  const getButtonClass = (button: string) => {
    if (button === 'C') return 'calculator-button clear'
    if (['÷', '×', '-', '+'].includes(button)) return 'calculator-button operator'
    if (button === '=') return 'calculator-button equals col-span-1'
    return 'calculator-button'
  }

  const handleButtonPress = (button: string) => {
    switch (button) {
      case 'C':
        calculator.clear()
        break
      case '=':
        calculator.calculate()
        break
      case '±':
        calculator.toggleSign()
        break
      case '%':
        calculator.percentage()
        break
      case '÷':
        calculator.inputOperator('/')
        break
      case '×':
        calculator.inputOperator('*')
        break
      case '-':
        calculator.inputOperator('-')
        break
      case '+':
        calculator.inputOperator('+')
        break
      default:
        if (button === '.') {
          calculator.inputDecimal()
        } else {
          calculator.inputNumber(button)
        }
    }
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-4 gap-3">
        {buttons.flat().map((button, index) => (
          <button
            key={`${button}-${index}`}
            onClick={() => handleButtonPress(button)}
            className={`${getButtonClass(button)} ${
              button === '0' ? 'col-span-2' : ''
            }`}
            aria-label={`Button ${button}`}
          >
            {button}
          </button>
        ))}
      </div>
    </div>
  )
}