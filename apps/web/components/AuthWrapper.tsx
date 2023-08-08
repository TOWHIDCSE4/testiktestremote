"use client"
import React from "react"
import { useRouter } from "next/navigation"
import useSession from "../hooks/users/useSession"
import useStoreSession from "../store/useStoreSession"

type Props = {
  children: React.ReactNode
}

const AuthWrapper = ({ children }: Props) => {
  const { data, isLoading } = useSession()
  const router = useRouter()
  const updateStoreSession = useStoreSession((state) => state.update)
  if (!isLoading && data.error) {
    router.push("/")
  } else if (isLoading) {
    return (
      <div
        className="m-4 animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    )
  } else {
    updateStoreSession(data)
    return <>{children}</>
  }
}

export default AuthWrapper
