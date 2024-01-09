"use client"
import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import useSession from "../hooks/users/useSession"
import useStoreSession from "../store/useStoreSession"
import Cookies from "js-cookie"
import { useSocket } from "../store/useSocket"

type Props = {
  children: React.ReactNode
}

const AuthGuard = ({ children }: Props) => {
  const { data, isLoading, error } = useSession()
  const router = useRouter()
  const updateStoreSession = useStoreSession((state) => state.update)
  const initSocket = useSocket((store) => store.setInstance)
  useEffect(() => {
    if (error) {
      Cookies.remove("tfl")
      router.replace("/login")
      return
    }
    if (!isLoading && !data?.error && data?.item) {
      initSocket(data.item)
      updateStoreSession(data?.item)
    }
  }, [isLoading, data, updateStoreSession, error])

  if (isLoading) {
    return (
      <div
        className="m-4 animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
  const currentTfl = Cookies.get("tfl")

  if (!data?.item || error || !currentTfl) {
    Cookies.remove("tfl")
    router.replace("/login")
    return
  }
  return children
}

export default AuthGuard
