import { API_URL_MACHINE, THREE_MINUTES } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_Machine } from "custom-validator"
import Cookies from "js-cookie"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_Machine[]
}

export async function getMachinesByMachineClassLocation(locationId: string) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_MACHINE}/by-location?locationId=${locationId}`,
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

function useGetMachinesByLocation(locationId: string) {
  const query = useQuery(
    ["machines-location", locationId],
    () => getMachinesByMachineClassLocation(locationId),
    {
      staleTime: THREE_MINUTES,
      refetchOnWindowFocus: false,
      enabled: locationId !== "",
    }
  )

  return { ...query }
}
export default useGetMachinesByLocation
