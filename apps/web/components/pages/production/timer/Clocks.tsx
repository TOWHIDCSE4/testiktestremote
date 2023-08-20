"use client"
import { Dispatch, Fragment, useEffect, useState } from "react"
import { Menu, Transition } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import SetProductionModal from "./modals/SetProductionModal"
import useGetLocation from "../../../../hooks/locations/useGetLocation"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import { T_MachineClass } from "custom-validator"
import FilterCheckbox from "./FilterCheckbox"

const Clocks = ({
  locationId,
  currentLocationTabName,
  machineClasses,
  setSelectedMachineClasses,
  selectedMachineClasses,
}: {
  locationId: string
  currentLocationTabName: string
  machineClasses: T_MachineClass[]
  setSelectedMachineClasses: Dispatch<
    (T_MachineClass & { isSelected: boolean })[]
  >
  selectedMachineClasses: (T_MachineClass & { isSelected: boolean })[]
}) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const [isAllFilterSelected, setIsAllFilterSelected] = useState(true)
  const [openFilter, setOpenFilter] = useState(false)
  const [openSetProduction, setOpenProduction] = useState(false)

  const { data: location, isLoading: isLocationLoading } =
    useGetLocation(locationId)

  const currentDate = dayjs
    .tz(dayjs(), !isLocationLoading ? location.item.timeZone : "")
    .format("MMM DD YYYY")

  const localeTime = dayjs
    .tz(dayjs(), !isLocationLoading ? location.item.timeZone : "")
    .format("hh:mm:ss")

  const handleOnChange = () => {
    const updatedMachineClasses = selectedMachineClasses.map(
      (machineClass: T_MachineClass) => ({
        ...machineClass,
        isSelected: !isAllFilterSelected,
      })
    )
    setSelectedMachineClasses(updatedMachineClasses)
    setIsAllFilterSelected(!isAllFilterSelected)
  }

  return (
    <>
      <div className="flex justify-between pt-4 pb-3 items-center">
        <div>
          <h3 className="text-gray-700 font-bold uppercase">Clocks</h3>
        </div>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => setOpenFilter((openFilter) => !openFilter)}
            >
              Show Only Filter
              <ChevronDownIcon
                className="-mr-1 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>

          <Transition
            show={openFilter}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <div className="relative px-4 py-0.5 flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="all"
                          aria-describedby="all-description"
                          name="all"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-950"
                          defaultChecked
                          onChange={handleOnChange}
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label htmlFor="all" className="text-gray-700">
                          All
                        </label>
                      </div>
                    </div>
                  )}
                </Menu.Item>
                {machineClasses?.map((machineClass, index) => {
                  return (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <FilterCheckbox
                          machineClass={machineClass}
                          isAllSelected={isAllFilterSelected}
                          setSelectedMachineClasses={setSelectedMachineClasses}
                          selectedMachineClasses={selectedMachineClasses}
                        />
                      )}
                    </Menu.Item>
                  )
                })}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-5 mb-4 gap-x-5 gap-y-4 md:gap-y-0">
        <div className="rounded-md bg-white shadow p-2 text-center">
          <h5 className="text-lg text-gray-700 uppercase font-bold">
            {currentDate}
          </h5>
          <h6 className="uppercase text-gray-400 font-medium text-sm">Date</h6>
        </div>
        <div className="rounded-md bg-white shadow p-2 text-center">
          <h5 className="text-lg text-gray-700 uppercase font-bold">
            {localeTime}
          </h5>
          <h6 className="uppercase text-gray-400 font-medium text-sm">
            Local Time
          </h6>
        </div>
        <div className="rounded-md bg-white shadow p-2 text-center">
          <h5 className="text-lg text-gray-700 uppercase font-bold">
            00:00:00
          </h5>
          <h6 className="uppercase text-gray-400 font-medium text-sm">
            Last Updated
          </h6>
        </div>
        <div className="rounded-md bg-white shadow p-2 text-center">
          <h5 className="text-lg text-gray-700 uppercase font-bold">
            00:00:00
          </h5>
          <h6 className="uppercase text-gray-400 font-medium text-sm">
            In Production
          </h6>
        </div>
        <div
          className="rounded-md bg-white shadow p-2 text-center hover:bg-gray-50 cursor-pointer"
          onClick={() => setOpenProduction(true)}
        >
          <h5 className="text-lg text-gray-700 uppercase font-bold">
            {!isLocationLoading ? location.item.productionTime : "0"} Hours
          </h5>
          <h6 className="uppercase text-gray-400 font-medium text-sm">
            Production Time
          </h6>
        </div>
      </div>
      <SetProductionModal
        isOpen={openSetProduction}
        locationId={locationId}
        onClose={() => setOpenProduction(false)}
        currentLocationTabName={currentLocationTabName}
        locationProductionTime={
          !isLocationLoading ? location.item.productionTime : "0"
        }
      />
    </>
  )
}

export default Clocks
