import { useQuery } from "@tanstack/react-query"
import React from "react"
import { API_URL } from "../../../../../helpers/constants"
import { T_DBReturn } from "../../../../_types"
import { T_Location } from "custom-validator"

const _Get_Locations = async () => {
  const response = await fetch(`${API_URL}/api/locations`)
  return (await response.json()) as T_DBReturn<T_Location[]>
}

const useLocations = () => {
  const query = useQuery({
    queryKey: ["locations"],
    queryFn: _Get_Locations,
    refetchOnWindowFocus: false,
  })
  return query
}

export default useLocations
