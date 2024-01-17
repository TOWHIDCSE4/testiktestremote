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

const _Alert_List = async () => {
  const tlf = Cookies.get("tfl")
  const res = await fetch(`${API_URL}/api/dev-ops/alert-list`, {
    headers: { Authorization: `Bearer ${tlf}` },
    next: { tags: ["devOps-alerts"] },
    cache: "no-store",
  })
  return (await res.json()) as T_DBReturn<any>
}

const useAlertList = () => {
  const query = useQuery({
    queryKey: ["devOps-alert-list"],
    queryFn: _Alert_List,
    refetchOnWindowFocus: false,
  })
  return query
}

export default useAlertList
