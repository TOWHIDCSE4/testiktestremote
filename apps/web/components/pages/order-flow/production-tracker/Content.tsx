"use client"
import { useEffect, useMemo, useState } from "react"
import useLocations from "../../../../hooks/locations/useLocations"
import combineClasses from "../../../../helpers/combineClasses"
import NewModal from "./modals/NewModal"
import ParentTable from "./ParentTable"
import useStoreSession from "../../../../store/useStoreSession"
import { USER_ROLES } from "../../../../helpers/constants"
import LogsTable from "./LogsTable"
import useProfile from "../../../../hooks/users/useProfile"
import useLocation from "../../../../hooks/locations/useLocation"
import useCountStatus from "../../../../hooks/jobs/useCountStatus"

const tabs = [
  { name: "Pending" },
  { name: "Active" },
  { name: "Testing" },
  { name: "Archived" },
  { name: "Deleted" },
]

type T_LocationTabs = {
  _id?: string
  name: string
  count?: number
}
const PRODUCTION_TRACKER_ADMIN_ROLES = [
  USER_ROLES.Super,
  USER_ROLES.Administrator,
  USER_ROLES.Production,
  USER_ROLES.Personnel,
]

const Content = () => {
  const { data: locations, isLoading: isLocationsLoading } = useLocations()
  const { data: userProfile, isLoading: isUserProfileLoading } = useProfile()
  const { data: location, setSelectedLocationId } = useLocation()
  const [locationTabs, setLocationTabs] = useState<T_LocationTabs[]>([])
  const [currentLocationTab, setCurrentLocationTab] = useState<string>("")
  const [locationsArray, setLocationsArray] = useState<string[]>([])
  const [renderLogsTable, setRenderLogsTable] = useState(false)
  const [openNewModal, setOpenNewModal] = useState(false)
  const storeSession = useStoreSession((state) => state)

  const {
    reloadCountStatus,
    setJobStatuses,
    setJobLocation,
    data: jobCounts,
    isLoading,
  } = useCountStatus()

  useEffect(() => {
    setJobStatuses(tabs.map((tab) => tab.name))
    setJobLocation(currentLocationTab)
  }, [currentLocationTab])

  const allTabs = useMemo(() => {
    return tabs.map((tab, idx) => {
      return {
        name: tab.name,
        loading: isLoading,
        count: jobCounts ? jobCounts[idx].item : 0,
      }
    })
  }, [jobCounts, isLoading])

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
      if (
        !PRODUCTION_TRACKER_ADMIN_ROLES.includes(
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
      PRODUCTION_TRACKER_ADMIN_ROLES.includes(
        userProfile?.item.role || USER_ROLES.Administrator
      )
    )
      setCurrentLocationTab(location?.item._id || "") // Set based on location item
  }, [location, userProfile])

  useEffect(() => {
    if (userProfile?.item.locationId) {
      setSelectedLocationId(userProfile?.item.locationId as string)
      setCurrentLocationTab(userProfile?.item.locationId as string)
    }
  }, [userProfile])

  const currentLocationTabName = locationTabs.find(
    (tab) => tab._id === currentLocationTab
  )?.name

  useEffect(() => {
    const tempArr: string[] = []
    locations?.items.forEach((location) => {
      tempArr.push(String(location._id))
    })
    setLocationsArray(tempArr)
  }, [setLocationsArray, locations])

  useEffect(() => {
    // If not, render after a 2-second delay
    const delay = setTimeout(() => {
      setRenderLogsTable(true)
    }, 2000)

    // Cleanup the timeout in case the component unmounts
    return () => clearTimeout(delay)
  }, [userProfile])

  const onNewJobCallback = () => {
    reloadCountStatus()
  }

  if (!PRODUCTION_TRACKER_ADMIN_ROLES.includes(storeSession.role))
    return (
      <div className="mt-28">
        <h2 className="text-center">Not authorized to access this page.</h2>
      </div>
    )
  return (
    <>
      <div className={`my-20 pb-10`}>
        <div className="px-4 mx-auto content md:px-7 lg:px-16 2xl:px-44 2xl:max-w-7xl mt-28">
          <div className="flex items-center justify-between py-2">
            <div>
              <h2 className="text-gray-800 text-[33px] font-semibold leading-none">
                Production Tracker
              </h2>
              <h4 className="mt-2 text-sm font-medium tracking-widest text-gray-500 uppercase">
                Order Flow<span className="mx-2 text-black">&gt;</span>
                Production Tracker
                <span className="mx-2 text-black">&gt;</span>
                <span className="text-red-500">{currentLocationTabName}</span>
              </h4>
            </div>
            <div>
              <button
                type="button"
                className="px-4 py-2 font-semibold text-white uppercase bg-green-700 rounded-md shadow-sm disabled:bg-gray-400 md:px-7 hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
                onClick={() => setOpenNewModal(true)}
                disabled={userProfile?.item.role === "Personnel"}
              >
                New Job
              </button>
            </div>
          </div>
          <div className="w-full h-0.5 bg-gray-200 mt-5"></div>
          {/* Location */}
          <div className="grid grid-cols-3 mt-5 gap-x-6 md:gap-x-8 2xl:gap-x-24">
            {/* {locationTabs.map((tab) => {
              const isPersonnelAndLocationMatch =
                userProfile?.item.role === "Personnel" &&
                userProfile?.item.locationId === tab._id

              if (isPersonnelAndLocationMatch) {
                return (
                  <div key={tab.name}>
                    <button
                      type="button"
                      className={combineClasses(
                        "bg-blue-950 text-white",
                        "uppercase rounded-md py-3.5 font-extrabold shadow-sm ring-1 ring-inset ring-gray-200 w-full"
                      )}
                      onClick={() => setCurrentLocationTab(tab._id as string)}
                    >
                      {tab.name} {tab?.count ? `(${tab.count})` : null}
                    </button>
                  </div>
                )
              } else if (userProfile?.item.role !== "Personnel") {
                return (
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
                  </div>
                )
              } else {
                // Return null for tabs that shouldn't be displayed
                return null
              }
            })} */}

            {locationTabs.map((tab) => (
              <div key={tab.name}>
                <button
                  type="button"
                  className={combineClasses(
                    tab._id === currentLocationTab
                      ? "bg-blue-950 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 disabled:text-gray-400",
                    "uppercase rounded-md py-3.5 font-extrabold shadow-sm ring-1 ring-inset ring-gray-200 w-full"
                  )}
                  onClick={() => setCurrentLocationTab(tab._id as string)}
                  disabled={
                    userProfile?.item.role === "Personnel" &&
                    tab._id !== userProfile?.item.locationId
                  }
                >
                  {tab.name} {tab?.count ? `(${tab.count})` : null}
                </button>
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
          <ParentTable locationId={currentLocationTab} allTabs={allTabs} />
          <LogsTable
            locationId={
              userProfile?.item.role === "Personnel" ||
              userProfile?.item.role === "Production"
                ? [currentLocationTab]
                : locationsArray
            }
            userRole={userProfile?.item.role}
            renderData={renderLogsTable}
          />
        </div>
      </div>
      <NewModal
        timer={false}
        isOpen={openNewModal}
        locationState={
          currentLocationTabName ? currentLocationTabName : "Loading..."
        }
        locationId={currentLocationTab}
        onClose={() => setOpenNewModal(false)}
        callback={onNewJobCallback}
      />
    </>
  )
}

export default Content
