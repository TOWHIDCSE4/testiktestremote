"use client"
import { useEffect, useState } from "react"
import NewPartModal from "./modals/NewPartModal"
import useLocations from "../../../../hooks/locations/useLocations"
import Machine from "./Machine"
import combineClasses from "../../../../helpers/combineClasses"
import Part from "./Part"
import NewMachineModal from "./modals/NewMachineModal"
import useStoreSession from "../../../../store/useStoreSession"
import { USER_ROLES } from "../../../../helpers/constants"

type T_LocationTabs = {
  _id?: string
  name: string
  count?: number
}
const PRODUCTION_ADMIN_ROLES = [
  USER_ROLES.Super,
  USER_ROLES.Administrator,
  USER_ROLES.Production,
]

const Content = () => {
  const { data: locations, isLoading: isLocationsLoading } = useLocations()
  const [openNewPartModal, setOpenNewPartModal] = useState(false)
  const [openNewMachineModal, setOpenNewMachineModal] = useState(false)
  const [locationTabs, setLocationTabs] = useState<T_LocationTabs[]>([])
  const [currentLocationTab, setCurrentLocationTab] = useState<string>("")
  const [typeState, setTypeState] = useState("Product")

  const storeSession = useStoreSession((state) => state)

  const tabs = [{ name: "Product" }, { name: "Machine" }]

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
      setCurrentLocationTab(locations?.items[0]?._id as string)
    }
  }, [locations])

  useEffect(() => {
    if (locationTabs.length > 0) {
      setCurrentLocationTab(locationTabs[0]._id as string)
    }
  }, [typeState])

  const currentLocationTabName = locationTabs.find(
    (tab) => tab._id === currentLocationTab
  )?.name
  if (!PRODUCTION_ADMIN_ROLES.includes(storeSession.role))
    return (
      <div className="mt-28">
        <h2 className="text-center">Not authorized to access this page.</h2>
      </div>
    )
  return (
    <div className={`my-20 pb-10`}>
      <div className="content px-4 md:px-7 lg:px-16 2xl:px-44 2xl:max-w-7xl mx-auto mt-28">
        <div className="flex justify-between items-center py-2">
          <div>
            <h2 className="text-gray-800 text-[33px] font-semibold leading-none">
              Product List
            </h2>
            <h4 className="uppercase text-sm text-gray-500 font-medium tracking-widest mt-2">
              Production<span className="text-black mx-2">&gt;</span>Product
              List<span className="text-black mx-2">&gt;</span>
              {typeState}
              <span className="text-black mx-2">&gt;</span>
              <span className="text-red-500">{currentLocationTabName}</span>
            </h4>
          </div>
          <div>
            {typeState === "Product" ? (
              <button
                type="button"
                className="uppercase rounded-md bg-green-700 px-4 md:px-7 py-2 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
                onClick={() => setOpenNewPartModal(true)}
              >
                New Product
              </button>
            ) : (
              <button
                type="button"
                className="uppercase rounded-md bg-green-700 px-4 md:px-7 py-2 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
                onClick={() => setOpenNewMachineModal(true)}
              >
                New Machine
              </button>
            )}
          </div>
        </div>
        <div className="w-full h-0.5 bg-gray-200 mt-5"></div>
        {/* Tabs */}
        <div className="mt-5">
          <nav
            className="isolate flex divide-x divide-gray-200 rounded-md shadow"
            aria-label="Tabs"
          >
            {tabs.map((tab, tabIdx) => (
              <button
                key={tab.name}
                className={combineClasses(
                  tab.name === typeState
                    ? "text-blue-950 bg-gray-200"
                    : "text-gray-500 hover:text-gray-700 bg-white",
                  tabIdx === 0 ? "rounded-l-md" : "",
                  tabIdx === tabs.length - 1 ? "rounded-r-md" : "",
                  "group relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-center font-extrabold hover:bg-gray-300 focus:z-10 text-xl"
                )}
                onClick={() => setTypeState(tab.name)}
              >
                <span>{tab.name}</span>
                <span
                  aria-hidden="true"
                  className={combineClasses(
                    tab.name === typeState ? "bg-blue-950" : "bg-transparent",
                    "absolute inset-x-0 bottom-0 h-1"
                  )}
                />
              </button>
            ))}
          </nav>
        </div>
        {typeState === "Product" ? (
          <Part
            setCurrentLocationTab={setCurrentLocationTab}
            currentLocationTab={currentLocationTab}
            currentLocationTabName={currentLocationTabName}
            locationTabs={locationTabs}
            isLocationsLoading={isLocationsLoading}
          />
        ) : (
          <Machine
            setCurrentLocationTab={setCurrentLocationTab}
            currentLocationTab={currentLocationTab}
            currentLocationTabName={currentLocationTabName}
            locationTabs={locationTabs}
            isLocationsLoading={isLocationsLoading}
          />
        )}
      </div>
      <NewPartModal
        isOpen={openNewPartModal}
        locationState={
          currentLocationTabName ? currentLocationTabName : "Loading..."
        }
        locationId={currentLocationTab}
        onClose={() => setOpenNewPartModal(false)}
      />
      <NewMachineModal
        isOpen={openNewMachineModal}
        locationState={
          currentLocationTabName ? currentLocationTabName : "Loading..."
        }
        locationId={currentLocationTab}
        onClose={() => setOpenNewMachineModal(false)}
      />
    </div>
  )
}

export default Content
