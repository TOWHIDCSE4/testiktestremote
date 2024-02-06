import { API_URL_READINGS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_CreateReading } from "custom-validator"
import Cookies from "js-cookie"

export async function addReadings(props: T_CreateReading) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_READINGS}`, {
    method: "POST",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useAddReadings() {
  const query = useMutation((props: T_CreateReading) => addReadings(props))
  return query
}

export default useAddReadings
