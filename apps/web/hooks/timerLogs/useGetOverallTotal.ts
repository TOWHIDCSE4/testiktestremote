import {
  API_URL_TIMER_LOGS,
  ONE_DAY,
  REFETCH_ACTIVATED,
  REFETCH_TIME,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse } from "custom-validator"
import Cookies from "js-cookie"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  item: {
    tons: number
    units: number
  }
}

export async function getTotalTonsUnit({
  locationId,
  machineClassId,
}: {
  locationId: string | undefined
  machineClassId: string | undefined
}) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_TIMER_LOGS}/overall-unit-tons?locationId=${locationId}&machineClassId=${machineClassId}`,
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

function useGetOverallTotal({
  locationId,
  machineClassId,
}: {
  locationId: string | undefined
  machineClassId: string | undefined
}) {
  const query = useQuery(
    ["overall-unit-tons", locationId, machineClassId],
    () => getTotalTonsUnit({ locationId, machineClassId }),
    {
      refetchOnWindowFocus: false,
      enabled: !!locationId && !!machineClassId,
      refetchInterval: REFETCH_ACTIVATED ? Number(REFETCH_TIME) : false,
    }
  )
  return query
}
export default useGetOverallTotal
