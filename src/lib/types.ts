export interface StaffMember {
  id: string
  name: string
  hoursWorked: string
}

export interface TipResult {
  staffName: string
  hoursWorked: number
  tipAmount: number
}

export interface TipCalculation {
  totalAmount: number
  staffMembers: StaffMember[]
  calculatedSplits: TipResult[]
}