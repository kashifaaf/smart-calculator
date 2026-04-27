import type { StaffMember, TipResult } from './types'

export function calculateTipSplits(totalTip: number, staffMembers: StaffMember[]): TipResult[] {
  // Calculate total hours worked by all staff
  const totalHours = staffMembers.reduce((sum, member) => {
    const hours = parseFloat(member.hoursWorked) || 0
    return sum + hours
  }, 0)

  // Prevent division by zero
  if (totalHours === 0) {
    throw new Error('Total hours worked cannot be zero')
  }

  // Calculate proportional tip for each staff member
  const results: TipResult[] = staffMembers.map(member => {
    const hoursWorked = parseFloat(member.hoursWorked) || 0
    const proportion = hoursWorked / totalHours
    const tipAmount = totalTip * proportion

    return {
      staffName: member.name.trim(),
      hoursWorked,
      tipAmount: Math.round(tipAmount * 100) / 100 // Round to 2 decimal places
    }
  })

  // Ensure the sum equals the original total (handle rounding discrepancies)
  const calculatedTotal = results.reduce((sum, result) => sum + result.tipAmount, 0)
  const difference = totalTip - calculatedTotal

  // If there's a small rounding difference, adjust the largest tip amount
  if (Math.abs(difference) > 0 && Math.abs(difference) < 0.01) {
    const largestTipIndex = results.reduce((maxIndex, result, index) => 
      result.tipAmount > results[maxIndex].tipAmount ? index : maxIndex, 0
    )
    results[largestTipIndex].tipAmount += difference
    results[largestTipIndex].tipAmount = Math.round(results[largestTipIndex].tipAmount * 100) / 100
  }

  return results
}

export function validateTipCalculation(totalTip: number, staffMembers: StaffMember[]): string | null {
  if (totalTip <= 0) {
    return 'Total tip must be greater than zero'
  }

  if (staffMembers.length === 0) {
    return 'At least one staff member is required'
  }

  for (const member of staffMembers) {
    if (!member.name.trim()) {
      return 'All staff members must have a name'
    }
    
    const hours = parseFloat(member.hoursWorked)
    if (isNaN(hours) || hours <= 0) {
      return 'All staff members must have valid hours worked (greater than 0)'
    }
  }

  return null
}