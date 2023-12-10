"use client"
import { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import React from "react"

const BUILD_ID = (process.env as any).CONFIG_BUILD_ID
console.log("Current BUILD_ID:", BUILD_ID)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24,
    },
  },
})

const persister = createSyncStoragePersister({
  storage: typeof window === "undefined" ? null : window.localStorage,
})

type Props = {
  children: React.ReactNode
}

const QueryWrapper = ({ children }: Props) => (
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister, buster: BUILD_ID }}
  >
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
  </PersistQueryClientProvider>
)

export default QueryWrapper
