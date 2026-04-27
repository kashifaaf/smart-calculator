interface CalculatorDisplayProps {
  value: string
}

export function CalculatorDisplay({ value }: CalculatorDisplayProps) {
  return (
    <div className="bg-gray-900 text-white p-6">
      <div className="text-right">
        <div className="text-3xl font-mono leading-tight break-all">
          {value || '0'}
        </div>
      </div>
    </div>
  )
}