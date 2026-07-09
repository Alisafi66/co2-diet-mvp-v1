// app/page.tsx
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--rcn-bg)] p-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full space-y-8">
        
        {/* Branding mapping to the mockup */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-[var(--rcn-green)] flex items-center justify-center gap-2">
            @ CO₂Diet
          </h1>
          <p className="text-[var(--rcn-text)] text-lg mt-4">
            Track calories. Understand your CO₂ impact. Build healthier habits.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--rcn-muted)] mt-2">
             <span>🔒 Private. Offline-first. No ads.</span>
          </div>
        </div>

        {/* Action Buttons mapping to the mockup */}
        <div className="w-full space-y-4 pt-12">
          <Link
            href="/onboarding"
            className="block w-full py-4 px-4 bg-[var(--rcn-green)] text-white text-center rounded-xl font-semibold hover:bg-[var(--rcn-green-dark)] transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="block w-full py-4 px-4 bg-white text-[var(--rcn-text)] text-center rounded-xl font-semibold border border-[var(--rcn-border)] hover:bg-gray-50 transition-colors"
          >
            Use Without Account
          </Link>
          
          <div className="text-center mt-6">
             <Link href="#" className="text-xs text-[var(--rcn-muted)] underline">
               Learn more about privacy &gt;
             </Link>
          </div>
        </div>

      </div>
    </div>
  );
}