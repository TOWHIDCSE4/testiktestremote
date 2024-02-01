// @ts-nocheck
"use client"
import { Lato } from "next/font/google"
import { Suspense, useEffect, useLayoutEffect, useState } from "react"
import { BiFullscreen } from "react-icons/bi"
import { LuMoon } from "react-icons/lu"
import combineClasses from "../../../helpers/combineClasses"
import useLocations from "../../../hooks/locations/useLocations"
import useMachineClasses from "../../../hooks/machineClasses/useMachineClasses"
import useGetAllTimersGroup from "../../../hooks/timers/useGetAllTimersGroup"
import MachineClassSelectComponent from "./MachineClassSelect"
import ProductionEyeSettings from "./ProductionEyeSettings"
import ProductionEyeTableFooter from "./ProductionEyeTableFooter"
import ProductionEyeWether from "./ProductionEyeWether"
import TimerTableComponent from "./TimerTable"
import LocationCheckboxComponent from "./production-eye/locationCheckbox"
import { useProductionEyeContext } from "./production-eye/productinEyeContext"

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  subsets: ["latin", "latin-ext"],
})

export default function ProductionEyeComponent() {
  const { data: allTimers } = useGetAllTimersGroup()
  const { data: machineClasses, refetch: refetchMachineClasses } =
    useMachineClasses()
  const { data: locations } = useLocations()

  const {
    selectedLocationIds,
    onSelectLocation,
    primaryLocationId,
    setPrimaryLocationId,
    userProfile,
    primaryFactoryId,
    primaryMachineClassId,
  } = useProductionEyeContext()

  const [oneLocation, setOneLocations] = useState()
  const [selectedCompareLocations, setSelectedCompareLocations] = useState()
  const [compareLocations, setCompareLocations] = useState()

  useEffect(() => {
    if (!primaryLocationId) return
    const selectedOneLocation = allTimers?.items.filter((item) => {
      return item.locationId === primaryLocationId
    })
    setOneLocations(selectedOneLocation)
  }, [primaryLocationId, allTimers])

  useEffect(() => {
    if (selectedLocationIds.length === 1) return
    const selectedCompareLocation = allTimers?.items?.filter((item) => {
      return selectedLocationIds.includes(item.locationId)
    })
    const compareLocation = locations?.items?.filter((item) => {
      return selectedLocationIds.includes(item._id)
    })
    setCompareLocations(compareLocation)
    setSelectedCompareLocations(selectedCompareLocation)
  }, [selectedLocationIds])

  useLayoutEffect(() => {
    console.log("Desktop")
  }, [])

  return (
    <div
      className={combineClasses(
        `${lato.className} mt-6`,
        selectedLocationIds.length <= 1 && "w-[40%]",
        selectedLocationIds.length === 2 && "w-[65%]",
        selectedLocationIds.length === 3 && "w-[100%]"
      )}
    >
      <div className="w-full !font-lato">
        <div className="w-full px-1 py-1 border border-gray-300 rounded-t-2xl">
          <div className="flex items-center w-full gap-4">
            <div className="flex flex-col flex-1">
              <div className="text-3xl font-bold text-center text-red-700 uppercase">
                Production Eye
              </div>
              <ProductionEyeWether />

              <div className="relative flex items-center justify-between px-6">
                <div className="flex items-center flex-1 h-full gap-4">
                  <div className="flex items-center flex-1 gap-3">
                    <ProductionEyeSettings />
                    <button className="flex items-center justify-center w-6 h-6 text-sm text-white bg-black rounded-lg">
                      <LuMoon />
                    </button>
                    <button className="flex items-center justify-center w-6 h-6 text-sm text-white bg-black rounded-lg">
                      <BiFullscreen />
                    </button>
                  </div>
                  <div className="flex flex-col items-center justify-end h-full pt-2 pr-2 text-sm font-bold uppercase lg:pt-0">
                    <div className="leading-4">Active</div>
                    <div className="leading-4">Timers</div>
                  </div>
                </div>
                <div className="flex items-center text-6xl font-bold">
                  {allTimers?.itemCount < 10 ? (
                    <>
                      <span className="text-gray-400">00</span>
                      <span className="text-black">{allTimers.itemCount}</span>
                    </>
                  ) : allTimers?.itemCount > 10 ||
                    allTimers?.itemCount < 100 ? (
                    <>
                      <span className="text-gray-400">0</span>
                      <span className="text-black">{allTimers.itemCount}</span>
                    </>
                  ) : allTimers?.itemCount >= 100 ? (
                    <>
                      <span className="text-black">{allTimers.itemCount}</span>
                    </>
                  ) : (
                    <span className="text-gray-400">000</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-2 bg-slate-700"></div>
        <div className="relative w-full px-4 overflow-hidden">
          <div className="flex items-center justify-around bg-gray-600">
            {locations?.items?.map((location, idx) => (
              <button key={location._id}
                disabled={selectedLocationIds.length > 1}
                onClick={() => {
                  setPrimaryLocationId(location._id)
                  // onSelectLocation(
                  //   location._id,
                  //   location._id === primaryLocationId
                  // )
                }}
                className={combineClasses(
                  "w-full p-2 flex items-center  uppercase cursor-pointer",
                  location._id === primaryLocationId ||
                    (selectedLocationIds.length > 1 &&
                      selectedLocationIds.includes(location._id))
                    ? "bg-gray-300 font-bold text-black"
                    : "text-white"
                )}
              >
                <LocationCheckboxComponent
                  classNames={
                    location._id === primaryLocationId &&
                    selectedLocationIds.length <= 1 &&
                    "hidden"
                  }
                  checked={selectedLocationIds.includes(location._id)}
                  onChange={(checked) =>
                    onSelectLocation(location._id, checked)
                  }
                />

                {location.name}
              </button>
            ))}
          </div>
          <div className="relative flex justify-between w-full px-2 pt-4 overflow-hidden bg-gray-300">
            {selectedLocationIds.length > 1 ? (
              compareLocations?.map((location) => {
                return (
                  <div
                    key={location._id}
                    className="relative flex-1 pb-6 overflow-y-hidden h-80"
                  >
                    <div className="relative w-full h-full pl-2 pr-3 overflow-y-auto scrollbar-w-xs">
                      {selectedCompareLocations
                        ?.filter((item) => {
                          return item.locationId === location._id
                        })
                        ?.sort((a, b) => {
                          const first = a.machineClass?.rowNumber
                          const second = b.machineClass.rowNumber
                          return first - second
                        })
                        ?.map((mc: any, key: number) => {
                          return (
                            <div key={key} className="w-full py-1 pl-1">
                              <div className="text-xs font-black text-red-700 uppercase">
                                {mc.machineClass.name}
                              </div>
                              <div className="relative">
                                <TimerTableComponent
                                  location={location}
                                  machineClass={mc}
                                  timers={mc.timers}
                                />
                              </div>
                            </div>
                          )
                        })}
                    </div>
                    <MachineClassSelectComponent
                      location={location}
                      machineClasses={machineClasses?.items}
                      selectedMachineClasses={allTimers?.items}
                    />
                  </div>
                )
              })
            ) : (
              <Suspense fallback={<div>Loading ...</div>}>
                <div className="relative flex-1 pb-6 overflow-y-hidden h-80">
                  <div className="relative w-full h-full pl-2 pr-3 overflow-y-auto scrollbar-w-xs">
                    {oneLocation?.map((mc: any, key: number) => {
                        return (
                          <div key={key} className="w-full py-1 pl-1">
                            <div className="text-xs font-black text-red-700 uppercase">
                              {mc.machineClass.name}
                            </div>
                            <div className="relative">
                              <TimerTableComponent
                                location={mc.location}
                                machineClass={mc.mc}
                                timers={mc.timers}
                              />
                            </div>
                          </div>
                        )
                      })}
                  </div>
                  <MachineClassSelectComponent
                    location={location}
                    machineClasses={machineClasses?.items}
                    selectedMachineClasses={allTimers?.items}
                  />
                </div>
              </Suspense>
            )}
          </div>
        </div>
        <div className="w-full h-2 bg-slate-700"></div>
        <ProductionEyeTableFooter />
      </div>
    </div>
  )
}
