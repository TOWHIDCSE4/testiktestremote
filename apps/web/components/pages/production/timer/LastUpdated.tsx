"use client"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import { hourMinuteSecond } from "../../../../helpers/timeConverter"
import useGetLocationLastUpdate from "../../../../hooks/timers/useGetLocationLastUpdate"

const LastUpdated = ({
  locationId,
  timeZone,
  isLoading,
}: {
  locationId: string
  timeZone: string
  isLoading: boolean
}) => {
  const { data: lastUpdate, isLoading: isLastUpdateLoading } =
    useGetLocationLastUpdate(locationId)

  return (
    <div className="rounded-md bg-white shadow p-2 text-center">
      <h5 className="text-lg text-gray-700 uppercase font-bold">
        {lastUpdate?.item?.createdAt
          ? dayjs
              .tz(dayjs(lastUpdate?.item?.createdAt), timeZone ? timeZone : "")
              .format("HH:mm:ss")
          : "00:00:00"}
      </h5>
      <h6 className="uppercase text-gray-400 font-medium text-sm">
        Last Updated
      </h6>
    </div>
  )
}

export default LastUpdated
