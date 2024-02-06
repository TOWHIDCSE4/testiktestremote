import useGetReportByLocationAndMachine from "../../../hooks/reports/useGetReportByLocationAndMachine"
import React, { useEffect, useState } from "react"
import Select from "react-select"
import { ResponsiveBar } from "@nivo/bar"
import { sortBy } from "lodash"
import cn from "classnames"

const group = (data: any[]) => {
  if (!data || !data?.length) return []
  return data.reduce((prev, next) => {
    if (!prev[next.locationName]) {
      prev[next.locationName] = {}
    }
    const selectedLocation = prev[next.locationName]
    if (!selectedLocation[next.machineClass]) {
      selectedLocation[next.machineClass] = []
    }
    const selectedMachineClass = selectedLocation[next.machineClass]
    selectedMachineClass.push(next)

    return prev
  }, {} as any)
}

const MachineProductionPerLocationTracker = () => {
  const { data: reportData } = useGetReportByLocationAndMachine()
  const [selectedType, setSelectedType] = useState("units")
  const [selectedLocation, setSelectedLocation] = useState<string>()
  const [selectedMachineClass, setSelectedMachineClass] = useState<string>()
  const grouped = group(reportData?.[selectedType])
  const locationOptions = grouped ? sortBy(Object.keys(grouped)) : []
  const machineClassOptions = selectedLocation
    ? sortBy(Object.keys(grouped[selectedLocation]))
    : []
  useEffect(() => {
    if (!selectedLocation && Object.keys(grouped).length) {
      const location = Object.keys(grouped)[0]
      setSelectedLocation(location)

      if (!selectedMachineClass && Object.keys(grouped[location]).length) {
        setSelectedMachineClass(Object.keys(grouped[location])[0])
      }
    }
  }, [grouped])

  const onLocationChange = (value: string) => {
    setSelectedLocation(value)
    if (Object.keys(grouped?.[value])?.length) {
      setSelectedMachineClass(Object.keys(grouped[value])[0])
    } else {
      setSelectedMachineClass(undefined)
    }
  }

  return (
    <div className="min-h-[300px]">
      <h2 className="text-2xl flex gap-4 items-center">
        <div className="w-fit">
          <Select
            value={{ value: selectedLocation, label: selectedLocation }}
            options={locationOptions.map((d) => ({ value: d, label: d }))}
            onChange={(d) => onLocationChange(d?.value as string)}
          />
        </div>
        <div className="w-fit">
          <Select
            value={{ value: selectedMachineClass, label: selectedMachineClass }}
            options={machineClassOptions?.map((d) => ({ value: d, label: d }))}
            onChange={(d) => setSelectedMachineClass(d?.value as string)}
          />
        </div>
        <div>Performance</div>
      </h2>
      <div className="w-full mx-4 sm:h-40 xl:min-h-[270px]  flex flex-col">
        <ResponsiveBar
          data={
            selectedLocation && selectedMachineClass
              ? sortBy(grouped[selectedLocation][selectedMachineClass], [
                  "total",
                ])
              : []
          }
          margin={{ top: 10, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          indexBy="machineName"
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
          keys={["total"]}
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

export default MachineProductionPerLocationTracker
