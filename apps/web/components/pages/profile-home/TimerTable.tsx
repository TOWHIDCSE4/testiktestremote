"use client"
import { T_MachineClass } from "custom-validator"
import { useEffect, useState } from "react"
import useGetAllTimersGroup from "../../../hooks/timers/useGetAllTimersGroup"
import TimerTableRow from "./TimerTableRow"
import useGetOverallTotal from "../../../hooks/timerLogs/useGetOverallTotal"

export default function TimerTableComponent({
  location,
  machineClass,
  timers,
}: {
  location: {
    name: string
    _id?: string
  }
  machineClass: any
  timers: any
}) {
  const { data: totalTons } = useGetOverallTotal({
    locationId: location._id,
    machineClassId: machineClass.machineClass._id,
  })

  return (
    <table className="w-full text-xs">
      <thead className="font-bold">
        <td className="px-2">Timer</td>
        <td className="">Part</td>
        <td className="px-2">Units</td>
        <td className="px-2">Tons</td>
        <td></td>
      </thead>
      <tbody>
        {timers?.length > 0
          ? timers?.map((item: any, index: number) => (
              <TimerTableRow key={item?._id} rowData={item} index={index} />
            ))
          : null}
        <tr className="font-bold bg-white bg-opacity-20">
          <td></td>
          <td className="text-right uppercase">Total</td>
          <td className="px-2">{totalTons?.item?.RPtons?.toFixed(2)}</td>
          <td className="px-2">{totalTons?.item?.RPunits}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  )
}
