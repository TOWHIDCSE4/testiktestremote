import { API_URL_TIMER_LOGS, REFETCH_ACTIVATED } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_TimerLog } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_TimerLog[]
}

export async function getGlobalTimerLogs({
  locationId,
  factoryId,
  machineId,
  machineClassId,
  page,
  sortType,
  keyword,
}: {
  locationId: string
  factoryId: string
  machineId: string
  machineClassId: string
  page: number
  sortType: string
  keyword: string
}) {
  const token = Cookies.get("tfl")
  console.log(sortType, keyword)
  const res = await fetch(
    `${API_URL_TIMER_LOGS}/global?locationId=${locationId}&factoryId=${factoryId}&machineId=${machineId}&machineClassId=${machineClassId}&page=${page}&key=${keyword}&sort=${sortType}`,
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

function useGlobalTimerLogs(
  locationId: string,
  sortType: string,
  keyword: string
) {
  const [page, setPage] = useState(1)
  const [factoryId, setFactoryId] = useState("")
  const [machineId, setMachineId] = useState("")
  const [machineClassId, setMachineClassId] = useState("")
  const query = useQuery(
    [
      "global-timer-logs",
      locationId,
      factoryId,
      machineId,
      machineClassId,
      page,
      sortType,
      keyword,
    ],
    () =>
      getGlobalTimerLogs({
        locationId,
        factoryId,
        machineId,
        machineClassId,
        page,
        sortType,
        keyword,
      }),
    {
      refetchOnWindowFocus: false,
      enabled: !!locationId,
      refetchInterval: REFETCH_ACTIVATED ? 1000 : false,
    }
  )
  useEffect(() => {
    if (page && page > 1) {
      query.refetch()
    }
  }, [page, locationId, factoryId, machineId, machineClassId])
  return {
    ...query,
    page,
    setPage,
    setFactoryId,
    setMachineId,
    setMachineClassId,
  }
}
export default useGlobalTimerLogs
