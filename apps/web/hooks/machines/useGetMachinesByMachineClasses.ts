import { API_URL_MACHINE, THREE_MINUTES } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { T_BackendResponse, T_Machine } from "custom-validator"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_Machine[]
}

export async function getMachinesByMachineClasses(machineClassIds: string[]) {
  const token = Cookies.get("tfl")
  //@ts-expect-error
  const queryString = new URLSearchParams({
    machineClasses: machineClassIds,
  }).toString()

  const res = await fetch(
    `${API_URL_MACHINE}/by/machine-classes?${queryString}`,
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

function useGetMachinesByMachineClasses() {
  const [machineClassIds, setMachineClassIds] = useState<Array<string>>()

  const query = useQuery(
    ["machines-by-classes", machineClassIds],
    () => getMachinesByMachineClasses(machineClassIds ?? []),
    {
      staleTime: THREE_MINUTES,
      refetchOnWindowFocus: false,
    }
  )

  useEffect(() => {
    if (machineClassIds) {
      query.refetch()
    }
  }, [machineClassIds])

  return { ...query, setMachineClassIds }
}

export default useGetMachinesByMachineClasses
