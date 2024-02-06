import { T_BackendResponse, T_Device } from "custom-validator"
import { API_URL_DEVICE } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_Device[]
}

export async function getAllDevices() {
  const res = await fetch(`${API_URL_DEVICE}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
  return (await res.json()) as T_DBReturn
}

export default function useDevices() {
  const query = useQuery(["devices"], () => getAllDevices(), {
    // refetchOnWindowFocus: false,
  })
  return query
}
