import { API_URL_MACHINE, THREE_MINUTES } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_Machine } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_Machine[]
}

export async function getMachinesByMachineClassLocation({
  locationId,
  machineClassId,
}: {
  locationId: string
  machineClassId: string
}) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_MACHINE}/location-machine-class?locationId=${locationId}&machineClassId=${machineClassId}`,
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

function useGetMachinesByMachineClassLocation() {
  const [selectedMachineClassId, setSelectedMachineClassId] = useState("")
  const [selectedLocationId, setSelectedLocationId] = useState("")
  const query = useQuery(
    [
      "machines-machine-class-location",
      selectedLocationId,
      selectedMachineClassId,
    ],
    () =>
      getMachinesByMachineClassLocation({
        locationId: selectedLocationId,
        machineClassId: selectedMachineClassId,
      }),
    {
      staleTime: THREE_MINUTES,
      refetchOnWindowFocus: false,
      enabled: selectedMachineClassId !== "" && selectedLocationId !== "",
    }
  )

  useEffect(() => {
    if (selectedMachineClassId !== "" && selectedLocationId !== "") {
      query.refetch()
    }
  }, [selectedMachineClassId, selectedLocationId])

  return { ...query, setSelectedMachineClassId, setSelectedLocationId }
}
export default useGetMachinesByMachineClassLocation
