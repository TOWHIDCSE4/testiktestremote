// @ts-nocheck
"use client"
import { Card, Divider, IconButton } from "@mui/material"
import { T_MachineClass } from "custom-validator"
import Cookies from "js-cookie"
import { cache } from "react"
import { BiRefresh } from "react-icons/bi"
import { GrVirtualMachine } from "react-icons/gr"
import { LuMoreVertical } from "react-icons/lu"
import { T_DBReturn } from "../../../../_types"
import useDevOpsTimers from "./_state"

export const _Get_Machine_Classes = cache(async (sessionId: string) => {
  const tlf = Cookies.get("tfl")
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/dev-ops/timers-by-machineClass?sessionId=${sessionId}`,
    {
      headers: { Authorization: `Bearer ${tlf}` },
      next: { tags: ["devOps-machineClasses"] },
    }
  )
  return (await response.json()) as T_DBReturn<T_MachineClass[]>
})

const MachineClassesCard = async () => {
  const activeSession = useDevOpsTimers((s) => s.activeSession)
  const machineClasses = await _Get_Machine_Classes(activeSession)

  return (
    <Card className="flex-none w-80 h-[40rem] overflow-y-auto">
      <div className="flex items-center justify-between space-x-2 p-2">
        <p className="line-clamp-1 font-semibold leading-tight">
          Timers By Machine Classes
        </p>
        <div className="flex items-center space-x-2">
          <IconButton>
            <BiRefresh />
          </IconButton>

          <IconButton>
            <LuMoreVertical />
          </IconButton>
        </div>
      </div>
      <Divider />
      <div className="p-2 space-y-">
        {Object.keys(machineClasses?.items || {}).length ? (
          Object.keys(machineClasses?.items)?.map(
            (machine: string, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between px-2 border-b py-1 last:border-none"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-950 rounded-full text-white">
                    <GrVirtualMachine className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-md w-32 truncate font-semibold">
                      {machine}
                    </div>
                    <div className="text-sm w-36 truncate">
                      Total Timers - {machineClasses?.items[machine]}
                      {/* // TODO type issues */}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-md">{i * 20}</div>
                  <div
                    className={`text-md font-semibold ${
                      i % 2 === 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {i % 2 === 0 ? "Passed" : "Failed"}
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          <div className="text-center mt-56">No Active Timers</div>
        )}
      </div>
    </Card>
  )
}

export default MachineClassesCard
