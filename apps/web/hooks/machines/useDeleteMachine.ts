import { API_URL_MACHINE } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function deleteMachine({ _id }: { _id: string }) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_MACHINE}/${_id}`, {
    method: "DELETE",
    body: JSON.stringify({}),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useDeleteMachine() {
  const query = useMutation(({ _id }: { _id: string }) =>
    deleteMachine({
      _id,
    })
  )
  return query
}

export default useDeleteMachine
