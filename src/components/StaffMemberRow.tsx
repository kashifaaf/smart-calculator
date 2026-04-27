'use client'

import type { StaffMember } from '@/lib/types'

interface StaffMemberRowProps {
  member: StaffMember
  onUpdate: (updates: Partial<StaffMember>) => void
  onRemove: () => void
}

export function StaffMemberRow({ member, onUpdate, onRemove }: StaffMemberRowProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ name: e.target.value })
  }

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    // Allow only numbers and decimal point
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      onUpdate({ hoursWorked: inputValue })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-3 border border-gray-200 rounded-lg px-4 bg-gray-50">
      <div>
        <input
          type="text"
          value={member.name}
          onChange={handleNameChange}
          placeholder="Staff name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Staff member name"
        />
      </div>
      
      <div>
        <input
          type="text"
          value={member.hoursWorked}
          onChange={handleHoursChange}
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Hours worked"
        />
      </div>
      
      <div>
        <button
          onClick={onRemove}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 w-full md:w-auto"
          aria-label={`Remove ${member.name || 'staff member'}`}
        >
          Remove
        </button>
      </div>
    </div>
  )
}