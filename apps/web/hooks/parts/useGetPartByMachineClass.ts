import {
  API_URL_MACHINE,
  API_URL_PARTS,
  THREE_MINUTES,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

export async function getPartByMachineClass(id: string | undefined) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_PARTS}/machine-class/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useGetPartByMachineClass() {
  const [selectedMachineClassId, setSelectedMachineClassId] = useState("")
  const query = useQuery(
    ["parts", selectedMachineClassId],
    () => getPartByMachineClass(selectedMachineClassId),
    {
      staleTime: THREE_MINUTES,
      refetchOnWindowFocus: false,
      enabled: selectedMachineClassId !== "",
    }
  )

  useEffect(() => {
    if (selectedMachineClassId !== "") {
      query.refetch()
    }
  }, [selectedMachineClassId])

  return { ...query, setSelectedMachineClassId }
}
export default useGetPartByMachineClass
