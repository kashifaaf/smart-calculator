'use client'

import { StaffMemberRow } from './StaffMemberRow'
import type { StaffMember } from '@/lib/types'

interface StaffListProps {
  staffMembers: StaffMember[]
  onAddStaffMember: () => void
  onUpdateStaffMember: (id: string, updates: Partial<StaffMember>) => void
  onRemoveStaffMember: (id: string) => void
}

export function StaffList({ 
  staffMembers, 
  onAddStaffMember, 
  onUpdateStaffMember, 
  onRemoveStaffMember 
}: StaffListProps) {
  const totalHours = staffMembers.reduce((sum, member) => {
    return sum + (parseFloat(member.hoursWorked) || 0)
  }, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">
          Staff Members
        </h2>
        <button
          onClick={onAddStaffMember}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          aria-label="Add new staff member"
        >
          + Add Staff
        </button>
      </div>

      {staffMembers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">No staff members added yet.</p>
          <p className="text-sm">Click "Add Staff" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-medium text-gray-600 text-sm border-b pb-2">
            <span>Name</span>
            <span>Hours Worked</span>
            <span>Actions</span>
          </div>
          
          {staffMembers.map((member) => (
            <StaffMemberRow
              key={member.id}
              member={member}
              onUpdate={(updates) => onUpdateStaffMember(member.id, updates)}
              onRemove={() => onRemoveStaffMember(member.id)}
            />
          ))}
          
          {totalHours > 0 && (
            <div className="border-t pt-3 mt-4">
              <p className="text-right font-semibold text-gray-700">
                Total Hours: {totalHours.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}