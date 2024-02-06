import { T_User } from "custom-validator"
import { API_URL_USERS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { T_UserPinnedComponents } from "custom-validator"

interface Props {
  userId: string
  pinnedComponentsDashboard: T_UserPinnedComponents[]
}

export async function addToPinDashboard(props: Props) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_USERS}/pinned-components/dashboard`, {
    method: "PATCH",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useAddToPinDashboard() {
  const query = useMutation((props: Props) => addToPinDashboard(props))
  return query
}

export default useAddToPinDashboard
