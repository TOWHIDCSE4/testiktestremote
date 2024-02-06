import { API_URL_JOB_TIMER, THREE_MINUTES } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_JobTimer } from "custom-validator"
import Cookies from "js-cookie"

type T_DBReturn = Omit<T_BackendResponse, "item"> & {
  item: T_JobTimer
}

export async function getJobTimerId({
  locationId,
  timerId,
}: {
  locationId: string
  timerId: string
}) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_JOB_TIMER}/timer?locationId=${locationId}&timerId=${timerId}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return (await res.json()) as T_DBReturn
}

function useGetJobTimerByTimerId({
  locationId,
  timerId,
}: {
  locationId: string
  timerId: string
}) {
  const query = useQuery(
    ["job-timer-timer", locationId, timerId],
    () => getJobTimerId({ locationId, timerId }),
    {
      enabled: !!locationId && !!timerId,
      refetchOnWindowFocus: false,
    }
  )
  return query
}
export default useGetJobTimerByTimerId
