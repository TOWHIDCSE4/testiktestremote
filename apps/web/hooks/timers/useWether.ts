import { API_URL_ALL_LOCATIONS_TOTAL_TONSUNIT } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function fetcherfn(lat: number, long: number) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m&temperature_unit=fahrenheit`
  )
  return await res.json()
}

function useWether(lat: number, long: number) {
  const query = useQuery(["wether"], () => fetcherfn(lat, long), {})
  return query
}

export default useWether
