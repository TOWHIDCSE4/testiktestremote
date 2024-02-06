import { API_URL_JOBS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function deleteJob({ _id }: { _id: string }) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_JOBS}/${_id}`, {
    method: "DELETE",
    body: JSON.stringify({}),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useDeleteJob() {
  const query = useMutation(({ _id }: { _id: string }) =>
    deleteJob({
      _id,
    })
  )
  return query
}

export default useDeleteJob
