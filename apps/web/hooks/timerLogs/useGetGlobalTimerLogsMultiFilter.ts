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
  locationId: string[]
  factoryId: string[]
  machineId: string[]
  machineClassId: string[]
  cityId: string[]
  partId: string[]
  startDateRange: string
  endDateRange: string
  page: number
  sortType: string
  keyword: string
}) {
  const token = Cookies.get("tfl")

  //@ts-expect-error
  const locationIdQueryString = new URLSearchParams({
    locationId: locationId,
  }).toString()
  //@ts-expect-error
  const factoryIdQueryString = new URLSearchParams({
    factoryId: factoryId,
  }).toString()
  //@ts-expect-error
  const machineIdQueryString = new URLSearchParams({
    machineId: machineId,
  }).toString()
  //@ts-expect-error
  const machineClassIdQueryString = new URLSearchParams({
    machineClassId: machineClassId,
  }).toString()
  //@ts-expect-error
  const partIdQueryString = new URLSearchParams({ partId: partId }).toString()
  //   locationId.forEach((id) => params.append('locationId', id));
  //   factoryId.forEach((id) => params.append('factoryId', id));
  //   machineId.forEach((id) => params.append('machineId', id));
  //   machineClassId.forEach((id) => params.append('machineClassId', id));
  //   partId.forEach((id) => params.append('partId', id));

  //   params.append('startDate', startDateRange);
  //   params.append('endDate', endDateRange);
  //   params.append('page', page.toString());
  //   params.append('sort', sortType);
  //   params.append('key', keyword);

  const res = await fetch(
    `${API_URL_TIMER_LOGS}/global/multi/filter?${locationIdQueryString}&${factoryIdQueryString}&${partIdQueryString}&${machineIdQueryString}&${machineClassIdQueryString}&startDate=${startDateRange}&endDate=${endDateRange}&page=${page}&sort=${sortType}&key=${keyword}`,
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

function useGlobalTimerLogsMulti(
  locationId: string[],
  sortType: string,
  keyword: string,
  process: boolean
) {
  const [page, setPage] = useState(1)
  const [factoryId, setFactoryId] = useState<string[]>([])
  const [machineId, setMachineId] = useState<string[]>([])
  const [machineClassId, setMachineClassId] = useState<string[]>([])
  const [cityId, setCityId] = useState<string[]>([])
  const [partId, setPartId] = useState<string[]>([])
  const [startDateRange, setStartDateRange] = useState("")
  const [endDateRange, setEndDateRange] = useState("")

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
        cityId,
        partId,
        startDateRange,
        endDateRange,
        page,
        sortType,
        keyword,
      }),
    {
      refetchOnWindowFocus: false,
      enabled: !!locationId.length && !process,
      refetchInterval: REFETCH_ACTIVATED ? 1000 : false,
    }
  )

  useEffect(() => {
    if (page > 1 && !process) {
      query.refetch()
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

export default useGlobalTimerLogsMulti
