import { API_URL_USERS } from "../../helpers/constants"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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
  const queryClient = useQueryClient()
  const query = useMutation({
    mutationFn: () => logoutUser(),
    onSettled: () => {
      queryClient.clear()
      window.localStorage.clear()
      window.location.href = "/"
    },
  })
  return query
}

export default useLogout
