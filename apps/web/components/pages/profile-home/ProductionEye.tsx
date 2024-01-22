import { Lato } from "next/font/google"
import { HiChevronDoubleDown } from "react-icons/hi"
import { BiFullscreen } from "react-icons/bi"
import { LuMenu, LuMoon } from "react-icons/lu"
import useMachineClasses from "../../../hooks/machineClasses/useMachineClasses"
import useLocations from "../../../hooks/locations/useLocations"
import { T_MachineClass } from "custom-validator"
import TimerTableComponent from "./TimerTable"
import MachineClassSelectComponent from "./MachineClassSelect"
const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  subsets: ["latin", "latin-ext"],
})

export default function ProductionEyeComponent() {
  const { data: machineClasses } = useMachineClasses()
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
              <div className="flex gap-4 text-sm">
                <div className="flex gap-2 font-semibold">
                  <div>Area Temp :</div>
                  <div>Seguin :</div>
                  <span className="font-bold">
                    44°
                    <span className="text-xs font-normal align-top">/43°</span>
                  </span>
                </div>
                <div className="flex gap-2 font-semibold">
                  <div>Conroe :</div>
                  <span className="font-bold">
                    44°
                    <span className="text-xs font-normal align-top">/43°</span>
                  </span>
                </div>
                <div className="flex gap-2 font-semibold">
                  <div>Gunter :</div>
                  <span className="font-bold">
                    44°
                    <span className="text-xs font-normal align-top">/43°</span>
                  </span>
                </div>
              </div>
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
              <span className="text-gray-400">0</span>41
            </div>
          </div>
        </div>
        <div className="w-full h-2 bg-slate-700"></div>
        <div className="relative w-full px-4 overflow-hidden">
          <div className="relative flex justify-between w-full px-2 pt-4 overflow-hidden bg-gray-300">
            {locations?.items?.map((location) => (
              <div
                key={location._id}
                className="relative flex-1 px-2 pb-6 overflow-y-hidden h-80"
              >
                <div className="relative w-full h-full overflow-y-auto scrollbar-w-xs">
                  <div className="text-xl font-bold uppercase">
                    {location.name} Timers
                  </div>
                  {machineClasses?.items?.map(
                    (mc: T_MachineClass, key: number) => (
                      <div key={key} className="py-1 pl-1">
                        <div className="text-xs font-black text-red-700 uppercase">
                          {mc.name}
                        </div>
                        <div className="relative">
                          <TimerTableComponent
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
        <div className="flex items-center w-full px-2 py-2 border border-gray-300 rounded-b-2xl">
          <div className="relative flex items-center flex-1">
            <HiChevronDoubleDown className="text-3xl text-gold" />
            <div className="flex flex-col ml-10 font-bold leading-4 uppercase">
              <div>Global</div>
              <div>Rundown</div>
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
            <div className="mx-4"></div>
            <div className="flex items-center gap-8 pl-4 font-bold leading-4 uppercase border-l-4 border-slate-900">
              <div className="flex flex-col">
                <div>Units</div>
                <div className="text-slate-400">00000</div>
              </div>
              <div className="flex flex-col">
                <div>Tons</div>
                <div className="text-slate-400">00000</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col mr-2 text-sm uppercase">
            <div className="flex justify-end gap-1">
              <div className="text-gray-400">January 20 2024 :</div>
              <div className="font-bold">Date</div>
            </div>
            <div className="flex justify-end gap-1">
              <div className="text-gray-400">7:03 AM :</div>
              <div className="font-bold">Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
