import { Lato } from "next/font/google"
import { HiChevronDoubleDown } from "react-icons/hi"
import { BiFullscreen } from "react-icons/bi"
import { LuMenu, LuMoon } from "react-icons/lu"
import useMachineClasses from "../../../hooks/machineClasses/useMachineClasses"
import useLocations from "../../../hooks/locations/useLocations"
import { useEffect, useState } from "react"
import { T_MachineClass } from "custom-validator"
import TimerTableMobileComponent from "./TimerTableMobile"
import MachineClassSelectComponent from "./MachineClassSelect"
const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  subsets: ["latin", "latin-ext"],
})

export default function ProductionEyeMobileComponent() {
  const { data: machineClasses } = useMachineClasses()
  const { data: locations } = useLocations()

  const [selectedLocationId, setSelectedLocationId] = useState<string>()
  useEffect(() => {
    if (!selectedLocationId && locations?.items && locations.items.length > 0) {
      setSelectedLocationId(locations.items[0]._id)
    }
  }, [locations, selectedLocationId])

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
                  <span className="font-bold">
                    44°
                    <span className="text-xs font-normal align-top">/43°</span>
                  </span>
                </div>
                <div className="flex !flex-shrink-0 gap-2 font-semibold">
                  <div>Conroe :</div>
                  <span className="font-bold">
                    44°
                    <span className="text-xs font-normal align-top">/43°</span>
                  </span>
                </div>
                <div className="flex !flex-shrink-0 gap-2 font-semibold">
                  <div>Gunter :</div>
                  <span className="font-bold">
                    44°
                    <span className="text-xs font-normal align-top">/43°</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between px-6">
                <div className="flex items-center flex-1 gap-4">
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
                  <div className="flex flex-col items-center text-sm font-bold uppercase">
                    <div className="leading-4">Active</div>
                    <div className="leading-4">Timers</div>
                  </div>
                </div>
                <div className="flex items-center ml-4 text-5xl font-bold">
                  <span className="text-gray-400">0</span>41
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
                <button
                  className={`px-4 py-1 ${
                    location._id == selectedLocationId
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
                  onClick={() => {
                    setSelectedLocationId(location._id)
                  }}
                >
                  {location.name}
                  {location._id == selectedLocationId && <span>: 12</span>}
                </button>
              ))}
            </div>
            {locations?.items?.map((location) => (
              <div
                key={location._id}
                className={`${
                  location._id == selectedLocationId ? "" : "hidden"
                } px-2 pb-6 overflow-y-hidden h-80 w-full`}
              >
                <div className="relative w-full h-full overflow-y-auto scrollbar-w-xs">
                  {machineClasses?.items?.map(
                    (mc: T_MachineClass, key: number) => (
                      <div key={key} className="py-1 pl-1">
                        <div className="text-xs font-black text-red-700 uppercase">
                          {mc.name}
                        </div>
                        <div className="relative w-full">
                          <TimerTableMobileComponent
                            location={location}
                            machineClass={mc}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
                <MachineClassSelectComponent
                  location={location}
                  machineClasses={machineClasses?.items}
                />
              </div>
            ))}
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
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <div className="w-16 text-xs font-bold text-right uppercase text-slate-600">
                  Seguin
                </div>
                <div className="w-[180px] bg-slate-600 border border-slate-900 h-2"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-16 text-xs font-bold text-right uppercase text-slate-800">
                  Conroe
                </div>
                <div className="w-[250px] bg-slate-800 border border-slate-900 h-2"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-16 text-xs font-bold text-right uppercase text-slate-400">
                  Gunter
                </div>
                <div className="w-[130px] bg-slate-400 border border-slate-900 h-2"></div>
              </div>
            </div>
            <div className="flex items-center justify-between w-full gap-8 pl-4 text-2xl font-bold leading-4 uppercase">
              <div className="flex flex-1 gap-2">
                <div>Units</div>
                <div className="text-slate-400">00000</div>
              </div>
              <div className="flex flex-1 gap-2">
                <div>Tons</div>
                <div className="text-slate-400">00000</div>
              </div>
            </div>
            <div className="flex gap-1 text-sm text-gray-400 uppercase">
              <div className="">January 20 2024 </div>
              <div>|</div>
              <div className="">7:03 AM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
