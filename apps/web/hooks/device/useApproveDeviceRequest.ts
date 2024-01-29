import { useMutation } from "@tanstack/react-query"
import { API_URL_DEVICE } from "../../helpers/constants"
import Cookies from "js-cookie"

type T_Request = {
  id: string
  cancel?: boolean
}

export async function approveDeviceRequest(props: T_Request) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_DEVICE}/request/${props.id}/approve`, {
    method: "POST",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

export default function useApproveDeviceRequest() {
  const query = useMutation((props: T_Request) => approveDeviceRequest(props))
  return query
}
