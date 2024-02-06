import {
    API_URL_TIMER_LOGS,
  } from "../../helpers/constants"
  import { useQuery } from "@tanstack/react-query"
  import Cookies from "js-cookie"
  
  export async function fetcherfn(lid: string, tid: string) {
    const token = Cookies.get("tfl")
    const res = await fetch(
      `${API_URL_TIMER_LOGS}/timer?locationId=${lid}&timerId=${tid}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return await res.json()
  }
  
  function useTimerStatus({
    locationId,
    timerId,
  }: {
    locationId: string
    timerId: string
  }) {
    const query = useQuery(
      ["timer-status", timerId],
      () => fetcherfn(locationId, timerId),
      {
        refetchOnWindowFocus: false,
      }
    )
    return query
  }
  
  export default useTimerStatus