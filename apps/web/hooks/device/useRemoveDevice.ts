import Cookies from "js-cookie"
import { API_URL_DEVICE } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"

export async function removeDevice(props: { id: string }) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_DEVICE}/${props.id}`, {
    method: "DELETE",
    // body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

export default function useRemoveDevice() {
  const query = useMutation((props: { id: string }) => removeDevice(props))
  return query
}
