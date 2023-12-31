import { ResponsiveBar } from "@nivo/bar"
import { linearGradientDef } from "@nivo/core"

const data = [
  {
    location: "Conroe",
    machine_rp1225: 40,
    machine_rp1225Color: "rgba(0,0,0,0)",
    machine_rp1226: 40,
    machine_rp1227: 40,
    machine_rp1228: 40,
  },
  {
    location: "Seguin",
    machine_rp225: 30,
    machine_rp226: 20,
    machine_rp227: 60,
    machine_rp228: 30,
  },
  {
    location: "Gunter",
    machine_rp25: 130,
    machine_rp26: 120,
    machine_rp27: 60,
    machine_rp28: 30,
  },
]
const MachineProductionTracker = () => {
  const allKeys = data.reduce((prev, next: any) => {
    return prev.concat(
      Object.keys(next).filter(
        (k: string) => k !== "location" && !k.includes("Color")
      )
    )
  }, [] as string[])
  return (
    <div className="w-full mx-4 sm:h-40 xl:h-[270px]  flex flex-col">
      <ResponsiveBar
        data={data}
        margin={{ top: 10, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        indexBy="location"
        label={(d) => {
          return d.id.replace("machine_", "")
        }}
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
        keys={allKeys}
        layout="horizontal"
        labelTextColor="white"
      />
    </div>
  )
}

export default MachineProductionTracker
