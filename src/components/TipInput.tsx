'use client'

import { formatCurrency } from '@/lib/utils'

interface TipInputProps {
  value: string
  onChange: (value: string) => void
}

export function TipInput({ value, onChange }: TipInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    // Allow only numbers and decimal point
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      onChange(inputValue)
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor="totalTip" className="block text-lg font-semibold text-gray-700">
        Total Tip Amount
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
          $
        </span>
        <input
          id="totalTip"
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="0.00"
          className="w-full pl-8 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Total tip amount in dollars"
        />
      </div>
      {value && (
        <p className="text-sm text-gray-500">
          Total: {formatCurrency(parseFloat(value) || 0)}
        </p>
      )}
    </div>
  )
}