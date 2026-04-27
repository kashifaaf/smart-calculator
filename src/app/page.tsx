import { Calculator } from '@/components/Calculator'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Smart Calculator
          </h1>
          <p className="text-gray-600">
            Voice-enabled calculator with custom shortcuts
          </p>
        </div>
        
        <Calculator />
      </div>
    </main>
  )
}