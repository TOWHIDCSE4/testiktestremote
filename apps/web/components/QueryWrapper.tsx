"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import React from "react"

const queryClient = new QueryClient()

type Props = {
  children: React.ReactNode
}

const QueryWrapper = ({ children }: Props) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)

export default QueryWrapper
