import { linearGradientDef } from "@nivo/core"
import { ResponsiveBar } from "@nivo/bar"
import useGetReportByLocation from "../../../hooks/reports/useGetReportByLocation"
import React, { useState } from "react"
import { sortBy } from "lodash"
import cn from "classnames"

const data = [
  {
    location: "Conroe",
    label: "ini dia",
    total: 100,
  },
  {
    location: "Seguin",
    label: "ini di2",
    total: 50,
  },
  {
    location: "Gunter",
    label: "ini di3",
    total: 20,
  },
]
const ProductionTrackerBar = () => {
  const { data: reportData, isLoading: isReportDataLoading } =
    useGetReportByLocation()
  const [selectedTypes, setSelectedType] = useState("units")
  const usedData = reportData ? reportData[selectedTypes] : []
  const highestData = usedData?.length
    ? usedData.reduce((prev: any, data: any) => {
        if (prev.total < data.total) {
          return data
        }
        return prev
      })
    : {}
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl ">Factory Outlook</h2>
      <div className="w-full mx-4 sm:h-40 xl:h-[270px]  flex flex-col">
        <ResponsiveBar
          data={sortBy(usedData, ["total"])}
          layout="horizontal"
          indexBy="locationName"
          keys={["total"]}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          margin={{ top: 10, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          colors={["#0ea5e9", "#a855f7", "#3b82f6"]}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: `${selectedTypes}`,
            legendPosition: "middle",
            legendOffset: 32,
            truncateTickAt: 0,
          }}
          defs={[
            linearGradientDef("highest", [{ offset: 0, color: "#10b981" }]),
          ]}
          fill={[
            {
              match: (d) => {
                return d.key === `total.${highestData.locationName}`
              },
              id: "highest",
            },
          ]}
          labelSkipWidth={12}
          labelSkipHeight={12}
          colorBy="indexValue"
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          }}
          labelTextColor="white"
        />
      </div>
      <div className={"flex gap-4"}>
        <button
          onClick={() => setSelectedType("tons")}
          className={cn("w-40 py-1 rounded-sm", {
            "bg-gray-300": selectedTypes !== "tons",
            "bg-blue-400 text-white": selectedTypes === "tons",
          })}
        >
          Tons
        </button>
        <button
          onClick={() => setSelectedType("units")}
          className={cn(" w-40 py-1 rounded-sm ", {
            "bg-blue-400 text-white": selectedTypes === "units",
            "bg-gray-300": selectedTypes !== "units",
          })}
        >
          units
        </button>
      </div>
    </div>
  )
}

export default ProductionTrackerBar
