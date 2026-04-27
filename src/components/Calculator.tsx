'use client'

import { useState } from 'react'
import { CalculatorDisplay } from './CalculatorDisplay'
import { CalculatorButtons } from './CalculatorButtons'
import { VoiceInput } from './VoiceInput'
import { ShortcutManager } from './ShortcutManager'
import { useCalculator } from '@/hooks/useCalculator'

export function Calculator() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'shortcuts'>('calculator')
  const calculator = useCalculator()

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex bg-gray-100">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
            activeTab === 'calculator'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Calculator
        </button>
        <button
          onClick={() => setActiveTab('shortcuts')}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
            activeTab === 'shortcuts'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Shortcuts
        </button>
      </div>

      {/* Content */}
      {activeTab === 'calculator' ? (
        <>
          <CalculatorDisplay value={calculator.display} />
          <VoiceInput calculator={calculator} />
          <CalculatorButtons calculator={calculator} />
        </>
      ) : (
        <ShortcutManager calculator={calculator} />
      )}
    </div>
  )
}