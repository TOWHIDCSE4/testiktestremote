import { API_URL_USERS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { T_UserProfile } from "custom-validator"

export async function updateProfile({
  _id,
  profile,
}: {
  _id: string
  profile: T_UserProfile
}) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_USERS}/${_id}`, {
    method: "PATCH",
    body: JSON.stringify({
      profile,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useUpdateProfile() {
  const query = useMutation(
    ({ _id, profile }: { _id: string; profile: T_UserProfile }) =>
      updateProfile({
        _id,
        profile,
      })
  )
  return query
}

export default useUpdateProfile
