'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4">
          Something went wrong!
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          An error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
        >
          Try again
        </button>
      </div>
    </div>
  )
}