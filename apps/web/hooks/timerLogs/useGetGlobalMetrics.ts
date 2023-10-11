import {
  API_URL_GLOBAL_METRICS,
  REFETCH_ACTIVATED,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_TimerLog } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_TimerLog[]
}

export async function getGlobalMatrics({
  locationIds,
  factoryIds,
  machineIds,
  machineClassIds,
  cityIds,
  partIds,
  startDateRanges,
  endDateRanges,
}: {
  locationIds: string[]
  factoryIds: string[]
  machineIds: string[]
  machineClassIds: string[]
  cityIds: string[]
  partIds: string[]
  startDateRanges: string
  endDateRanges: string
}) {
  //   console.log(
  //     "🚀 ~ file: useGetGlobalTimerLogsMultiFilter.ts:36 ~ partId:",
  //     partId
  //   )
  const token = Cookies.get("tfl")

  //@ts-expect-error
  const locationIdQueryString = new URLSearchParams({
    locationId: locationIds,
  }).toString()
  //@ts-expect-error
  const factoryIdQueryString = new URLSearchParams({
    factoryId: factoryIds,
  }).toString()
  //@ts-expect-error
  const machineIdQueryString = new URLSearchParams({
    machineId: machineIds,
  }).toString()
  //@ts-expect-error
  const machineClassIdQueryString = new URLSearchParams({
    machineClassId: machineClassIds,
  }).toString()
  //@ts-expect-error
  const partIdQueryString = new URLSearchParams({ partId: partIds }).toString()
  //   console.log(
  //     "🚀 ~ file: useGetGlobalTimerLogsMultiFilter.ts:57 ~ partIdQueryString:",
  //     partIdQueryString
  //   )
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
    `${API_URL_GLOBAL_METRICS}/get-global-metrics?${locationIdQueryString}&${factoryIdQueryString}&${partIdQueryString}&${machineIdQueryString}&${machineClassIdQueryString}&startDate=${startDateRanges}&endDate=${endDateRanges}`,
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

function useGetGlobalMetrics(locationIds: string[], processes: boolean) {
  const [factoryIds, setFactoryIds] = useState<string[]>([])
  const [machineIds, setMachineIds] = useState<string[]>([])
  const [machineClassIds, setMachineClassIds] = useState<string[]>([])
  const [cityIds, setCityIds] = useState<string[]>([])
  const [partIds, setPartIds] = useState<string[]>([])
  const [startDateRanges, setStartDateRanges] = useState("")
  const [endDateRanges, setEndDateRanges] = useState("")

  const query = useQuery(
    [
      "global-Metrics",
      locationIds,
      factoryIds,
      machineIds,
      machineClassIds,
      cityIds,
      partIds,
      startDateRanges,
      endDateRanges,
    ],
    () =>
      getGlobalMatrics({
        locationIds,
        factoryIds,
        machineIds,
        machineClassIds,
        cityIds,
        partIds,
        startDateRanges,
        endDateRanges,
      }),
    {
      refetchOnWindowFocus: false,
      enabled: !!locationIds.length && !processes,
      refetchInterval: REFETCH_ACTIVATED ? 1000 : false,
    }
  )

  useEffect(() => {
    if (!processes) {
      query.refetch()
    }
  }, [
    locationIds,
    factoryIds,
    machineIds,
    machineClassIds,
    cityIds,
    partIds,
    startDateRanges,
    endDateRanges,
    processes,
  ])

  return {
    ...query,
    setFactoryIds,
    setMachineIds,
    setMachineClassIds,
    setCityIds,
    setPartIds,
    setStartDateRanges,
    setEndDateRanges,
  }
}

export default useGetGlobalMetrics
