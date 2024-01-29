import { T_BackendResponse, T_DeviceLog } from "custom-validator"
import { API_URL_DEVICE } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_DeviceLog[]
}

export async function getDeviceLogs(id?: string) {
  const res = await fetch(
    id ? `${API_URL_DEVICE}/${id}/logs` : `${API_URL_DEVICE}/logs`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  )
  return (await res.json()) as T_DBReturn
}

export default function useDeviceLogs(id?: string) {
  const query = useQuery(
    id ? ["device-log", id] : ["device-log"],
    () => getDeviceLogs(id),
    {}
  )
  return query
}
