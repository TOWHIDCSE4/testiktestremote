"use client"

import useLocations from "../../../../hooks/locations/useLocations"
import { useCallback, useEffect, useMemo, useState } from "react"
import { T_Factory, T_Machine, T_MachineClass } from "custom-validator"
import { HiRefresh, HiXCircle } from "react-icons/hi"
import CustomSelectComponent, { T_SelectItem } from "./CustomSelect"
import useFactories from "../../../../hooks/factories/useFactories"
import _ from "lodash"
import {
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
} from "@mui/material"
import useMachineClasses from "../../../../hooks/machineClasses/useMachineClasses"
import useMachines from "../../../../hooks/machines/useMachines"
import { BiSolidPin } from "react-icons/bi"

const Content = () => {
  const { data: locations, isLoading: isLocationsLoading } = useLocations()
  const { data: machineClasses, isRefetching: isMachineClassesRefetching } =
    useMachineClasses()
  const { data: machines, isLoading: isMachinesLoading } = useMachines()

  const { data: factories, isLoading: isFactoriesLoading } = useFactories()

  // CITY
  const filteredCities = useMemo<Array<T_SelectItem>>(() => {
    if (isLocationsLoading || !locations?.items) return []
    else
      return locations.items.map((item) => ({
        key: item._id ?? "",
        label: item.name,
      }))
  }, [locations, isLocationsLoading])

  const [selectedCity, setSelectedCity] = useState<T_SelectItem>()

  const onCityChange = useCallback(
    (val?: T_SelectItem) => {
      setSelectedCity(val)
    },
    [setSelectedCity]
  )

  // FACTORY
  const [selectedFactories, setSelectedFactories] = useState<T_SelectItem[]>()

  const onFactoryChange = useCallback(
    (val?: T_SelectItem[]) => {
      // console.log (val)
      setSelectedFactories(val)
    },
    [setSelectedFactories]
  )

  const filteredFactories = useMemo<Array<T_SelectItem>>(() => {
    if (isFactoriesLoading || !factories?.items || !selectedCity) return []
    else
      return factories.items.map((item: T_Factory) => ({
        key: item._id ?? "",
        label: item.name,
      }))
  }, [factories, isFactoriesLoading, selectedCity])

  useEffect(() => {
    setSelectedFactories((prev) =>
      prev?.filter((prevItem) =>
        filteredFactories?.some((f) => f.key == prevItem.key)
      )
    )
  }, [filteredFactories, setSelectedFactories])

  // MACHINE CLASS
  const filteredMachineClasses = useMemo<Array<T_SelectItem>>(() => {
    return machineClasses?.items
      ?.filter((item: T_MachineClass) =>
        selectedFactories?.some((factory) => factory.key == item.factoryId)
      )
      ?.map((item: T_MachineClass) => ({
        key: item._id,
        label: item.name,
      }))
  }, [machineClasses, selectedFactories])

  const [selectedMachineClasses, setSelectedMachineClasses] =
    useState<T_SelectItem[]>()

  const onMachineClassChange = useCallback(
    (val?: T_SelectItem[]) => {
      setSelectedMachineClasses(val)
    },
    [setSelectedMachineClasses]
  )
  useEffect(() => {
    setSelectedMachineClasses((prev) =>
      prev?.filter((prevItem) =>
        filteredMachineClasses?.some((mc) => mc.key == prevItem.key)
      )
    )
  }, [filteredMachineClasses, setSelectedMachineClasses])

  // MACHINES

  const [selectedMachines, setSelectedMachines] =
    useState<Array<T_SelectItem>>()

  const filteredMachines = useMemo(() => {
    return machines?.items
      ?.filter(
        (item: T_Machine) =>
          selectedMachineClasses?.some((mc) => mc.key == item.machineClassId) &&
          selectedFactories?.some((f) => f.key == item.factoryId) &&
          item.locationId == selectedCity?.key
      )
      .map((item: T_Machine) => ({
        key: item._id,
        label: item.name,
      }))
  }, [machines, selectedCity, selectedFactories, selectedMachineClasses])

  useEffect(() => {
    setSelectedMachines((prev) =>
      prev?.filter((prevItem) =>
        filteredMachines?.some((m: T_SelectItem) => m.key == prevItem.key)
      )
    )
  }, [filteredMachines, setSelectedMachines])

  const onMachinesChange = useCallback(
    (val?: T_SelectItem[]) => {
      setSelectedMachines(val)
    },
    [setSelectedMachines]
  )

  const [isIncludeCycle, setIsIncludeCycle] = useState<boolean>()
  const [isPinned, setIsPinned] = useState<boolean>()

  return (
    <>
      <div className={`my-20 pb-10`}>
        <div className="px-4 mx-auto content md:px-7 lg:px-16 2xl:px-44 2xl:max-w-7xl mt-28">
          <h1 className="text-3xl font-bold text-gray-800">System Check</h1>
          <h4 className="mt-2 text-sm font-medium tracking-widest text-gray-500 uppercase">
            Production
            <span className="mx-2 text-black">&gt;</span>
            <span className="text-red-500">System Check</span>
          </h4>
          <div className="w-full h-0.5 bg-gray-200 mt-6"></div>
          <div className="relative flex flex-col w-full gap-12 py-4">
            <div className="flex w-full bg-white border border-gray-200 rounded-lg">
              <div className="flex flex-col flex-1 p-4">
                <div className="text-xl font-bold">
                  PRODUCTION REPORT LOOKUP
                </div>
                <div className="flex flex-col flex-1 py-4">
                  {/* BEGIN SELECT */}
                  <div className="grid flex-1 grid-cols-6 mb-4 gap-x-3">
                    <div className="relative col-span-1">
                      <div className="text-sm">City</div>
                      <CustomSelectComponent
                        items={filteredCities}
                        value={selectedCity}
                        onChange={onCityChange}
                      />
                    </div>
                    <div className="relative col-span-1">
                      <div className="text-sm">Factory</div>
                      <CustomSelectComponent
                        multiple
                        items={filteredFactories}
                        value={selectedFactories}
                        onChange={onFactoryChange}
                      />
                    </div>
                    <div className="relative col-span-1">
                      <div className="text-sm">Machine Class</div>
                      <CustomSelectComponent
                        multiple
                        items={filteredMachineClasses}
                        value={selectedMachineClasses}
                        onChange={onMachineClassChange}
                      />
                    </div>
                    <div className="relative col-span-1">
                      <div className="text-sm">Machine</div>
                      <CustomSelectComponent
                        multiple
                        items={filteredMachines}
                        value={selectedMachines}
                        onChange={onMachinesChange}
                      />
                    </div>
                    <div className="relative col-span-1">
                      <div className="text-sm">Include Cycles</div>
                      <div className="px-2">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isIncludeCycle}
                              onChange={(eve) =>
                                setIsIncludeCycle(eve.target.checked)
                              }
                            />
                          }
                          label="Yes"
                        />
                      </div>
                    </div>
                    <div className="relative col-span-1">
                      <div className="text-sm">Review Range</div>
                      <div className="px-2">
                        <Button variant="contained">Today</Button>
                      </div>
                    </div>
                  </div>
                  {/* END SELECT */}
                  <Divider />
                  <div className="flex justify-end p-6">
                    <Button size="small" color="primary" variant="contained">
                      REPORT
                    </Button>
                  </div>
                  <p className="text-xs">Confirm Selection</p>
                  <Divider />
                  {/* BEGIN CONFIRM */}
                  <div className="grid grid-cols-6 gap-x-3">
                    {/* CITY */}
                    <div className="flex flex-col w-full col-span-1 text-xs text-left h-fit">
                      {selectedCity && (
                        <div className="p-1">
                          <Chip
                            label={selectedCity.label}
                            className="text-left 1"
                            variant="outlined"
                            size="small"
                            onDelete={() => {
                              setSelectedCity(undefined)
                            }}
                            deleteIcon={<HiXCircle />}
                          />
                        </div>
                      )}
                    </div>
                    {/* FACTORY */}
                    <div className="flex flex-col w-full col-span-1 text-xs text-left h-fit">
                      {selectedFactories?.map((item) => (
                        <div key={item.key} className="p-1">
                          <Chip
                            label={item.label}
                            className="text-left 1"
                            variant="outlined"
                            size="small"
                            onDelete={() => {
                              setSelectedFactories((prev) => {
                                return prev?.filter(
                                  (previtem) => previtem.key != item.key
                                )
                              })
                            }}
                            deleteIcon={<HiXCircle />}
                          />
                        </div>
                      ))}
                    </div>
                    {/* MACHINE CLASS */}
                    <div className="flex flex-col w-full col-span-1 text-xs text-left h-fit">
                      {selectedMachineClasses?.map((item) => (
                        <div key={item.key} className="p-1">
                          <Chip
                            label={item.label}
                            className="text-left 1"
                            variant="outlined"
                            size="small"
                            onDelete={() => {
                              setSelectedMachineClasses((prev) => {
                                return prev?.filter(
                                  (previtem) => previtem.key != item.key
                                )
                              })
                            }}
                            deleteIcon={<HiXCircle />}
                          />
                        </div>
                      ))}
                    </div>
                    {/* MACHINE */}
                    <div className="flex flex-col w-full col-span-1 text-xs text-left h-fit">
                      {selectedMachines?.map((item) => (
                        <div key={item.key} className="p-1">
                          <Chip
                            label={item.label}
                            className="text-left 1"
                            variant="outlined"
                            size="small"
                            onDelete={() => {
                              setSelectedMachineClasses((prev) => {
                                return prev?.filter(
                                  (previtem) => previtem.key != item.key
                                )
                              })
                            }}
                            deleteIcon={<HiXCircle />}
                          />
                        </div>
                      ))}
                    </div>
                    {/* INCLUDE CYCLE */}
                    <div className="flex flex-col w-full col-span-1 text-xs text-left h-fit">
                      {isIncludeCycle ? "Yes" : "No"}
                    </div>
                    {/* DATE RANGE */}
                    <div className="flex flex-col w-full col-span-1 text-xs text-left h-fit">
                      Today
                    </div>
                  </div>
                  {/* END CONFIRM */}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <IconButton
                  onClick={() => {
                    setIsPinned(!isPinned)
                  }}
                  size="small"
                  color="primary"
                >
                  <BiSolidPin
                    className={`text-blue-900 ${isPinned ? "rotate-90" : ""}`}
                  />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setSelectedCity(undefined)
                  }}
                  size="small"
                  color="primary"
                >
                  <HiRefresh className="text-blue-900" />
                </IconButton>
              </div>
            </div>
            <div className="flex flex-col gap-4"></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Content
