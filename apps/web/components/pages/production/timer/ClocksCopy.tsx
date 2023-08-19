"use client"
import { Fragment, useEffect, useState } from "react"
import { Menu, Transition } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import SetProductionModal from "./modals/SetProductionModal"

function calculateTimeInSeconds(timeInSeconds: number): (number | string)[] {
  let hours: number = Math.floor(timeInSeconds / 3600)
  let minutes: number = Math.floor((timeInSeconds - hours * 3600) / 60)
  let seconds: number = Math.trunc(timeInSeconds - hours * 3600 - minutes * 60)
  let milliseconds: string = (
    timeInSeconds -
    hours * 3600 -
    minutes * 60
  ).toFixed(2)
  let millisecondsOnly = milliseconds.split(".")

  return [
    hours < 10 ? `0${hours}` : hours,
    minutes < 10 ? `0${minutes}` : minutes,
    seconds < 10 ? `0${seconds}` : seconds,
    Number(millisecondsOnly[1]) < 10
      ? `${millisecondsOnly[1]}`
      : millisecondsOnly[1],
  ]
}

const Clocks = ({ locationId }: { locationId: string }) => {
  const [openFilter, setOpenFilter] = useState(false)
  const [openSetProduction, setOpenProduction] = useState(false)

  const [timeInSeconds, setTimeInSeconds] = useState(2553)
  const [timeArray, setTimeArray] = useState<Array<number | string>>([])

  useEffect(() => {
    setTimeArray(calculateTimeInSeconds(timeInSeconds))
  }, [timeInSeconds])

  const [intervalId, setIntervalId] = useState<number>(0)

  const handlePlayButton = (e: object) => {
    const interval: any = setInterval(() => {
      setTimeInSeconds((previousState: number) => previousState + 0.01)
    }, 10)

    setIntervalId(interval)
  }
  const handleStopButton = () => {
    clearInterval(intervalId)
  }
  const handleReset = () => {
    clearInterval(intervalId)
    setTimeInSeconds(0)
  }

  return (
    <>
      <div className="flex justify-between pt-4 pb-3 items-center">
        <div>
          <h3 className="text-gray-700 font-bold uppercase">Clocks</h3>
        </div>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => setOpenFilter((openFilter) => !openFilter)}
            >
              Show Only Filter
              <ChevronDownIcon
                className="-mr-1 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>

          <Transition
            show={openFilter}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <div className="relative px-4 py-0.5 flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="all"
                          aria-describedby="all-description"
                          name="all"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-950"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label htmlFor="all" className="text-gray-700">
                          All
                        </label>
                      </div>
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div className="relative px-4 py-0.5 flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="pipe-box"
                          aria-describedby="pipe-box-description"
                          name="pipe-box"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-950"
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label htmlFor="pipe-box" className="text-gray-700">
                          Pipe And Box
                        </label>
                      </div>
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div className="relative px-4 py-0.5 flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="precast"
                          aria-describedby="precast-description"
                          name="precast"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-950"
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label htmlFor="precast" className="text-gray-700">
                          Precast
                        </label>
                      </div>
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div className="relative px-4 py-0.5 flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="steel-box"
                          aria-describedby="steel-box-description"
                          name="steel-box"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-950"
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label htmlFor="steel-box" className="text-gray-700">
                          Steel
                        </label>
                      </div>
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div className="relative px-4 py-0.5 flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="exterior-box"
                          aria-describedby="exterior-box-description"
                          name="exterior-box"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-950"
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label htmlFor="exterior-box" className="text-gray-700">
                          Exterior
                        </label>
                      </div>
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div className="relative px-4 py-0.5 flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="not-assigned-box"
                          aria-describedby="not-assigned-box-description"
                          name="not-assigned-box"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-950"
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label
                          htmlFor="not-assigned-box"
                          className="text-gray-700"
                        >
                          Not Assigned
                        </label>
                      </div>
                    </div>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-5 mb-4 gap-x-5 gap-y-4 md:gap-y-0">
        <div className="rounded-md bg-white shadow p-2 text-center">
          <h5 className="text-lg text-gray-700 uppercase font-bold">
            AUG 07 2023
          </h5>
          <h6 className="uppercase text-gray-400 font-medium text-sm">Date</h6>
        </div>
        <div className="rounded-md bg-white shadow p-2 text-center">
          <h5 className="text-lg text-gray-700 uppercase font-bold">
            00:00:00
          </h5>
          <h6 className="uppercase text-gray-400 font-medium text-sm">
            Local Time
          </h6>
        </div>
        <div
          className="rounded-md bg-white shadow p-2 text-center cursor-pointer"
          onClick={() => handleStopButton()}
        >
          <h5 className="text-lg text-gray-700 uppercase font-bold">
            00:00:00
          </h5>
          <h6 className="uppercase text-gray-400 font-medium text-sm">
            Last Updated
          </h6>
        </div>
        <div
          className="rounded-md bg-white shadow p-2 text-center cursor-pointer"
          onClick={(e) => handlePlayButton(e)}
        >
          <h5 className="text-lg text-gray-700 uppercase font-bold">
            {timeArray[0]}:{timeArray[1]}:{timeArray[2]}:{timeArray[3]}
          </h5>
          <h6 className="uppercase text-gray-400 font-medium text-sm">
            In Production
          </h6>
        </div>
        <div
          className="rounded-md bg-white shadow p-2 text-center hover:bg-gray-50 cursor-pointer"
          onClick={() => setOpenProduction(true)}
        >
          <h5 className="text-lg text-gray-700 uppercase font-bold">
            14 Hours
          </h5>
          <h6 className="uppercase text-gray-400 font-medium text-sm">
            Production Time
          </h6>
        </div>
      </div>
      <SetProductionModal
        isOpen={openSetProduction}
        onClose={() => setOpenProduction(false)}
        locationId="1234"
        currentLocationTabName="Pipe and Box"
        locationProductionTime="14 Hours"
      />
    </>
  )
}

export default Clocks
