"use client"

import * as Sentry from "@sentry/nextjs"
import Error from "next/error"
import { useEffect } from "react"
import "./globals.css"
import ErrorPage from "../components/shared/ErrorPage"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <ErrorPage reset={reset} />
      </body>
    </html>
  )
}
