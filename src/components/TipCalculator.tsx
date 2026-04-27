'use client'

import { useState } from 'react'
import { TipInput } from './TipInput'
import { StaffList } from './StaffList'
import { TipResults } from './TipResults'
import { calculateTipSplits } from '@/lib/calculations'
import type { StaffMember, TipResult } from '@/lib/types'

export function TipCalculator() {
  const [totalTip, setTotalTip] = useState<string>('')
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [results, setResults] = useState<TipResult[]>([])
  const [error, setError] = useState<string>('')

  const handleCalculate = () => {
    try {
      setError('')
      
      if (!totalTip || parseFloat(totalTip) <= 0) {
        setError('Please enter a valid tip amount')
        return
      }

      if (staffMembers.length === 0) {
        setError('Please add at least one staff member')
        return
      }

      const invalidStaff = staffMembers.find(member => 
        !member.name.trim() || !member.hoursWorked || parseFloat(member.hoursWorked) <= 0
      )

      if (invalidStaff) {
        setError('All staff members must have a name and valid hours worked')
        return
      }

      const calculatedResults = calculateTipSplits(parseFloat(totalTip), staffMembers)
      setResults(calculatedResults)
    } catch (err) {
      setError('An error occurred while calculating tips')
      console.error(err)
    }
  }

  const handleClear = () => {
    setTotalTip('')
    setStaffMembers([])
    setResults([])
    setError('')
  }

  const addStaffMember = () => {
    const newMember: StaffMember = {
      id: crypto.randomUUID(),
      name: '',
      hoursWorked: ''
    }
    setStaffMembers([...staffMembers, newMember])
  }

  const updateStaffMember = (id: string, updates: Partial<StaffMember>) => {
    setStaffMembers(prev => 
      prev.map(member => 
        member.id === id ? { ...member, ...updates } : member
      )
    )
  }

  const removeStaffMember = (id: string) => {
    setStaffMembers(prev => prev.filter(member => member.id !== id))
    setResults([]) // Clear results when staff changes
  }

  return (
    <div className="space-y-8">
      <TipInput 
        value={totalTip} 
        onChange={setTotalTip} 
      />
      
      <StaffList
        staffMembers={staffMembers}
        onAddStaffMember={addStaffMember}
        onUpdateStaffMember={updateStaffMember}
        onRemoveStaffMember={removeStaffMember}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md" role="alert">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <button
          onClick={handleCalculate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!totalTip || staffMembers.length === 0}
        >
          Calculate Tips
        </button>
        
        <button
          onClick={handleClear}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Clear All
        </button>
      </div>

      {results.length > 0 && <TipResults results={results} />}
    </div>
  )
}