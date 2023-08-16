import { API_URL_MACHINE, THREE_MINUTES } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

export async function getMachineByClass(id: string | undefined) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_MACHINE}/machines-class/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useGetMachineByClass() {
  const [selectedMachineClassId, setSelectedMachineClassId] = useState("")
  const query = useQuery(
    ["machine", selectedMachineClassId],
    () => getMachineByClass(selectedMachineClassId),
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
export default useGetMachineByClass
