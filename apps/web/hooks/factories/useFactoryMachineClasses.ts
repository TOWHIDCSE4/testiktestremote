import {
  API_URL_FACTORIES,
  ONE_DAY,
  THREE_MINUTES,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

export async function getAllFactories(selectedFactoryId: string) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_FACTORIES}/machine-classes/${selectedFactoryId}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return await res.json()
}

function useFactoryMachineClasses() {
  const [selectedFactoryId, setSelectedFactoryId] = useState("")
  const query = useQuery(
    ["machineClasses", selectedFactoryId],
    () => getAllFactories(selectedFactoryId),
    {
      staleTime: THREE_MINUTES,
      refetchOnWindowFocus: false,
      enabled: selectedFactoryId !== "",
    }
  )
  useEffect(() => {
    if (selectedFactoryId !== "") {
      query.refetch()
    }
  }, [selectedFactoryId])

  return { ...query, setSelectedFactoryId, selectedFactoryId }
}
export default useFactoryMachineClasses
