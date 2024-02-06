import { T_BackendResponse, T_DeviceHistory } from "custom-validator"
import { API_URL_DEVICE } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_DeviceHistory[]
}

export async function getDeviceCheckinRequests() {
  const res = await fetch(`${API_URL_DEVICE}/request/in`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
  return (await res.json()) as T_DBReturn
}

export default function useDeviceCheckinRequests() {
  const query = useQuery(
    ["device-request-in"],
    () => getDeviceCheckinRequests(),
    {
      // refetchOnWindowFocus: false,
    }
  )
  return query
}
