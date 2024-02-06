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

export const _Get_Sessions_List = async () => {
  const tlf = Cookies.get("tfl")
  const res = await fetch(`${API_URL}/api/dev-ops/session-list`, {
    headers: { Authorization: `Bearer ${tlf}` },
  })
  return (await res.json()) as T_DBReturn<T_Timer_Group_Types[]>
}

const useSessions = () => {
  const query = useQuery({
    queryKey: ["devOps-sessions"],
    queryFn: _Get_Sessions_List,
    refetchOnWindowFocus: false,
  })
  return query
}

export default useSessions
