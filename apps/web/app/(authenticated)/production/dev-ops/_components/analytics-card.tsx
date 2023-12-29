import { Card } from "@mui/material"
import React from "react"

interface Props {
  title: string
}

const AnalyticsCard: React.FC<Props> = ({ title }) => {
  const numbers = [
    28, 18, 20, 17, 19, 25, 27, 10, 12, 14, 16, 11, 13, 7, 9, 15, 21, 23,
  ]

  return (
    <Card variant="outlined" className="p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start space-y-1">
          <h2 className="text-3xl text-black font-semibold">6,789</h2>
          <h4 className="text-xl text-black/60">{title}</h4>
          <p className="text-sm text-black/40 line-clamp-2">
            No. of clicks to ad that consist of a single impression.
          </p>
        </div>
        <div className="flex items-end flex-grow w-40 mt-2 space-x-1 ml-2">
          {numbers.map((n: number) => (
            <div
              key={`bar-${n}`}
              className="relative flex flex-col items-center flex-grow pb-5"
            >
              <div
                className="relative flex justify-center w-1 bg-indigo-300"
                style={{ height: `${n / n + n}px` }}
              />
              <div
                className="relative flex justify-center w-1 bg-blue-950"
                style={{ height: `${n + n}px` }}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default AnalyticsCard
