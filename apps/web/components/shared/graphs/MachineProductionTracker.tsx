import { ResponsiveBar } from "@nivo/bar"
import { linearGradientDef } from "@nivo/core"
import useGetReportByLocationAndMachine from "../../../hooks/reports/useGetReportByLocationAndMachine"
import React, { useEffect, useState } from "react"
import Select from "react-select"
import { sortBy } from "lodash"
import cn from "classnames"

const groupByMachineClass = (data: any[], machineClassId?: string) => {
  if (!data || !data?.length) return []
  const grouped = data.reduce((prev, next) => {
    if (!prev[next.machineClass]) {
      prev[next.machineClass] = []
    }

    const sameLocation = prev[next.machineClass].find(
      (d: any) => d.locationName === next.locationName
    )
    if (sameLocation && prev[next.machineClass]) {
      prev[next.machineClass] = prev[next.machineClass].map((d: any) => {
        if (d.locationName === next.locationName) {
          return {
            ...d,
            [`machine_${next.machineName}`]: next.total,
            allTotal: d.allTotal ? d.allTotal + next.total : 0,
          }
        }
        return d
      })
    } else {
      prev[next.machineClass].push({
        ...next,
        [`machine_${next.machineName}`]: next.total,
        allTotal: next.total,
      })
    }

    return prev
  }, {})
  return grouped
}

interface Props {
  machineClassId?: string
}
const MachineProductionTracker = ({ machineClassId }: Props) => {
  const { data: reportData, isLoading: isReportLoading } =
    useGetReportByLocationAndMachine()
  const [selectedType, setSelectedType] = useState("units")
  const [selectedMachineClass, setSelectedMachineClass] = useState<string>()
  const filteredReportData = machineClassId
    ? reportData?.[selectedType]?.filter(
        (d: any) => d._id.machineClassId === machineClassId
      )
    : reportData?.[selectedType]
  const grouped = groupByMachineClass(filteredReportData, machineClassId)
  const groupedKeys = Object.keys(grouped)
  let data = selectedMachineClass ? grouped[selectedMachineClass] : []

  if (data?.length < 3) {
    const locations = ["Seguin", "Conroe", "Gunter"]
    locations.forEach((name) => {
      if (!data.find((d: any) => d.locationName === name)) {
        data.push({
          locationName: name,
          allTotal: 0,
        })
      }
    })
  }
  const allKeys =
    selectedMachineClass && data?.length
      ? data.reduce((prev: any, next: any) => {
          return prev.concat(
            Object.keys(next).filter((k: string) => k.includes("machine_"))
          )
        }, [] as string[])
      : []

  useEffect(() => {
    if (!selectedMachineClass && groupedKeys?.length) {
      setSelectedMachineClass(groupedKeys[0])
    }
  }, [groupedKeys, selectedMachineClass])
  if (isReportLoading) {
    return null
  }
  return (
    <div className="flex-grow w-full">
      <h2 className="text-2xl flex gap-4 items-center">
        <div className="w-fit">
          <Select
            value={{ value: selectedMachineClass, label: selectedMachineClass }}
            options={groupedKeys?.map((d) => ({ value: d, label: d }))}
            onChange={(d) => setSelectedMachineClass(d?.value as string)}
          />
        </div>
        <div>Performance</div>
      </h2>
      <div className="w-full mx-4 sm:h-40 xl:min-h-[270px]  flex flex-col">
        <ResponsiveBar
          data={sortBy(data, ["allTotal"])}
          label={(d) => {
            return (d.id as string).replace("machine_", "")
          }}
          margin={{ top: 10, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          indexBy="locationName"
          borderWidth={2}
          colorBy="indexValue"
          colors={["#0ea5e9", "#a855f7", "#3b82f6"]}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.5]],
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "unit created",
            legendPosition: "middle",
            legendOffset: 32,
            truncateTickAt: 0,
          }}
          keys={sortBy(allKeys)}
          layout="horizontal"
          labelTextColor="white"
        />
        <div className={"flex gap-4"}>
          <button
            onClick={() => setSelectedType("tons")}
            className={cn("w-40 py-1 rounded-sm", {
              "bg-gray-300": selectedType !== "tons",
              "bg-blue-400 text-white": selectedType === "tons",
            })}
          >
            Tons
          </button>
          <button
            onClick={() => setSelectedType("units")}
            className={cn(" w-40 py-1 rounded-sm ", {
              "bg-blue-400 text-white": selectedType === "units",
              "bg-gray-300": selectedType !== "units",
            })}
          >
            units
          </button>
        </div>
      </div>
    </div>
  )
}

export default MachineProductionTracker
