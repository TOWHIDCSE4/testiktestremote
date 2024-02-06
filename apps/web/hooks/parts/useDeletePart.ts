import { API_URL_PARTS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function deletePart({ _id }: { _id: string }) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_PARTS}/${_id}`, {
    method: "DELETE",
    body: JSON.stringify({}),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useDeletePart() {
  const query = useMutation(({ _id }: { _id: string }) =>
    deletePart({
      _id,
    })
  )
  return query
}

export default useDeletePart
