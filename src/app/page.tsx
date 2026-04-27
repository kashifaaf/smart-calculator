import { Calculator } from '@/components/Calculator'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 safe-area-top safe-area-bottom">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Calculator</h1>
          <p className="text-gray-600">Voice-enabled calculator with custom shortcuts</p>
        </div>
        <Calculator />
      </div>
    </main>
  )
}