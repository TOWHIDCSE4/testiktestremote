import { T_CreateDevice } from "custom-validator"
import Cookies from "js-cookie"
import { API_URL_DEVICE } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"

export async function createDevice(props: T_CreateDevice) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_DEVICE}`, {
    method: "POST",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

export default function useCreateDevice() {
  const query = useMutation((props: T_CreateDevice) => createDevice(props))
  return query
}
