import React, { useState } from "react"
import { sortBy } from "lodash"
import { ResponsiveBar } from "@nivo/bar"
import cn from "classnames"
import useGetReportByLocation from "../../../hooks/reports/useGetReportByLocation"

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
      locationName: "Gunter",
      total: 80,
    },
    {
      locationName: "Conroe",
      total: 200,
    },
  ],
  tons: [
    {
      locationName: "Seguin",
      total: 60,
    },
    {
      locationName: "Conroe",
      total: 200,
    },
    {
      locationName: "Gunter",
      total: 90,
    },
  ],
  units2: [
    {
      locationName: "Seguin",
      total: 80,
    },
    {
      locationName: "Conroe",
      total: 120,
    },
    {
      locationName: "Gunter",
      total: 200,
    },
  ],
  tons2: [
    {
      locationName: "Seguin",
      total: 180,
    },
    {
      locationName: "Conroe",
      total: 200,
    },
    {
      locationName: "Gunter",
      total: 100,
    },
  ],
}

const ProductionTrackerBar: React.FC = () => {
  const { data: reportData, isLoading: isReportDataLoading } =
    useGetReportByLocation()

  const [selectedType, setSelectedType] = useState<
    "units" | "tons" | "units2" | "tons2"
  >("units")

  const usedData: ReportData[] = dummyReportData[selectedType]

  const highestData: ReportData | {} = usedData?.length
    ? usedData.reduce((prev, data) => {
        return prev.total < data.total ? data : prev
      })
    : {}

  const legendItems = [
    { label: "Seguin", color: "#f6b87b" },
    { label: "Gunter", color: "#989af1" },
    { label: "Conroe", color: "#98ccf1" },
  ]

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full flex flex-col ">
        <h2 className="text-2xl ">Factory Outlook</h2>
        <p className="text-center text-xs uppercase text-gray-500">
          Performance between Conroe seguin and gunter
        </p>
      </div>
      <div className="w-full mx-4 sm:h-40 xl:h-[270px] flex items-center">
        <div className="w-3/4 h-full">
          <ResponsiveBar
            data={sortBy(usedData, ["locationName"]) as any}
            layout="horizontal"
            indexBy="locationName"
            keys={["total"]}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            margin={{ top: 10, right: 60, bottom: 50, left: 60 }}
            padding={0.5}
            colors={["#98ccf1", "#989af1", "#f6b87b"]}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendOffset: 0,
              truncateTickAt: 0,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            colorBy="indexValue"
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            labelTextColor="black"
            enableGridX={false}
            enableGridY={false}
            enableLabel={false}
          />
        </div>
        <div className="flex flex-col items-start ">
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
      <div className="flex items-center justify-between">
        <div className={"flex gap-2"}>
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
        <div className="flex gap-2 items-center">
          <div className="w-7 h-3 bg-green-300 border-green-500 border-2"></div>
          <p className="text-xs uppercase"> leader in green</p>
        </div>
      </div>
    </div>
  )
}

export default ProductionTrackerBar
