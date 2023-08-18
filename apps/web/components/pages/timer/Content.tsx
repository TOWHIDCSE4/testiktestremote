"use client"
import { Fragment, useState, useEffect } from "react"
import { Menu, Transition } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import Timers from "./Timers"
import NewModal from "./modals/NewModal"
import SetProductionModal from "./modals/SetProductionModal"
import useLocations from "../../../hooks/locations/useLocations"
import combineClasses from "../../../helpers/combineClasses"
import Clocks from "./Clocks"

type T_LocationTabs = {
  _id?: string
  name: string
  count?: number
}

const Content = () => {
  const { data: locations, isLoading: isLocationsLoading } = useLocations()
  const [locationTabs, setLocationTabs] = useState<T_LocationTabs[]>([])
  const [openNewModal, setOpenNewModal] = useState(false)
  const [currentLocationTab, setCurrentLocationTab] = useState<string>("")

  useEffect(() => {
    if (locationTabs.length === 0) {
      if (locations) {
        setLocationTabs(
          locations.items.map((location) => ({
            _id: location._id,
            name: location.name,
            count: 0,
          }))
        )
      }
      // setPartLocationIds(
      //   locations?.items?.map((location) => location._id) as string[]
      // )
      setCurrentLocationTab(locations?.items[0]?._id as string)
    }
  }, [locations])
  const currentLocationTabName = locationTabs.find(
    (tab) => tab._id === currentLocationTab
  )?.name

  return (
    <div className={`my-20`}>
      <div className="content px-4 md:px-7 lg:px-16 2xl:px-44 2xl:max-w-7xl mx-auto mt-28 ">
        <div className="flex justify-between items-center py-2">
          <div>
            <h2 className="text-gray-800 text-[33px] font-semibold leading-none">
              Timer and Analytics
            </h2>
            <h4 className="uppercase text-sm text-gray-500 font-medium tracking-widest mt-2">
              Production<span className="text-black mx-2">&gt;</span>Timer
              <span className="text-black mx-2">&gt;</span>
              <span className="text-red-500">{currentLocationTabName}</span>
            </h4>
          </div>
          <div>
            <button
              type="button"
              className="uppercase rounded-md bg-green-700 px-4 md:px-7 py-2 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
              onClick={() => setOpenNewModal(true)}
            >
              New Timer
            </button>
          </div>
        </div>
        <div className="w-full h-0.5 bg-gray-200 mt-5"></div>
        {/* Location */}
        <div className="grid grid-cols-3 gap-x-6 md:gap-x-8 2xl:gap-x-24 mt-5">
          {locationTabs.map((tab) => (
            <div key={tab.name}>
              <button
                type="button"
                className={combineClasses(
                  tab._id === currentLocationTab
                    ? "bg-blue-950 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50",
                  "uppercase rounded-md py-3.5 font-extrabold shadow-sm ring-1 ring-inset ring-gray-200 w-full"
                )}
                onClick={() => setCurrentLocationTab(tab._id as string)}
              >
                {tab.name} {tab?.count ? `(${tab.count})` : null}
              </button>
              <div className="flex mt-1">
                <div className="flex h-6 items-center">
                  <input
                    id="compare"
                    aria-describedby="compare-description"
                    name="compare"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-950"
                  />
                </div>
                <div className="ml-2 md:ml-3 text-xs md:text-sm leading-6">
                  <label
                    htmlFor="compare"
                    className="font-medium text-gray-900 uppercase"
                  >
                    Compare
                  </label>
                </div>
              </div>
            </div>
          ))}
          {isLocationsLoading && (
            <>
              <div className="animate-pulse flex space-x-4">
                <div className="h-14 w-full rounded bg-slate-200"></div>
              </div>
              <div className="animate-pulse flex space-x-4">
                <div className="h-14 w-full rounded bg-slate-200"></div>
              </div>
              <div className="animate-pulse flex space-x-4">
                <div className="h-14 w-full rounded bg-slate-200"></div>
              </div>
            </>
          )}
        </div>
        <div className="w-full h-[1.5px] bg-gray-200 mt-5"></div>
        <Clocks locationId={currentLocationTab} />
        <div className="w-full h-[2.2px] bg-gray-200"></div>
        <Timers locationId={currentLocationTab} />
      </div>
      <NewModal
        isOpen={openNewModal}
        locationState={
          currentLocationTabName ? currentLocationTabName : "Loading..."
        }
        locationId={currentLocationTab}
        onClose={() => setOpenNewModal(false)}
      />
    </div>
  )
}

export default Content
