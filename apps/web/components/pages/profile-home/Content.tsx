"use client"
import { useEffect, useState } from "react"
import useLocation from "../../../hooks/locations/useLocation"
import useProfile from "../../../hooks/users/useProfile"
import PinnedDashboardComponents from "./pinned-dashboard-components/PinnedDashboardComponents"
import isDev from "../../../helpers/isDev"
import { HiChevronDoubleDown } from "react-icons/hi"
import { BiFullscreen } from "react-icons/bi"
import { LuMenu, LuMoon } from "react-icons/lu"
import { Lato } from "next/font/google"
import useMachineClasses from "../../../hooks/machineClasses/useMachineClasses"
import { T_MachineClass } from "custom-validator"
import useGetAllTimersGroup from "../../../hooks/timers/useGetAllTimersGroup"
import useLocations from "../../../hooks/locations/useLocations"
import useTotalTonsUnit from "../../../hooks/timers/useGetAllTimersTonsUnit"
import useGetAllLocationTonsUnits from "../../../hooks/timers/useGetAllLocationsTonsUnits"
import dayjs from "dayjs"
import useGetLocationTotals from "../../../hooks/timers/useGetLocationTotals"

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  subsets: ["latin", "latin-ext"],
})

const Content = () => {
  const { data, isLoading: basicInfoLoading } = useProfile()
  const { data: location, setSelectedLocationId } = useLocation()
  const { data: machineClasses } = useMachineClasses()
  const { data: locations } = useLocations()
  const { data: allTimers } = useGetAllTimersGroup()
  const { data: totalTonsUnit } = useTotalTonsUnit()
  const { data: locationsTotals } = useGetLocationTotals()
  const { data: allLocationTonsUnits } = useGetAllLocationTonsUnits()
  
  useEffect(() => {
    if (data?.item?.locationId)
      setSelectedLocationId(data?.item.locationId as string)
  }, [data])

  const [isMenuOpen, setIsMenuOpen] = useState<Array<boolean>>([
    false,
    false,
    false,
  ])

  const toggleMenuOpen = (index: number) => {
    if (index < 0 || index > 2) return
    // eslint-disable-next-line prefer-const
    let tmp = [...isMenuOpen]
    tmp[index] = !tmp[index]
    console.log(isMenuOpen, [...tmp])
    setIsMenuOpen([...tmp])
  }

  return (
    <>
      <div>
        <div className="content px-4 md:px-7 lg:px-16 2xl:px-44 2xl:max-w-7xl mx-auto mt-28">
          <h1 className="text-gray-800 text-3xl font-bold">
            {!basicInfoLoading ? (
              <>
                {data?.item?.firstName} {data?.item?.lastName} Portal
              </>
            ) : (
              <div className="animate-pulse flex space-x-4">
                <div className="h-9 w-80 bg-slate-200 rounded"></div>
              </div>
            )}
          </h1>
          <h4 className="uppercase text-sm text-gray-500 font-medium tracking-widest mt-2">
            Profile Home
            <span className="text-black mx-2">&gt;</span>
            <span className="text-red-500">{location?.item?.name}</span>
          </h4>
          <div className="w-full h-0.5 bg-gray-200 mt-6"></div>

          <div className={`${lato.className} w-full mt-6`}>
            <div className="w-full !font-lato">
              <div className="w-full rounded-t-2xl border-gray-300 border py-1 px-8">
                <div className="w-full flex items-center gap-4">
                  <div className="flex flex-col flex-1">
                    <div className="text-red-700 uppercase text-3xl font-bold">
                      Production Eye
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="font-semibold flex gap-2">
                        <div>Area Temp :</div>
                        <div>Seguin :</div>
                        <span className="font-bold">
                          44°
                          <span className="text-xs align-top font-normal">
                            /43°
                          </span>
                        </span>
                      </div>
                      <div className="font-semibold flex gap-2">
                        <div>Conroe :</div>
                        <span className="font-bold">
                          44°
                          <span className="text-xs align-top font-normal">
                            /43°
                          </span>
                        </span>
                      </div>
                      <div className="font-semibold flex gap-2">
                        <div>Gunter :</div>
                        <span className="font-bold">
                          44°
                          <span className="text-xs align-top font-normal">
                            /43°
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="self-end flex items-center pb-1 gap-4">
                    <div className="flex items-center gap-3">
                      <button className="flex items-center justify-center text-sm text-white bg-black rounded-lg w-6 h-6">
                        <LuMenu />
                      </button>
                      <button className="flex items-center justify-center text-sm text-white bg-black rounded-lg w-6 h-6">
                        <LuMoon />
                      </button>
                      <button className="flex items-center justify-center text-sm text-white bg-black rounded-lg w-6 h-6">
                        <BiFullscreen />
                      </button>
                    </div>
                    <div className="uppercase text-sm font-bold flex flex-col items-center">
                      <div className="leading-4">Active</div>
                      <div className="leading-4">Timers</div>
                    </div>
                  </div>
                  <div className="flex items-center text-6xl font-bold">
                    {allTimers?.itemCount < 10 ? (
                      <>
                        <span className="text-gray-400">00</span>
                        <span className="text-black">
                          {allTimers.itemCount}
                        </span>
                      </>
                    ) : allTimers?.itemCount > 10 ||
                      allTimers?.itemCount < 100 ? (
                      <>
                        <span className="text-gray-400">0</span>
                        <span className="text-black">
                          {allTimers.itemCount}
                        </span>
                      </>
                    ) : allTimers?.itemCount >= 100 ? (
                      <>
                        <span className="text-black">
                          {allTimers.itemCount}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-400">000</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-700"></div>
              <div className="px-4 w-full relative overflow-hidden">
                <div className="bg-gray-300 relative pt-4 px-2 flex w-full overflow-hidden justify-between">
                  {locations?.items?.map((location, idx) => (
                    <div
                      key={location._id}
                      className="flex-1 relative h-80 overflow-y-hidden px-2 pb-6"
                    >
                      <div className="w-full relative h-full overflow-y-auto scrollbar-w-xs">
                        <div className="font-bold uppercase text-xl">
                          {location.name} Timers
                        </div>
                        {allTimers?.items
                          ?.filter(
                            (item: any) => item.locationId === location._id
                          )
                          .map((item: any, key: number) => (
                            <div key={key} className="pl-1 py-1">
                              <div className="font-black text-red-700 uppercase text-xs">
                                {item.machineClass.name}
                              </div>
                              <div className="relative">
                                <table className="w-full text-xs" key={key}>
                                  <thead className="font-bold">
                                    <td className="px-2">Timer</td>
                                    <td className="">Product</td>
                                    <td className="px-2">Unit</td>
                                    <td className="px-2">Tons</td>
                                    <td></td>
                                  </thead>
                                  <tbody>
                                    {item?.timers?.map(
                                      (timer: any, timerKey: number) => (
                                        <>
                                          <tr
                                            className={
                                              item == 3 ? "opacity-30" : ""
                                            }
                                            key={timerKey}
                                          >
                                            <td
                                              className="px-2 overflow-hidden overflow-ellipsis whitespace-nowrap"
                                              title={timer.machine.name}
                                            >
                                              {timer.machine.name}
                                            </td>
                                            <td
                                              className="line-clamp-1 "
                                              title={timer.part.name}
                                            >
                                              {timer.part.name}
                                            </td>
                                            <td className="px-2">
                                              {totalTonsUnit?.items?.find(
                                                (unit: any) =>
                                                  unit._id === timer._id
                                              )?.units || 0}
                                            </td>
                                            <td className="px-2">
                                              {totalTonsUnit?.items?.find(
                                                (unit: any) =>
                                                  unit._id === timer._id
                                              )?.units || 0}
                                            </td>
                                            <td>
                                              <div
                                                className={`${
                                                  item == 0
                                                    ? "bg-green-600"
                                                    : item == 1
                                                    ? "bg-red-600"
                                                    : item == 2
                                                    ? "bg-yellow-600"
                                                    : "bg-transparent"
                                                } border border-slate-500 rounded-full w-[6px] h-[6px]`}
                                              ></div>
                                            </td>
                                          </tr>
                                        </>
                                      )
                                    )}
                                    <tr className="bg-white bg-opacity-20 font-bold">
                                      <td></td>
                                      <td className="uppercase text-right">
                                        Total
                                      </td>
                                      <td className="px-2">100</td>
                                      <td className="px-2">4960</td>
                                      <td></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div
                        className={`absolute max-w-full overflow-auto left-[50%] -translate-x-[50%] bottom-0 transition-all ${
                          isMenuOpen[idx] ? "translate-y-0" : "translate-y-full"
                        }`}
                      >
                        <div className="bg-white scrollbar-w-xs py-2 pb-16 h-72 overflow-auto flex flex-col relative px-4">
                          <div className="flex gap-1 w-full justify-between">
                            <div>
                              <input
                                name={location.name + "machineClass"}
                                type="radio"
                              />
                            </div>
                            <div className="flex-1 line-clamp-1">All</div>
                          </div>
                          {machineClasses?.items?.map(
                            (mc: T_MachineClass, idx: number) => (
                              <div
                                key={idx}
                                className="flex gap-1 w-full justify-between"
                              >
                                <div>
                                  <input
                                    name={location.name + "machineClass"}
                                    type="radio"
                                  />
                                </div>
                                <div className="flex-1 line-clamp-1">
                                  {mc.name}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <div className="absolute left-[50%] -translate-x-[50%] bottom-0">
                        <button
                          onClick={() => toggleMenuOpen(idx)}
                          className="flex w-fit mx-auto  border-b-0 bg-white rounded-t-lg p-1 border border-slate-600 whitespace-nowrap gap-2 text-green-700 uppercase text-xs font-bold "
                        >
                          <div>Total Units: {(locationsTotals?.item?.find((total: any) => location._id === total._id))?.totalUnits || 0}</div>
                          <div>Total Tons: {(locationsTotals?.item?.find((total: any) => location._id === total._id))?.totalTons?.toFixed(3) || 0}</div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full h-2 bg-slate-700"></div>
              <div className="w-full rounded-b-2xl border-gray-300 border py-2 px-2 flex items-center">
                <div className="flex flex-1 items-center relative">
                  <HiChevronDoubleDown className="text-gold text-3xl" />
                  <div className="leading-4 font-bold uppercase flex flex-col ml-10">
                    <div>Global</div>
                    <div>Rundown</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <div className="uppercase font-bold text-slate-600 text-xs w-16 text-right">
                        Seguin
                      </div>
                      <div className="w-[180px] bg-slate-600 border border-slate-900 h-2"></div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="uppercase font-bold text-slate-800 text-xs w-16 text-right">
                        Conroe
                      </div>
                      <div className="w-[250px] bg-slate-800 border border-slate-900 h-2"></div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="uppercase font-bold text-slate-400 text-xs w-16 text-right">
                        Gunter
                      </div>
                      <div className="w-[130px] bg-slate-400 border border-slate-900 h-2"></div>
                    </div>
                  </div>
                  <div className="mx-4"></div>
                  <div className="flex items-center uppercase font-bold leading-4 gap-8 pl-4 border-l-4 border-slate-900">
                    <div className="flex flex-col">
                      <div>Units</div>
                      <div className="text-slate-400">
                        {allLocationTonsUnits?.item.dailyUnits}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div>Tons</div>
                      <div className="text-slate-400">
                        {allLocationTonsUnits?.item?.tons?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col uppercase text-sm mr-2">
                  <div className="flex justify-end gap-1">
                    <div className="text-gray-400">
                      {dayjs().format("MMMM DD YYYY")} :
                    </div>
                    <div className="font-bold">Date</div>
                  </div>
                  <div className="flex justify-end gap-1">
                    <div className="text-gray-400">
                      {dayjs().format("hh:mm A")} :
                    </div>
                    <div className="font-bold">Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="w-full mt-6">
            <div className="flex flex-col font-bold text-lg">
              <div className="text-green-500">Timer is in Gain State</div>
              <div className="text-red-600">Timer is in Loss State</div>
              <div className="text-yellow-400">
                Timer is in Loss Time/Stop reason State
              </div>
              <div className="text-gray-400">
                Timer Inactive /not started /EndProduction State
              </div>
            </div>
          </div> */}

          {isDev && (
            <div className="w-full h-0.5 bg-gray-200 mt-6">
              <PinnedDashboardComponents />
            </div>
          )}
        </div>
      </div>

      {/* <ProductionLookup /> */}
    </>
  )
}

export default Content
