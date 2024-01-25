import { useQuery } from "@tanstack/react-query"
import { ONE_DAY } from "../../helpers/constants"

export async function fetcherfn(lat: number, long: number) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m&temperature_unit=fahrenheit`
  )
  return await res.json()
}

function useWether(lat: number, long: number) {
  const query = useQuery(["weather", lat], () => fetcherfn(lat, long), {
    refetchOnWindowFocus: false,
    staleTime: ONE_DAY,
  })
  return query
}

export default useWether
