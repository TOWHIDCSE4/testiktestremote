"use client"

import React, { cache } from "react"
import GaugeChart from "react-gauge-chart"

const ceil = cache((speedInMB: number): number => {
  const baseCeiling = 100
  const orderOfMagnitude = Math.floor(Math.log10(speedInMB))
  let ceiling = baseCeiling * Math.pow(10, orderOfMagnitude - 1)
  ceiling = Math.max(ceiling, baseCeiling)
  return ceiling
})

const SpeedTest = () => {
  const [downloadSpeed, setDownloadSpeed] = React.useState<number>()
  const [latency, setLatency] = React.useState<number>()

  React.useEffect(() => {
    const measureDownloadSpeed = async () => {
      const startTime = Date.now()
      const response = await fetch(
        "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bloemen_van_adderwortel_%28Persicaria_bistorta%2C_synoniem%2C_Polygonum_bistorta%29_06-06-2021._%28d.j.b%29.jpg"
      ) // Replace with a URL to a large file
      const endTime = Date.now()
      const fileSize = 7300000

      if (fileSize) {
        const speedInMbps = (fileSize / (endTime - startTime) / 1024 / 1024) * 8
        setDownloadSpeed(Number(speedInMbps.toFixed(2)))
      }
    }

    measureDownloadSpeed()
    // Set up an interval to measure download speed every 2 seconds
    const intervalId = setInterval(measureDownloadSpeed, 2000)

    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  React.useEffect(() => {
    const measureLatency = async () => {
      const startTime = Date.now()
      try {
        await fetch("https://jsonplaceholder.org/posts")
        const endTime = Date.now()
        const roundTripTime = endTime - startTime
        setLatency(roundTripTime)
      } catch (error) {
        console.error("Error measuring latency:", error)
      }
    }

    measureLatency()
  }, [])
  return (
    <div className="flex flex-col items-center justify-center">
      <GaugeChart
        id="gauge-chart1"
        nrOfLevels={6}
        percent={Number(downloadSpeed) / ceil(Number(downloadSpeed))}
        hideText={true}
        textColor="transparent"
        needleBaseColor="#102136"
        arcPadding={0.015}
        cornerRadius={0}
        arcWidth={0.19}
        formatTextValue={(value) => `${value}%`}
        needleColor="#102136"
        colors={[
          "#87909a",
          "#6f7986",
          "#576372",
          "#3f4d5e",
          "#27374a",
          "#102136",
        ]}
        className="w-32"
        arcsLength={[0.075, 0.075, 0.075, 0.075, 0.075, 0.225]}
        // animateDuration={1000}
      />
      <div className="text-md">({downloadSpeed}Mbps)</div>
      <div className="text-sm">({latency}ms) Latency</div>
    </div>
  )
}

export default SpeedTest
