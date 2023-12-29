"use client"

import React from "react"

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

const Error: React.FC<Props> = ({ error, reset }) => {
  React.useEffect(() => console.error(error), [error])
  return (
    <div className="w-full h-80 bg-red-600 text-white flex items-center justify-center">
      <h1>Something went wong ... Check Your Brouser Console.</h1>
      <button onClick={reset}>Try Again</button>
    </div>
  )
}

export default Error
