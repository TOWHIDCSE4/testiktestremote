import { useQuery } from "@tanstack/react-query"

export async function fetcherfn(lat: number, long: number) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m&temperature_unit=fahrenheit`
    )
  return await res.json()
}

function useWether(lat: number, long: number) {
  const query = useQuery(["weather", lat], () => fetcherfn(lat, long), {})
  return query
}

export default useWether
