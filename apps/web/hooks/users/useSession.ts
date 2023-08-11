import { useQuery } from "@tanstack/react-query"
import {
  API_URL_USERS,
  FIFTEEN_MINUTES,
  TEN_MINUTES,
} from "../../helpers/constants"
import Cookies from "js-cookie"

export async function getSession() {
  const tlf = Cookies.get("tfl")
  const res = await fetch(`${API_URL_USERS}/verify/${tlf}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
  return await res.json()
}

function useSession() {
  const query = useQuery(["session"], () => getSession(), {
    cacheTime: FIFTEEN_MINUTES,
    staleTime: TEN_MINUTES,
    refetchOnWindowFocus: false,
  })

  return query
}

export default useSession
