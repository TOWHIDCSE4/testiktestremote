import { API_URL_FACTORIES, API_URL_USERS } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"

export async function getAllFactories(token: string) {
  const res = await fetch(`${API_URL_FACTORIES}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useGetAllFactories(token: string) {
  const query = useQuery(["factories"], () => getAllFactories(token), {
    refetchOnWindowFocus: false,
  })
  return query
}
export default useGetAllFactories
