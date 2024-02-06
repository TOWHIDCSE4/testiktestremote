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

interface ReportData {
  locationName: string
  total: number
}

interface DummyReportData {
  [key: string]: ReportData[]
}

const dummyReportData: DummyReportData = {
  units: [
    {
      locationName: "Seguin",
      total: 50,
    },
    {
      locationName: "Conroe",
      total: 200,
    },
    {
      locationName: "Gunter",
      total: 80,
    },
  ],
  tons: [
    {
      locationName: "Seguin",
      total: 100,
    },
    {
      locationName: "Conroe",
      total: 200,
    },
    {
      locationName: "Gunter",
      total: 40,
    },
  ],
  units2: [
    {
      locationName: "Seguin",
      total: 50,
    },
    {
      locationName: "Conroe",
      total: 100,
    },
    {
      locationName: "Gunter",
      total: 20,
    },
  ],
  tons2: [
    {
      locationName: "Seguin",
      total: 100,
    },
    {
      locationName: "Conroe",
      total: 200,
    },
    {
      locationName: "Gunter",
      total: 40,
    },
  ],
}

interface Props {
  machineClassId?: string
}
const MachineProductionTracker = ({ machineClassId }: Props) => {
  const { data: reportData, isLoading: isReportLoading } =
    useGetReportByLocationAndMachine()
  const [selectedType, setSelectedType] = useState<
    "units" | "tons" | "units2" | "tons2"
  >("units")
  const [selectedMachineClass, setSelectedMachineClass] = useState<string>()
  const filteredReportData = machineClassId
    ? reportData?.[selectedType]?.filter(
        (d: any) => d._id.machineClassId === machineClassId
      )
    : reportData?.[selectedType]
  const grouped = groupByMachineClass(filteredReportData, machineClassId)
  const groupedKeys = Object.keys(grouped)
  const data = selectedMachineClass ? grouped[selectedMachineClass] : []

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

  const usedData: ReportData[] = dummyReportData[selectedType]
  const legendItems = [
    { label: "Seguin", color: "#f6b87b" },
    { label: "Gunter", color: "#989af1" },
    { label: "Conroe", color: "#98ccf1" },
  ]

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
      <div className="text-2xl flex gap-4 items-center">
        <div className="w-fit">
          <Select
            value={{ value: selectedMachineClass, label: selectedMachineClass }}
            options={groupedKeys?.map((d) => ({ value: d, label: d }))}
            onChange={(d) => setSelectedMachineClass(d?.value as string)}
          />
        </div>
        <div className="w-full flex flex-col ">
          <div>Performance</div>
          <p className="text-center text-xs uppercase text-gray-500">
            Performance between Conroe seguin and gunter
          </p>
        </div>
      </div>
      <div className="w-full mx-4 sm:h-40 xl:min-h-[290px] flex flex-col">
        <div className="w-full flex items-center sm:h-40 xl:min-h-[290px]">
          <div className="w-[80%] h-full">
            <ResponsiveBar
              data={sortBy(usedData, ["locationName"]) as any}
              layout="horizontal"
              indexBy="locationName"
              keys={["total"]}
              valueScale={{ type: "linear" }}
              indexScale={{ type: "band", round: true }}
              margin={{ top: 10, right: 60, bottom: 50, left: 60 }}
              padding={0.1}
              colors={["#98ccf1", "#989af1", "#f6b87b"]}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                truncateTickAt: 0,
                legendOffset: 0,
              }}
              labelSkipWidth={12}
              labelSkipHeight={18}
              colorBy="indexValue"
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              labelTextColor="black"
              enableGridX={true}
              enableGridY={true}
              label={(d) => `${d.value}`}
              // label={(d) => `${d.value} and <br/> ${d.id as string}`}
              labelFormat={(d) => `${d}`}
            />
          </div>
          <div className="flex flex-col items-start w-[20%]">
            {legendItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 "
                  style={{ backgroundColor: item.color }}
                ></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* <ResponsiveBar
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
        /> */}
        <div className="flex items-center justify-between">
          <div className={"flex gap-2"}>
            <button
              onClick={() => setSelectedType("units")}
              className={cn(" text-xs px-2 py-1 rounded-sm tracking-tighter ", {
                "bg-[#1b426d] text-white": selectedType === "units",
                "bg-gray-300": selectedType !== "units",
              })}
            >
              Show Units
            </button>
            <button
              onClick={() => setSelectedType("tons")}
              className={cn("text-xs px-2 py-1 rounded-sm tracking-tighter", {
                "bg-gray-300": selectedType !== "tons",
                "bg-[#1b426d] text-white": selectedType === "tons",
              })}
            >
              Show Tons
            </button>
            <button
              onClick={() => setSelectedType("tons2")}
              className={cn("text-xs px-2 py-1 rounded-sm tracking-tighter", {
                "bg-gray-300": selectedType !== "tons2",
                "bg-[#1b426d] text-white": selectedType === "tons2",
              })}
            >
              Show Units
            </button>
            <button
              onClick={() => setSelectedType("units2")}
              className={cn(" text-xs px-2 py-1 rounded-sm tracking-tighter ", {
                "bg-[#1b426d] text-white": selectedType === "units2",
                "bg-gray-300": selectedType !== "units2",
              })}
            >
              Show Units
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-7 h-3 bg-green-300 border-green-500 border-2"></div>
            <p className="text-xs uppercase"> leader in green</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MachineProductionTracker
