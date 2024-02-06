import { API_URL_MACHINE, THREE_MINUTES } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_Machine, T_Part } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_Machine[]
}

export async function getAllMachines({
  page,
  locationId,
  factoryId,
  machineClassId,
  name,
}: {
  page: number
  locationId: string
  factoryId?: string
  machineClassId?: string
  name?: string
}) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_MACHINE}/paginated?page=${page}&locationId=${locationId}&factoryId=${factoryId}&machineClassId=${machineClassId}&name=${name}`,
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

function usePaginatedMachines() {
  const [page, setPage] = useState(1)
  const [locationId, setLocationId] = useState("")
  const [factoryId, setFactoryId] = useState("")
  const [machineClassId, setMachineClassId] = useState("")
  const [name, setName] = useState("")
  const query = useQuery(
    ["machines", page, locationId, factoryId, machineClassId, name],
    () => getAllMachines({ page, locationId, factoryId, machineClassId, name }),
    {
      staleTime: THREE_MINUTES,
      refetchOnWindowFocus: false,
      enabled: !!locationId && !!page,
    }
  )
  useEffect(() => {
    if (locationId && page) {
      query.refetch()
    }
  }, [page, locationId])

  return {
    ...query,
    page,
    setPage,
    locationId,
    setLocationId,
    factoryId,
    setFactoryId,
    machineClassId,
    setMachineClassId,
    name,
    setName,
  }
}
export default usePaginatedMachines
