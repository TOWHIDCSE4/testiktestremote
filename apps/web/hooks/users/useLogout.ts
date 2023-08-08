import { API_URL_USERS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_LOGOUT } from "../../types/global"
import Cookies from "js-cookie"

export async function logoutUser() {
  const tlf = Cookies.get("tfl")
  const res = await fetch(`${API_URL_USERS}/logout`, {
    method: "POST",
    body: JSON.stringify({
      token: tlf,
    }),
    headers: {
      "content-type": "application/json",
    },
  })
  return res.json()
}

function useLogout() {
  const query = useMutation(() => logoutUser())
  return query
}

export default useLogout
