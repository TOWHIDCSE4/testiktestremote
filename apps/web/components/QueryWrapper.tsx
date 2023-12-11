"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
// import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
// import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import React from "react"

const BUILD_ID = (process.env as any).CONFIG_BUILD_ID
console.log("Current BUILD_ID:", BUILD_ID)

const queryClient = new QueryClient({
  defaultOptions: {},
})

// const persister = createSyncStoragePersister({
//   storage: typeof window === "undefined" ? null : window.localStorage,
// })

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
