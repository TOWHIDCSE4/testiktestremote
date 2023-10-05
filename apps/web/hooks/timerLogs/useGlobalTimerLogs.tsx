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
  cityId,
  partId,
  startDateRange,
  endDateRange,
  page,
  sortType,
  keyword,
}: {
  locationId: string
  factoryId: string
  machineId: string
  machineClassId: string
  cityId: string
  partId: string
  startDateRange: string
  endDateRange: string
  page: number
  sortType: string
  keyword: string
}) {
  console.log(startDateRange, endDateRange)
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_TIMER_LOGS}/global?locationId=${locationId}&factoryId=${factoryId}&machineId=${machineId}&machineClassId=${machineClassId}&partId=${partId}&startDate=${startDateRange}&endDate=${endDateRange}&page=${page}&key=${keyword}&sort=${sortType}`,
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
  keyword: string,
  process: boolean
) {
  const [page, setPage] = useState(1)
  const [factoryId, setFactoryId] = useState("")
  const [machineId, setMachineId] = useState("")
  const [machineClassId, setMachineClassId] = useState("")
  const [cityId, setCityId] = useState("")
  const [partId, setPartId] = useState("")
  const [startDateRange, setStartDateRange] = useState("")
  const [endDateRange, setEndDateRange] = useState("")
  // const [process, setProcess] = useState(true)
  const query = useQuery(
    [
      "global-timer-logs",
      locationId,
      factoryId,
      machineId,
      machineClassId,
      page,
      cityId,
      partId,
      startDateRange,
      endDateRange,
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
        cityId,
        partId,
        startDateRange,
        endDateRange,
        sortType,
        keyword,
      }),
    {
      refetchOnWindowFocus: false,
      enabled: !!locationId && !process,
      refetchInterval: REFETCH_ACTIVATED ? 1000 : false,
    }
  )
  useEffect(() => {
    if (page && page > 1) {
      if (process === false) {
        query.refetch()
      }
    }
  }, [
    page,
    locationId,
    factoryId,
    machineId,
    machineClassId,
    cityId,
    partId,
    startDateRange,
    endDateRange,
    process,
  ])
  return {
    ...query,
    page,
    setPage,
    setFactoryId,
    setMachineId,
    setMachineClassId,
    setCityId,
    setPartId,
    setStartDateRange,
    setEndDateRange,
  }
}
export default useGlobalTimerLogs
