import { Calculator } from '@/components/Calculator';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Smart Calculator</h1>
          <p className="text-gray-300">Voice-enabled calculator with custom shortcuts</p>
        </div>
        <Calculator />
      </div>
    </main>
  );
}