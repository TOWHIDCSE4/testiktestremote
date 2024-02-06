import Cookies from "js-cookie"
import { API_URL_DEVICE } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"

type T_Request = {
  deviceId: string
  locationId?: string
  type: "in" | "out"
}

export async function createDeviceRequest(props: T_Request) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_DEVICE}/${props.deviceId}/request`, {
    method: "POST",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

export default function useCreateDeviceRequest() {
  const query = useMutation((props: T_Request) => createDeviceRequest(props))
  return query
}
