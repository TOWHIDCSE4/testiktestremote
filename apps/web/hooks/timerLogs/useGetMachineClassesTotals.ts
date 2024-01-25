import {
    API_URL_TIMER_LOGS,
    REFETCH_ACTIVATED,
    REFETCH_TIME,
  } from "../../helpers/constants"
  import { useQuery } from "@tanstack/react-query"
  import { T_BackendResponse } from "custom-validator"
  import Cookies from "js-cookie"
  import { useEffect, useState } from "react"
  
  type T_DBReturn = Omit<T_BackendResponse, "items"> & {
    item: {
      tons: number
      units: number
    }
  }
  
  export async function getMachineClassesTotals({
    locationId,
    machineClassId,
  }: {
    locationId: string | undefined
    machineClassId: string | undefined
  }) {
    const token = Cookies.get("tfl")
    const res = await fetch(
      `${API_URL_TIMER_LOGS}/machine-classes-totals?locationId=${locationId}&machineClassIds=${machineClassId}`,
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
  
  function useGetMachineClassesTotals({
    locationId,
  }: {
    locationId: string | undefined
  }) {
    const [machineClassId, setMachineClassId] = useState<Array<string>>([])
    const query = useQuery(
      ["overall-unit-tons", locationId, machineClassId],
      () =>
        getMachineClassesTotals({
          locationId,
          machineClassId: machineClassId.join(",").toString(),
        }),
      {
        refetchOnWindowFocus: false,
        enabled: !!locationId && !!machineClassId,
        refetchInterval: REFETCH_ACTIVATED ? Number(REFETCH_TIME) : false,
      }
    )
    useEffect(() => {
      if (machineClassId) {
        query.refetch()
      }
    }, [machineClassId])
    return {
      ...query,
      setMachineClassId,
    }
  }
  export default useGetMachineClassesTotals