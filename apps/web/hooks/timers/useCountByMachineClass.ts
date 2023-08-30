import { API_URL_TIMER, THREE_MINUTES } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "item"> & {
  item: number
}

export async function getMachineLocationCount(
  locationId: string,
  machineClassId: string
) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_TIMER}/count-machine-class?locationId=${locationId}&machineClassId=${machineClassId}`,
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

function useCountByMachineClass() {
  const [locationId, setLocationId] = useState<string>("")
  const [machineClassIds, setMachineClassIds] = useState<string[]>([])

  const query = useQuery(
    ["count-machine-class", locationId, machineClassIds],
    () =>
      Promise.all(
        machineClassIds.map((machineClassId) =>
          getMachineLocationCount(locationId, machineClassId)
        )
      ),
    {
      staleTime: THREE_MINUTES,
      refetchOnWindowFocus: false,
      enabled: !!locationId && machineClassIds.length > 0,
    }
  )

  useEffect(() => {
    if (locationId && machineClassIds.length > 0) {
      query.refetch()
    }
  }, [locationId, machineClassIds])

  return { ...query, setLocationId, setMachineClassIds }
}
export default useCountByMachineClass
