"use client"
import TimerTableRow from "./TimerTableRow"
import useGetMachineClassTonsUnit from "../../../hooks/timerLogs/useMachineClassTonsUnits"

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
  const { data: totalTons } = useGetMachineClassTonsUnit({
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
          <td className="px-2">{totalTons?.item?.units}</td>
          <td className="px-2">{totalTons?.item?.tons?.toFixed(2)}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  )
}