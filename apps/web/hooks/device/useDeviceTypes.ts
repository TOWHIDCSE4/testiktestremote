import { T_BackendResponse, T_DeviceType } from "custom-validator"
import {
  API_URL_DEVICE_TYPES,
  SIXTEEN_HOURS,
  TWELVE_HOURS,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_DeviceType[]
}

export async function getAllDeviceTypes() {
  const res = await fetch(`${API_URL_DEVICE_TYPES}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
  return (await res.json()) as T_DBReturn
}

export default function useDeviceTypes() {
  const query = useQuery(["deviceTypes"], () => getAllDeviceTypes(), {
    cacheTime: SIXTEEN_HOURS,
    staleTime: TWELVE_HOURS,
    refetchOnWindowFocus: false,
  })
  return query
}
