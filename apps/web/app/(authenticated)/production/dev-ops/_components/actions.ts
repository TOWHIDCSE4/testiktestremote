"use server"

import { T_MachineClass } from "custom-validator"
import { revalidatePath, revalidateTag } from "next/cache"
import { cookies } from "next/headers"
import { T_DBReturn } from "../../../../_types"

export const revalidateDevOpsTimers = () => {
  revalidateTag("devOps-timers")
  revalidatePath("/dev-ops/timers")
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
