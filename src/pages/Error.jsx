import React from 'react'
import { Link } from 'react-router-dom'
import { Gem, ArrowRight } from 'lucide-react'

const Error = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-50">
          <Gem className="h-8 w-8 text-[var(--primary-color)]" />
        </div>

        {/* Content */}
        <div>
          <h1 className="text-3xl font-medium text-gray-900 mb-2">404</h1>
          <p className="text-lg text-gray-600 mb-6">
            We couldn't find the page you're looking for.
          </p>
        </div>

        {/* Action */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent-color)] text-white hover:bg-[var(--primary-color)] transition-colors duration-200"
        >
          Back to Home
          <ArrowRight className="h-4 w-4" />
        </Link>

      </div>
    </div>
  )
}

export default Error