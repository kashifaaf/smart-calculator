'use client'

import { formatCurrency } from '@/lib/utils'
import type { TipResult } from '@/lib/types'

interface TipResultsProps {
  results: TipResult[]
}

export function TipResults({ results }: TipResultsProps) {
  const totalTipAmount = results.reduce((sum, result) => sum + result.tipAmount, 0)
  const totalHours = results.reduce((sum, result) => sum + result.hoursWorked, 0)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Tip Split Results</h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <span className="font-medium">Total Amount:</span> {formatCurrency(totalTipAmount)}
          </div>
          <div>
            <span className="font-medium">Total Hours:</span> {totalHours.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-medium text-gray-600 text-sm border-b pb-2">
          <span>Name</span>
          <span>Hours Worked</span>
          <span>Share %</span>
          <span>Tip Amount</span>
        </div>
        
        {results.map((result) => {
          const sharePercentage = totalHours > 0 ? (result.hoursWorked / totalHours) * 100 : 0
          
          return (
            <div 
              key={result.staffName}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center py-3 px-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="font-medium text-gray-800">
                {result.staffName}
              </div>
              <div className="text-gray-600">
                {result.hoursWorked.toFixed(2)} hrs
              </div>
              <div className="text-gray-600">
                {sharePercentage.toFixed(1)}%
              </div>
              <div className="font-semibold text-green-700 text-lg">
                {formatCurrency(result.tipAmount)}
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">
          💡 <strong>Tip:</strong> Each staff member's share is calculated proportionally based on hours worked. 
          Staff who worked more hours receive a larger portion of the total tip.
        </p>
      </div>
    </div>
  )
}