import { API_URL_PROFILE_LOOKUP } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function updaterFn() {
  const token = Cookies.get("tfl")

  const res = await fetch(`${API_URL_PROFILE_LOOKUP}`, {
    method: "Delete",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useDeleteProductionLookupFilter() {
  const query = useMutation(() => updaterFn())
  return query
}

export default useDeleteProductionLookupFilter
