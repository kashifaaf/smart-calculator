interface DisplayProps {
  value: string
  expression: string
}

export function Display({ value, expression }: DisplayProps) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 text-white">
      <div className="text-right">
        {expression && (
          <div className="text-gray-400 text-sm mb-2 min-h-5">
            {expression}
          </div>
        )}
        <div 
          className="text-3xl font-mono font-light break-all"
          aria-label={`Display showing ${value}`}
        >
          {value || '0'}
        </div>
      </div>
    </div>
  )
}