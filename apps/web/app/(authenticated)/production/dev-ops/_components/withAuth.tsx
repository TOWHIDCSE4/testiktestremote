"use client"

import React from "react"
import useStoreSession from "../../../../../store/useStoreSession"
import AuthGuard from "../../../../../components/AuthGuard"

interface Props {
  children: React.ReactNode
}

const WithAuth: React.FC<Props> = ({ children }) => {
  const role = useStoreSession((state) => state.role)

  if (role !== "Administrator") {
    return (
      <div className="mt-28">
        <h2 className="text-center">Not authorized to access this page.</h2>
      </div>
    )
  }

  return <AuthGuard>{children}</AuthGuard>
}

export default WithAuth
