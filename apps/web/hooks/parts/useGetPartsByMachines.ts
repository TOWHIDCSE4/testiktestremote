import { API_URL_PARTS, THREE_MINUTES } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { T_BackendResponse, T_Machine } from "custom-validator"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_Machine[]
}

export async function getPartsByMachineClasses(
  locationsIds: string[],
  machineClassIds: string[]
) {
  const token = Cookies.get("tfl")
  //@ts-expect-error
  const locationsQuery = new URLSearchParams({
    locations: locationsIds,
  }).toString()
  //@ts-expect-error
  const machineClassesQuery = new URLSearchParams({
    machineClasses: machineClassIds,
  }).toString()

  const res = await fetch(
    `${API_URL_PARTS}/by/location-machine-class?${machineClassesQuery}&${locationsQuery}&search=''`,
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

function useGetPartsByMachineClasses(
  locationsIds: string[],
  machineClassIds: string[]
) {
  console.log(locationsIds)
  const query = useQuery(
    ["machines-by-classes", machineClassIds],
    () => getPartsByMachineClasses(locationsIds, machineClassIds),
    {
      staleTime: THREE_MINUTES,
      refetchOnWindowFocus: false,
    }
  )

  return query
}

export default useGetPartsByMachineClasses
