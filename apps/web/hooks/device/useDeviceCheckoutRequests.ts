import { T_BackendResponse, T_DeviceHistory } from "custom-validator"
import { API_URL_DEVICE } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_DeviceHistory[]
}

export async function getDeviceCheckoutRequests() {
  const res = await fetch(`${API_URL_DEVICE}/request/out`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
  return (await res.json()) as T_DBReturn
}

export default function useDeviceCheckoutRequests() {
  const query = useQuery(
    ["device-request-out"],
    () => getDeviceCheckoutRequests(),
    {
      // refetchOnWindowFocus: false,
    }
  )
  return query
}
