import Cookies from "js-cookie"
import Content from "../../../../components/pages/production/timer/Content"
import { cookies } from "next/headers"

export const metadata = {
  title: "APMS - Production / Timer",
  description: "Concrete pipe maker based in Texas, USA",
}

const Timer = () => {
  const store = cookies()
  console.log("[TFL]", store.get("tfl"))
  return <Content />
}

export default Timer
