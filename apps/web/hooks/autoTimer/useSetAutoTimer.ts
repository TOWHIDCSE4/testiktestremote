import { T_CreateAutoTimer } from "custom-validator"
import Cookies from "js-cookie"
import { API_URL_AUTOTIMER } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"

export async function setAutoTimer(props: T_CreateAutoTimer) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_AUTOTIMER}`, {
    method: "POST",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useSetAutoTimer() {
  const query = useMutation((props: T_CreateAutoTimer) => setAutoTimer(props))
  return query
}

export default useSetAutoTimer
