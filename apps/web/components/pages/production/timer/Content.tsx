"use client"
import { useState, useEffect, useMemo } from "react"
import Timers from "./Timers"
import NewModal from "./modals/NewModal"
import useLocations from "../../../../hooks/locations/useLocations"
import combineClasses from "../../../../helpers/combineClasses"
import Clocks from "./Clocks"
import useMachineClasses from "../../../../hooks/machineClasses/useMachineClasses"
import { T_MachineClass } from "custom-validator"
import useStoreSession from "../../../../store/useStoreSession"
import { API_URL_EVENTS, USER_ROLES } from "../../../../helpers/constants"
import useLocation from "../../../../hooks/locations/useLocation"
import useProfile from "../../../../hooks/users/useProfile"
import { useSocket } from "../../../../store/useSocket"
import { usePrefetchTimersByLocation } from "../../../../hooks/timers/useTimersByLocation"
import { TotalsComponent } from "./Totals"

type T_LocationTabs = {
  _id?: string
  name: string
  count?: number
}
const TIMER_ADMIN_ROLES = [
  USER_ROLES.Super,
  USER_ROLES.Administrator,
  USER_ROLES.Production,
  USER_ROLES.Personnel,
]
const TIMER_CITY_ROLES = [USER_ROLES.Personnel, USER_ROLES.Production]

const Content = () => {
  const { data: locations, isLoading: isLocationsLoading } = useLocations()
  const [locationTabs, setLocationTabs] = useState<T_LocationTabs[]>([])
  const [openNewModal, setOpenNewModal] = useState(false)
  const [currentLocationTab, setCurrentLocationTab] = useState<string>("")
  const [selectedMachineClasses, setSelectedMachineClasses] = useState<
    (T_MachineClass & { isSelected: boolean })[]
  >([])
  const socket = useSocket((state) => state.instance)
  const storeSession = useStoreSession((state) => state)
  const { data: location, setSelectedLocationId } = useLocation()
  const { data: userProfile, isLoading: isUserProfileLoading } = useProfile()
  const { data: machineClasses, isLoading: isMachineClassesLoading } =
    useMachineClasses()
  const { prefetch: prefetchTimerByLocations } = usePrefetchTimersByLocation()

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
        locations.items.forEach((location) => {
          prefetchTimerByLocations(location._id as string)
        })
      }
      if (
        !TIMER_CITY_ROLES.includes(
          userProfile?.item.role
            ? userProfile?.item.role
            : USER_ROLES.Administrator
            ? USER_ROLES.Administrator
            : USER_ROLES.Super
        )
      )
        setCurrentLocationTab(locations?.items[0]?._id as string)
    }
  }, [locations])

  useEffect(() => {
    if (
      TIMER_CITY_ROLES.includes(
        userProfile?.item.role || USER_ROLES.Administrator
      )
    )
      setCurrentLocationTab(location?.item._id || "")
  }, [location])

  useEffect(() => {
    if (userProfile) {
      setCurrentLocationTab(userProfile.item.locationId as string)
    }
  }, [userProfile])

  useEffect(() => {
    if (
      !isMachineClassesLoading &&
      machineClasses?.items &&
      machineClasses?.items.length > 0
    ) {
      const updatedMachineClasses = machineClasses?.items?.map(
        (machineClass: T_MachineClass) => ({
          ...machineClass,
          isSelected: true,
        })
      )
      if (storeSession?.role === "Personnel") {
        const personnelMachineClass = updatedMachineClasses.filter(
          (machineClass: any) =>
            machineClass._id === userProfile?.item?.machineClassId
        )
        setSelectedMachineClasses(personnelMachineClass)
      } else {
        setSelectedMachineClasses(updatedMachineClasses)
      }
    }
  }, [machineClasses, userProfile])

  useEffect(() => {
    if (userProfile?.item.locationId) {
      setSelectedLocationId(userProfile?.item.locationId as string)
    }
  }, [userProfile])

  const currentLocationTabName = locationTabs.find(
    (tab) => tab._id === currentLocationTab
  )?.name
  const isTimerCityRoles = useMemo(() => {
    return TIMER_CITY_ROLES.includes(
      userProfile?.item.role || USER_ROLES.Administrator
    )
  }, [userProfile])
  if (!TIMER_ADMIN_ROLES.includes(storeSession.role))
    return (
      <div className="mt-28">
        <h2 className="text-center">Not authorized to access this page.</h2>
      </div>
    )
  return (
    <div className={`my-20 pb-10`}>
      <div className="px-4 mx-auto content md:px-7 lg:px-16 2xl:px-44 2xl:max-w-7xl mt-28">
        <div className="flex items-center justify-between py-2">
          <div>
            <h2 className="text-gray-800 text-[33px] font-semibold leading-none">
              Timer and Analytics
            </h2>
            <h4 className="mt-2 text-sm font-medium tracking-widest text-gray-500 uppercase">
              Production<span className="mx-2 text-black">&gt;</span>Timer
              <span className="mx-2 text-black">&gt;</span>
              <span className="text-red-500">{currentLocationTabName}</span>
            </h4>
          </div>
          <div>
            {/* {userProfile?.item.role !== USER_ROLES.Personnel && ( */}
            <button
              type="button"
              className="px-4 py-2 font-semibold text-white uppercase bg-green-700 rounded-md shadow-sm disabled:bg-gray-400 md:px-7 hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
              onClick={() => setOpenNewModal(true)}
              disabled={userProfile?.item.role === "Personnel"}
            >
              New Timer
            </button>
            {/* )} */}
          </div>
        </div>
        <div className="w-full h-0.5 bg-gray-200 mt-5"></div>
        {/* Location */}
        <div className="grid grid-cols-3 mt-5 gap-x-6 md:gap-x-8 2xl:gap-x-24">
          {locationTabs.map((tab) => (
            <div key={tab._id}>
              <button
                type="button"
                className={combineClasses(
                  tab._id === currentLocationTab
                    ? "bg-blue-950 text-white"
                    : isTimerCityRoles
                    ? "bg-white disabled:text-gray-400"
                    : "bg-white text-gray-700 hover:bg-gray-50",
                  "uppercase rounded-md py-3.5 font-extrabold shadow-sm ring-1 ring-inset ring-gray-200 w-full"
                )}
                onClick={() => setCurrentLocationTab(tab._id as string)}
                disabled={
                  isTimerCityRoles &&
                  userProfile?.item.role === "Personnel" &&
                  tab._id !== userProfile?.item.locationId
                }
              >
                {tab.name} {tab?.count ? `(${tab.count})` : null}
              </button>
              <div className="flex mt-1">
                <div className="flex items-center h-6">
                  <input
                    id="compare"
                    aria-describedby="compare-description"
                    name="compare"
                    type="checkbox"
                    disabled={
                      isTimerCityRoles && tab.name !== location?.item.name
                    }
                    className="w-4 h-4 border-gray-300 rounded text-blue-950 focus:ring-1 focus:ring-blue-950"
                  />
                </div>
                <div className="ml-2 text-xs leading-6 md:ml-3 md:text-sm">
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
              <div className="flex space-x-4 animate-pulse">
                <div className="w-full rounded h-14 bg-slate-200"></div>
              </div>
              <div className="flex space-x-4 animate-pulse">
                <div className="w-full rounded h-14 bg-slate-200"></div>
              </div>
              <div className="flex space-x-4 animate-pulse">
                <div className="w-full rounded h-14 bg-slate-200"></div>
              </div>
            </>
          )}
        </div>
        <div className="w-full h-[1.5px] bg-gray-200 mt-5"></div>
        <Clocks
          locationId={currentLocationTab}
          currentLocationTabName={currentLocationTabName as string}
          machineClasses={
            storeSession?.role === "Personnel"
              ? machineClasses?.items?.filter(
                  (machineClass: any) =>
                    machineClass._id === userProfile?.item?.machineClassId
                )
              : machineClasses?.items
          }
          setSelectedMachineClasses={setSelectedMachineClasses}
          selectedMachineClasses={selectedMachineClasses}
        />
        <TotalsComponent locationId={currentLocationTab} />
        <div className="w-full h-[2.2px] bg-gray-200"></div>
        <Timers
          locationName={currentLocationTabName ?? ""}
          locationId={currentLocationTab}
          machineClasses={selectedMachineClasses}
        />
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
