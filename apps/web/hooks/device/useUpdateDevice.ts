import { T_CreateDevice, T_Device } from "custom-validator"
import Cookies from "js-cookie"
import { API_URL_DEVICE } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"

export async function updateDevice(
  props: (T_CreateDevice | { status: T_Device["status"] }) & { _id: string }
) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_DEVICE}/${props._id}`, {
    method: "PUT",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

export default function useUpdateDevice() {
  const query = useMutation(
    (
      props: (T_CreateDevice | { status: T_Device["status"] }) & { _id: string }
    ) => updateDevice(props)
  )
  return query
}
