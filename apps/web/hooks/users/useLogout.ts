import { API_URL_USERS } from "../../helpers/constants"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Cookies from "js-cookie"
import router from "next/router"

export async function logoutUser() {
  const tfl = Cookies.get("tfl")
  const res = await fetch(`${API_URL_USERS}/logout`, {
    method: "POST",
    body: JSON.stringify({
      token: tfl,
    }),
    headers: {
      "content-type": "application/json",
    },
  })
  return res.json()
}

function useLogout() {
  const query = useMutation({
    mutationFn: () => logoutUser(),
    onSettled: () => {
      Cookies.remove("tfl")
    },
  })
  return query
}

export default useLogout
