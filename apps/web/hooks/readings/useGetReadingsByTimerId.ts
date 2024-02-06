import { API_URL_READINGS, ONE_DAY } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function getReadingsByTimerId(timerId: string) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_READINGS}?timerId=${timerId}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

export const readingByTimerIdQuery = (timerId: string) => [
  "readings-by-timerId",
  timerId,
]

function useGetReadingsByTimerId(timerId: string) {
  const query = useQuery(
    readingByTimerIdQuery(timerId),
    () => getReadingsByTimerId(timerId),
    {}
  )
  return query
}
export default useGetReadingsByTimerId
