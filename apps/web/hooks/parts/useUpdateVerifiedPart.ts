import { API_URL_VERIFIED_PART } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function updateVerifiedPart({ partId }) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_VERIFIED_PART}/${partId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useVerifiedPart() {
  const mutation = useMutation((partId) => updateVerifiedPart({ partId }))
  return mutation
}

export default useVerifiedPart
