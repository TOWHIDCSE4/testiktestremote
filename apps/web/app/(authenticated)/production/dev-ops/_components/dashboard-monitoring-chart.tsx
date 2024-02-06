"use client"
import { AreaChart } from "@tremor/react"
import { T_Endpoint } from "../../../../_types"
import React from "react"

interface Props {
  data: T_Endpoint
}

const DashboardMonitoringChart: React.FC<Props> = ({ data }) => {
  const memoizedData = React.useMemo(() => {
    const endpointStatsObj = data.endpointStats
    const resultArray = []

    for (const endpoint in endpointStatsObj) {
      if (endpointStatsObj[endpoint]) {
        const endpointInfo = {
          request_endpoint: endpoint,
          no_of_request: endpointStatsObj[endpoint].requestCount,
          average_response: endpointStatsObj[endpoint].averageResponseTime,
        }
        resultArray.push(endpointInfo)
      }
    }

    return resultArray
  }, [data.endpointStats])

  const chartData = React.useMemo(() => {
    return memoizedData.map((item) => ({
      Endpoint: item.request_endpoint,
      "No Of Requests": item.no_of_request,
      "Average Response": item.average_response,
    }))
  }, [memoizedData])

  return (
    <AreaChart
      className="h-72 p-10"
      data={chartData}
      index="Average Response"
      categories={["Average Response", "Endpoint"]}
      colors={["blue"]}
      showYAxis={true}
      showLegend={false}
      showAnimation={true}
      yAxisWidth={30}
      customTooltip={({ payload, active }) => {
        if (!active || !payload) return null
        return (
          <div className="w-56 rounded-tremor-default text-tremor-default bg-tremor-background p-2 shadow-tremor-dropdown border border-tremor-border">
            {payload.map((category, idx) => (
              <div key={idx} className="flex flex-1 space-x-2.5">
                <div
                  className={`w-1 flex flex-col bg-${category.color}-500 rounded`}
                />
                <div className="space-y-1">
                  <p className="text-tremor-content">{category.dataKey}</p>
                  <p className="font-medium text-tremor-content-emphasis">
                    {category.value?.toString().slice(0, 40)}
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
