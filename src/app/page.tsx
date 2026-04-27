import { TipCalculator } from '@/components/TipCalculator'

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Smart Calculator
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Simplify tip splitting for your cafe staff. Enter the total tip amount and staff hours to calculate fair proportional splits.
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <TipCalculator />
      </div>
    </main>
  )
}