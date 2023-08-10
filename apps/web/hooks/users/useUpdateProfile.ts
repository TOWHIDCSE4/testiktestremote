import { I_UserUpdate } from "../../types/global"
import { API_URL_USERS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function updateBasicInfo({
  firstName,
  lastName,
  email,
  id,
}: I_UserUpdate) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_USERS}/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      firstName,
      lastName,
      email,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useUpdateBasicInfo() {
  const query = useMutation(
    ({ firstName, lastName, email, id }: I_UserUpdate) =>
      updateBasicInfo({
        firstName,
        lastName,
        email,
        id,
      })
  )

  return query
}

export default useUpdateBasicInfo
