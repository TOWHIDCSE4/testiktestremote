import { Lato } from "next/font/google"
import { HiChevronDoubleDown } from "react-icons/hi"
import { BiFullscreen } from "react-icons/bi"
import { LuMenu, LuMoon } from "react-icons/lu"
import useMachineClasses from "../../../hooks/machineClasses/useMachineClasses"
import useLocations from "../../../hooks/locations/useLocations"
import { useEffect, useLayoutEffect, useState } from "react"
import TimerTableMobileComponent from "./TimerTableMobile"
import MachineClassSelectComponent from "./MachineClassSelect"
import useGetAllLocationTonsUnits from "../../../hooks/timers/useGetAllLocationsTonsUnits"
import useWether from "../../../hooks/timers/useWether"
import dayjs from "dayjs"
import { useSocket } from "../../../store/useSocket"
import useGetAllTimersGroup from "../../../hooks/timers/useGetAllTimersGroup"
import useGetLocationTotals from "../../../hooks/timers/useGetLocationTotals"
import TonsUnitsBarChart from "./TonsUnitsBarChart"
import { useQueryClient } from "@tanstack/react-query"
import { useProductionEyeContext } from "./production-eye/productinEyeContext"
import LocationCheckboxComponent from "./production-eye/locationCheckbox"

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  subsets: ["latin", "latin-ext"],
})

export default function ProductionEyeMobileComponent() {
  const queryClient = useQueryClient()
  const socket = useSocket((state: any) => state.instance)
  const [isUnits, setIsUnits] = useState<"tons" | "units">("units")
  const { data: machineClasses } = useMachineClasses()
  const { data: locations } = useLocations()
  const { data: allTimers } = useGetAllTimersGroup()
  const locationBasedUnitsTons = useGetLocationTotals()
  const { data: allLocationTonsUnits, refetch: refetchAllLocationsTonsUnits } =
    useGetAllLocationTonsUnits()
  const gunter = useWether(33.4479, -96.7475)
  const conroe = useWether(30.312927, -95.4560512)
  const seguin = useWether(29.5979964, -98.1041023)

  const {
    selectedLocationIds,
    onSelectLocation,
    primaryLocationId,
    setPrimaryLocationId,
  } = useProductionEyeContext()

  useLayoutEffect(() => {
    console.log("Mobile")
  }, [])

  useEffect(() => {
    const handleTimerEvent = (data: any) => {
      if (data?.message === "refetch") {
        queryClient.invalidateQueries(["all-location-tons-units"])
        // refetchAllLocationsTonsUnits()
      }
    }

    if (socket) {
      socket.on("timer-event", handleTimerEvent)
    }

    return () => {
      if (socket) {
        socket.off("timer-event", handleTimerEvent)
      }
    }
  }, [socket])

  const filteredLocationData = allTimers?.items?.filter(
    (item: { locationId: string | undefined }) =>
      item.locationId === primaryLocationId
  )

  return (
    <div className={`${lato.className} w-full mt-6`}>
      <div className="w-full !font-lato">
        <div className="w-full px-1 py-1 border border-gray-300 rounded-t-2xl">
          <div className="flex items-center w-full gap-4">
            <div className="flex flex-col flex-1">
              <div className="text-3xl font-bold text-center text-red-700 uppercase">
                Production Eye
              </div>
              <div className="flex flex-wrap justify-center gap-1 text-xs">
                <div className="flex !flex-shrink-0 gap-2 font-semibold">
                  <div>Area Temp :</div>
                  <div>Seguin :</div>
                  {seguin.data?.current?.temperature_2m}{" "}
                  <span className="text-xs font-normal align-top">
                    {seguin.data?.current_units?.temperature_2m}
                  </span>
                </div>
                <div className="flex !flex-shrink-0 gap-2 font-semibold">
                  {conroe.data?.current?.temperature_2m}{" "}
                  <span className="text-xs font-normal align-top">
                    {conroe.data?.current_units?.temperature_2m}
                  </span>
                </div>
                <div className="flex !flex-shrink-0 gap-2 font-semibold">
                  {gunter.data?.current?.temperature_2m}{" "}
                  <span className="text-xs font-normal align-top">
                    {" "}
                    {gunter.data?.current_units?.temperature_2m}
                  </span>
                </div>
              </div>

              <div className="relative flex items-center justify-between px-6">
                <div className="flex items-center flex-1 h-full gap-4">
                  <div className="flex items-center flex-1 gap-3">
                    <button className="flex items-center justify-center w-6 h-6 text-sm text-white bg-black rounded-lg">
                      <LuMenu />
                    </button>
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
        <div className="relative w-full px-2 overflow-hidden">
          <div className="relative flex flex-col justify-between w-full overflow-hidden bg-gray-300">
            <div className="sticky top-0 flex justify-between w-full">
              {locations?.items?.map((location, idx) => (
                <div
                  className={`px-4 py-1 flex gap-2 justify-center ${
                    location._id == primaryLocationId
                      ? "font-bold flex-1 text-center text-lg bg-opacity-0"
                      : "text-gray-300"
                  } uppercase ${
                    idx == 0
                      ? "bg-gray-500"
                      : idx == 1
                      ? "bg-gray-700"
                      : "bg-gray-900"
                  }`}
                  key={idx}
                >
                  <button
                    onClick={() => {
                      if (location._id) {
                        setPrimaryLocationId(location._id)
                      }
                    }}
                  >
                    {location.name}
                    {location._id == primaryLocationId && <span>: 12</span>}
                  </button>
                  {location._id && location._id !== primaryLocationId && (
                    <LocationCheckboxComponent
                      classNames=""
                      checked={selectedLocationIds.includes(location._id)}
                      onChange={(checked) =>
                        onSelectLocation(location._id ?? "", checked)
                      }
                    />
                  )}
                </div>
              ))}
            </div>
            {locations?.items?.map((location) =>
              location._id == primaryLocationId ? (
                <div
                  key={location._id}
                  className={`${
                    location._id == primaryLocationId ? "" : "hidden"
                  } px-2 pb-6 overflow-y-hidden h-80 w-full`}
                >
                  <div className="relative w-full h-full overflow-y-auto scrollbar-w-xs">
                    {filteredLocationData?.map((mc: any, key: number) => {
                      return (
                        <div key={key} className="py-1 pl-1">
                          <div className="text-xs font-black text-red-700 uppercase">
                            {mc.machineClass.name}
                          </div>
                          <div className="relative w-full">
                            <TimerTableMobileComponent
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
                    machineClasses={machineClasses?.items.reverse()}
                    selectedMachineClasses={allTimers?.items}
                  />
                </div>
              ) : (
                <></>
              )
            )}
          </div>
        </div>
        <div className="w-full h-2 bg-slate-700"></div>
        <div className="flex flex-col items-center w-full gap-2 px-2 py-2 border border-gray-300 rounded-b-2xl">
          <div className="relative flex flex-col items-center w-full gap-2">
            <div className="relative w-full">
              <HiChevronDoubleDown className="absolute top-0 left-0 text-xl text-gold" />
              <div className="text-2xl font-bold leading-4 text-center uppercase">
                Global Rundown
              </div>
            </div>
            <TonsUnitsBarChart />
            <div className="flex items-center justify-between w-auto gap-8 pl-4 text-2xl font-bold leading-4 uppercase">
              <div className="flex flex-1 gap-2">
                <div>Units</div>
                <div className="text-slate-400">
                  {" "}
                  {allLocationTonsUnits?.item?.dailyUnits}
                </div>
              </div>
              <div className="flex flex-1 gap-2">
                <div>Tons</div>
                <div className="text-slate-400">
                  {allLocationTonsUnits?.item?.tons?.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="flex gap-1 text-sm text-gray-400 uppercase">
              <div className="">{dayjs().format("MMMM DD YYYY")} </div>
              <div>|</div>
              <div className="">{dayjs().format("hh:mm A")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
