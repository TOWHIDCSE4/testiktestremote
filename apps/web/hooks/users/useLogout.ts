import { API_URL_USERS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_LOGOUT } from "../../types/global"

export async function logoutUser({ token }: T_LOGOUT) {
  const res = await fetch(`${API_URL_USERS}/logout`, {
    method: "POST",
    body: JSON.stringify({
      token,
    }),
    headers: {
      "content-type": "application/json",
    },
  })
  return res.json()
}

function useLogout() {
  const query = useMutation(({ token }: T_LOGOUT) =>
    logoutUser({
      token,
    })
  )
  return query
}

export default useLogout
