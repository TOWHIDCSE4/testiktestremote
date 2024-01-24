import React from "react"
import useTotalTonsUnit from "../../../hooks/timers/useTotalTonsUnit"

interface Props {
  rowData: any
  index: number
}

const TimerTableRowMobile: React.FC<Props> = async ({ rowData, index }) => {
  const query = useTotalTonsUnit({
    locationId: rowData.locationId,
    timerId: rowData._id,
  })
  return (
    <tr>
      <td className="px-3">{query?.data?.item?.dailyUnits}</td>
      <td className="px-3">{query?.data?.item?.tons?.toFixed(2)}</td>
      <td>
        <div
          className={`${
            index == 0
              ? "bg-green-500"
              : index == 1
              ? "bg-red-500"
              : index == 2
              ? "bg-yellow-500"
              : "bg-transparent"
          } border border-slate-500 rounded-full w-[6px] h-[6px]`}
        ></div>
      </td>
    </tr>
  )
}

export default TimerTableRowMobile
