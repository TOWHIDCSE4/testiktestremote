import { linearGradientDef } from "@nivo/core"
import { ResponsiveBar } from "@nivo/bar"

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
  const highestData = data.reduce((prev, data) => {
    if (prev.total < data.total) {
      return data
    }
    return prev
  })
  return (
    <div className="w-full mx-4 sm:h-40 xl:h-[270px]  flex flex-col">
      <ResponsiveBar
        data={data}
        layout="horizontal"
        indexBy="location"
        keys={["total"]}
        margin={{ top: 10, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={["#0ea5e9", "#a855f7", "#3b82f6"]}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "unit created",
          legendPosition: "middle",
          legendOffset: 32,
          truncateTickAt: 0,
        }}
        defs={[linearGradientDef("highest", [{ offset: 0, color: "#10b981" }])]}
        fill={[
          {
            match: (d) => {
              return d.key === `total.${highestData.location}`
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
  )
}

export default ProductionTrackerBar
