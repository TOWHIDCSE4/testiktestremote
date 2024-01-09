"use server"

import { revalidatePath, revalidateTag } from "next/cache"

export const revalidateDevOpsTimers = () => {
  revalidateTag("devOps-timers")
}
export const revalidateDevOpsTimersSessions = () => {
  revalidateTag("devOps-timers-sessions-list")
}
