import { Card } from "@mui/material"
import React from "react"
import AnalyticsCard from "./analytics-card"

const Analytics: React.FC<{}> = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2">
      {[
        { key: 123, title: "Success Rate" },
        { key: 123, title: "Failure Rate" },
        { key: 123, title: "Performance Score" },
      ].map((card) => (
        <AnalyticsCard key={card.key} title={card.title} />
      ))}
    </div>
  )
}

export default Analytics
