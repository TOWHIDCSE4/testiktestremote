import {
  API_URL_TIMER,
  SIXTEEN_HOURS,
  TWELVE_HOURS,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_Locations, T_Timer } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_Timer[]
}

export async function getTimerByFactory({
  factoryId,
  machineId,
}: {
  factoryId: string
  machineId: string
}) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_TIMER}/find/filter/factory?factoryId=${factoryId}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return (await res.json()) as T_DBReturn
}

function useTimersByFactory() {
  const [factoryId, setFactoryId] = useState("")
  const [machineId, setMachineId] = useState("")
  const query = useQuery(
    ["timersByFactory", factoryId],
    () => getTimerByFactory({ factoryId, machineId }),
    {
      cacheTime: SIXTEEN_HOURS,
      staleTime: TWELVE_HOURS,
      refetchOnWindowFocus: false,
      enabled: factoryId !== "",
    }
  )
  useEffect(() => {
    if (factoryId) {
      query.refetch()
    }
  }, [factoryId])

  return { ...query, setFactoryId, factoryId, setMachineId, machineId }
}
export default useTimersByFactory
