import Cookies from "js-cookie"
import Content from "../../../../components/pages/production/timer/Content"
import { cookies } from "next/headers"

export const metadata = {
  title: "APMS - Production / Timer",
  description: "Concrete pipe maker based in Texas, USA",
}

const Timer = () => {
  return <Content />
}

export default Timer
