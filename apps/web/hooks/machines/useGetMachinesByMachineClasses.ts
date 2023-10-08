import { API_URL_MACHINE, THREE_MINUTES } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { T_BackendResponse, T_Machine } from "custom-validator"

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

  return (await res.json()) as T_DBReturn
}

function useGetMachinesByMachineClasses(machineClassIds: string[]) {
  const query = useQuery(
    ["machines-by-classes", machineClassIds],
    () => getMachinesByMachineClasses(machineClassIds),
    {
      staleTime: THREE_MINUTES,
      refetchOnWindowFocus: false,
    }
  )

  return query
}

export default useGetMachinesByMachineClasses
