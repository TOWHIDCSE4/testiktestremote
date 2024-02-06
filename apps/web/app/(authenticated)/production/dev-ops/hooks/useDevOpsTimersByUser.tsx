import { useQuery } from "@tanstack/react-query"
import React from "react"
import { API_URL } from "../../../../../helpers/constants"
import { T_DBReturn } from "../../../../_types"
import { T_Location } from "custom-validator"
import { T_MachineClass } from "custom-validator"
import Cookies from "js-cookie"
import { T_Timer } from "custom-validator"

type T_Timer_Group_Types = {
  _id: string
  timers: T_Timer[]
}

export const _Get_Machine_Classes = async () => {
  const tlf = Cookies.get("tfl")
  const res = await fetch(`${API_URL}/api/dev-ops/active-session-timers`, {
    headers: { Authorization: `Bearer ${tlf}` },
    next: { tags: ["devOps-timers"] },
    cache: "no-store",
  })
  return (await res.json()) as T_DBReturn<T_Timer_Group_Types[]>
}

const useDevOpsTimersByUser = () => {
  const query = useQuery({
    queryKey: ["devOps-timers-by-user"],
    queryFn: _Get_Machine_Classes,
    refetchOnWindowFocus: false,
  })
  return query
}

export default useDevOpsTimersByUser
