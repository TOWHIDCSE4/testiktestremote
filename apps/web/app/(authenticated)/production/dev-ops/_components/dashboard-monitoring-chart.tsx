"use client"
import { AreaChart } from "@tremor/react"

const chartdata3 = [
  { date: "Jan", "Distance Running": 500 },
  { date: "Feb", "Distance Running": 300 },
  { date: "Mar", "Distance Running": 245 },
  { date: "Apr", "Distance Running": 444 },
  { date: "May", "Distance Running": 555 },
  { date: "Jun", "Distance Running": 666 },
  { date: "Jul", "Distance Running": 333 },
  { date: "Aug", "Distance Running": 300 },
  { date: "Sep", "Distance Running": 600 },
  { date: "Oct", "Distance Running": 300 },
  { date: "Nov", "Distance Running": 555 },
  { date: "Dec", "Distance Running": 500 },
]

const DashboardMonitoringChart = () => {
  return (
    <AreaChart
      className="h-72 p-10"
      data={chartdata3}
      index="date"
      categories={["Distance Running"]}
      colors={["blue"]}
      showYAxis={false}
      showLegend={false}
      showAnimation={true}
      yAxisWidth={30}
      customTooltip={({ payload, active }) => {
        if (!active || !payload) return null
        return (
          <div className="w-56 rounded-tremor-default text-tremor-default bg-tremor-background p-2 shadow-tremor-dropdown border border-tremor-border">
            {payload.map((category, idx) => (
              <div key={category.dataKey} className="flex flex-1 space-x-2.5">
                <div
                  className={`w-1 flex flex-col bg-${category.color}-500 rounded`}
                />
                <div className="space-y-1">
                  <p className="text-tremor-content">{category.dataKey}</p>
                  <p className="font-medium text-tremor-content-emphasis">
                    {category.value} bpm
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      }}
    />
  )
}

export default DashboardMonitoringChart
