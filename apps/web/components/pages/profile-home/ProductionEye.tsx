// @ts-nocheck
"use client"
import { Lato } from "next/font/google"
import { BiFullscreen } from "react-icons/bi"
import { LuMenu, LuMoon } from "react-icons/lu"
import useMachineClasses from "../../../hooks/machineClasses/useMachineClasses"
import useLocations from "../../../hooks/locations/useLocations"
import TimerTableComponent from "./TimerTable"
import MachineClassSelectComponent from "./MachineClassSelect"
import _ from "lodash"
import useGetAllTimersGroup from "../../../hooks/timers/useGetAllTimersGroup"
import ProductionEyeTableFooter from "./ProductionEyeTableFooter"
import ProductionEyeWether from "./ProductionEyeWether"

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

  return (
    <div className={`${lato.className} w-full mt-6`}>
      <div className="w-full !font-lato">
        <div className="w-full px-8 py-1 border border-gray-300 rounded-t-2xl">
          <div className="flex items-center w-full gap-4">
            <div className="flex flex-col flex-1">
              <div className="text-3xl font-bold text-red-700 uppercase">
                Production Eye
              </div>
              <ProductionEyeWether />
            </div>
            <div className="flex items-center self-end gap-4 pb-1">
              <div className="flex items-center gap-3">
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
              <div className="flex flex-col items-center text-sm font-bold uppercase">
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
              ) : allTimers?.itemCount > 10 || allTimers?.itemCount < 100 ? (
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
        <div className="w-full h-2 bg-slate-700"></div>
        <div className="relative w-full px-4 overflow-hidden">
          <div className="relative flex justify-between w-full px-2 pt-4 overflow-hidden bg-gray-300">
            {locations?.items?.map((location) => {
              return (
                <div
                  key={location._id}
                  className="relative flex-1 px-2 pb-6 overflow-y-hidden h-80"
                >
                  <div className="relative w-full h-full overflow-y-auto scrollbar-w-xs">
                    <div className="flex gap-2">
                      <div className="text-xl font-bold uppercase">
                        {location.name} Timers
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-3 h-3 bg-white border-2 border-white shadow-sm shadow-gray-500 peer peer-checked:bg-black"></div>
                      </label>
                    </div>
                    {allTimers?.items
                      ?.filter((item: any) => item.locationId === location._id)
                      ?.map((mc: any, key: number) => {
                        return (
                          <div key={key} className="py-1 pl-1">
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
            })}
          </div>
        </div>
        <div className="w-full h-2 bg-slate-700"></div>
        <ProductionEyeTableFooter />
      </div>
    </div>
  )
}
