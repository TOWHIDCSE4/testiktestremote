"use client"
import Image from "next/image"
import React, { Suspense, useState } from "react"
import Loader from "../../../../../assets/images/loadGif.gif"
import TimerCard from "./timer-card"

interface Props {
  isCurrentUser: boolean
  group: any
}

const DisplayCurrentUsersTimersSession: React.FC<Props> = ({
  isCurrentUser,
  group,
}) => {
  const [show, setShow] = useState(isCurrentUser)
  return show ? (
    <Suspense
      key={group?.name}
      fallback={
        <div className="bg-stone-500 rounded-md w-full h-[30rem] shadow-md animate-pulse" />
      }
    >
      <h2 className="p-2 bg-white w-full font-semibold text-sm shadow-lg">
        {group?.name}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-2 my-1">
        {group?.timers?.map((timer: any) => (
          <TimerCard key={timer._id} timer={timer} />
        ))}
      </div>
    </Suspense>
  ) : (
    <div className=" p-4 text-center bg-white rounded-lg shadow  sm:p-5 my-4">
      <div className="w-28 h-28 rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center mx-auto mb-3.5">
        <Image src={Loader} alt="loading..." />
      </div>
      <p className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        {group?.name} Simulation already running
      </p>
      <button
        onClick={() => setShow(true)}
        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Show Simulation
      </button>
    </div>
  )
}

export default DisplayCurrentUsersTimersSession
