"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { T_DBReturn } from "../../../../_types"
import { T_MachineClass } from "custom-validator"
import { cookies } from "next/headers"

export const revalidateDevOpsTimers = () => {
  revalidateTag("devOps-timers")
}
export const revalidateDevOpsTimersSessions = () => {
  revalidateTag("devOps-timers-sessions-list")
}

export const _Get_Machine_Classes = async () => {
  const cookiesStore = cookies()
  const token = cookiesStore.get("tfl")
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/machine-classes`,
    {
      headers: { Authorization: `Bearer ${token?.value}` },
      next: { tags: ["devOps-machineClasses"] },
    }
  )
  return (await response.json()) as T_DBReturn<T_MachineClass[]>
}
