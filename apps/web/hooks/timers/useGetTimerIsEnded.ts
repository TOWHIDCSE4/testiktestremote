import {
    API_URL_CONTROLLER_TIMER,
  } from "../../helpers/constants"
  import { useQuery } from "@tanstack/react-query"
  import Cookies from "js-cookie"
  
  export async function fetcherfn(tid: string) {
    const token = Cookies.get("tfl")
    const res = await fetch(`${API_URL_CONTROLLER_TIMER}/today?timerId=${tid}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    return await res.json()
  }
  
  function useGetTimerIsEnded({ timerId }: { timerId: string }) {
    const query = useQuery(["isTimerEnded", timerId], () => fetcherfn(timerId), {
      refetchOnWindowFocus: false,
    })
    return query
  }
  
  export default useGetTimerIsEnded