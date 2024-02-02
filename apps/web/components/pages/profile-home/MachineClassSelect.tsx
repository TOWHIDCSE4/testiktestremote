"use client"
import { useQueryClient } from "@tanstack/react-query"
import { T_MachineClass } from "custom-validator"
import _ from "lodash"
import { ChangeEvent, useEffect, useState } from "react"
import { HiChevronDoubleDown } from "react-icons/hi"
import useGetMachineClassesTotals from "../../../hooks/timerLogs/useGetMachineClassesTotals"
import { useSocket } from "../../../store/useSocket"
import { useProductionEyeContext } from "./production-eye/productinEyeContext"

export default function MachineClassSelectComponent({
  machineClasses,
  location,
  selectedMachineClasses,
}: {
  machineClasses: T_MachineClass[]
  location: {
    _id?: string
    name: string
  }
  selectedMachineClasses: any
}) {
  const {
    selectedLocationIds,
    onSelectLocation,
    primaryLocationId,
    setPrimaryLocationId,
    userProfile,
    primaryFactoryId,
    primaryMachineClassId,
  } = useProductionEyeContext()

  const selectedClasses =
    selectedMachineClasses
      ?.filter((item: any) =>
        selectedLocationIds.length <= 1
          ? item.locationId === primaryLocationId
          : selectedLocationIds.includes(item.locationId) &&
            item.locationId === location._id
      )
      .map((mc: any) => mc.machineClass._id) ?? []

  const queryClient = useQueryClient()
  const socket = useSocket((state: any) => state.instance)
  const {
    setMachineClassId,
    data: machineClassesTotals,
    refetch: refetchMachineClassTotal,
  } = useGetMachineClassesTotals({ locationId: location._id })
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [selectedMachineClassIds, setSelectedMachineClassIds] =
    useState<Array<string>>(selectedClasses)

  useEffect(() => {
    setMachineClassId(selectedClasses)
    setSelectedMachineClassIds(selectedClasses)
  }, [machineClasses, primaryLocationId])

  useEffect(() => {
    setMachineClassId(selectedMachineClassIds)
  }, [selectedMachineClassIds])

  const handleMC = (e: ChangeEvent<HTMLInputElement>) => {
    const tmp = [
      ...selectedMachineClassIds.filter((item) => item != e.target.value),
    ]
    setSelectedMachineClassIds(
      _.uniq(e.target.checked ? [...tmp, e.target.value] : [...tmp])
    )
  }
  const handleAll = () => {
    setSelectedMachineClassIds((prev) =>
      prev.length > 0 ? [] : machineClasses.map((item) => item._id ?? "")
    )
  }

  useEffect(() => {
    const handleTimerEvent = (data: any) => {
      if (data?.message === "refetch") {
        queryClient.invalidateQueries([
          "overall-unit-tons",
          location._id,
          selectedMachineClassIds,
        ])
        // refetchMachineClassTotal()
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

  return (
    <>
      <div
        className={`absolute left-[50%] -translate-x-[50%] bottom-0 transition-all ${
          !isMenuOpen ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="relative justify-between max-w-full text-xs border-2 rounded-t-lg bg-dark-blue border-dark-blue w-fit">
          <button
            className="flex flex-col items-center w-full py-2"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <div className="font-bold text-white uppercase">
              Class Selection
            </div>
            <HiChevronDoubleDown className="text-gold" />
          </button>
          <div className="flex flex-col pb-6 bg-gray-300 border rounded-t-lg border-gold">
            <div className="flex justify-between p-1">
              <button
                onClick={handleAll}
                className="px-3 py-1 text-lg leading-3 bg-white border rounded-lg border-dark-blue"
              >
                All
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                }}
                className="px-3 py-1 text-lg leading-3 bg-white border rounded-lg border-dark-blue"
              >
                OK
              </button>
            </div>
            <div className="relative max-h-[13rem] flex flex-col flex-1 px-4 py-1 gap-1 overflow-auto scrollbar-w-xs">
              {machineClasses?.map((mc: T_MachineClass, idx: number) => (
                <div key={idx} className="flex justify-between gap-1 w-fit">
                  <div className="flex items-center">
                    <input
                      id={location.name + "machineClass" + mc._id}
                      onChange={handleMC}
                      checked={selectedMachineClassIds.includes(
                        mc._id as string
                      )}
                      value={mc._id}
                      // name={location.name + "machineClass"}
                      type="checkbox"
                    />
                    <label
                      htmlFor={location.name + "machineClass" + mc._id}
                      className="px-2 whitespace-nowrap"
                    >
                      {mc.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-[50%] -translate-x-[50%] bottom-0">
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex gap-2 p-1 mx-auto text-lg font-bold text-green-700 uppercase bg-white border border-b-0 rounded-t-lg lg:text-xs w-fit border-slate-600 whitespace-nowrap "
        >
          <div>Total Units: {machineClassesTotals?.item?.units ?? 0}</div>
          <div>
            Total Tons: {machineClassesTotals?.item?.tons?.toFixed(2) ?? 0}
          </div>
        </button>
      </div>
    </>
  )
}
