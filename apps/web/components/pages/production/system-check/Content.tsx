"use client"

import {
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
} from "@mui/material"
import { T_Factory, T_Machine, T_MachineClass, T_Part } from "custom-validator"
import Cookies from "js-cookie"
import { useCallback, useEffect, useMemo, useState, useRef } from "react"
import { BiSolidPin } from "react-icons/bi"
import { HiRefresh, HiXCircle } from "react-icons/hi"
import { API_URL_PARTS } from "../../../../helpers/constants"
import useFactories from "../../../../hooks/factories/useFactories"
import useLocations from "../../../../hooks/locations/useLocations"
import useMachineClasses from "../../../../hooks/machineClasses/useMachineClassesByLocation"
import useMachines from "../../../../hooks/machines/useMachines"
import CustomSelectComponent, { T_SelectItem } from "./CustomSelect"
import SystemReport from "./Report/SystemReport"
import NewWindow from "react-new-window"
import useGlobalTimerLogsMulti from "../../../../hooks/timerLogs/useGetGlobalTimerLogsMultiFilter"

type T_Dispaly_Part_Types = {
  key: string
  label: string
}

const Content = () => {
  const myRef = useRef<NewWindow | null>(null)
  const [parts, setParts] = useState<T_Part[]>()
  const [part, onPartChange] = useState()
  const [selectedCity, setSelectedCity] = useState<T_SelectItem | undefined>()
  const [showReport, setShowReport] = useState(false)
  const [selectedFactories, setSelectedFactories] = useState<T_SelectItem[]>()
  const [selectedMachineClasses, setSelectedMachineClasses] = useState<
    T_SelectItem[] | undefined
  >()

  const [selectedMachines, setSelectedMachines] = useState<
    T_SelectItem[] | undefined
  >()
  const [selectedParts, setSelectedParts] = useState<T_SelectItem[]>()
  const [isIncludeCycle, setIsIncludeCycle] = useState<boolean>()
  const [isPinned, setIsPinned] = useState<boolean>()
  const [keyword, setKeyword] = useState<string>("")
  const [sortType, setSortType] = useState<string>("")

  const { data: locations, isLoading: isLocationsLoading } = useLocations()
  const { data: machines, isLoading: isMachinesLoading } = useMachines()
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  const { data: machineClasses, isLoading: isMachineClassesLoading } =
    useMachineClasses([selectedCity?.key] as string[])

  function objectToArray(obj: any) {
    return obj ? [obj?.key] : []
  }

  const cityArray = objectToArray(selectedCity)

  const machineClassSelectedIds = selectedMachineClasses?.map(
    (selectedMachineClass) => selectedMachineClass.key
  )

  const machineSelectedIds = selectedMachines?.map((machineId) => machineId.key)
  const partsSelectedIds = selectedParts?.map((partsId) => partsId.key)
  // console.log("Machine Selected ======>>>>>", partsSelectedIds)

  const process = true

  const {
    data: paginated,
    isLoading: isPaginatedLoading,
    isRefetching: isPaginatedRefetching,
    page,
    setPage,
    setFactoryId,
    setMachineClassId,
    setMachineId,
    setStartDateRange,
    setEndDateRange,
    setPartId,
  } = useGlobalTimerLogsMulti(cityArray, sortType, keyword, process)

  // CITY
  const filteredCities = useMemo<Array<T_SelectItem>>(() => {
    if (isLocationsLoading || !locations?.items) {
      return []
    } else {
      return locations.items.map((item) => ({
        key: item._id ?? "",
        label: item.name,
      }))
    }
  }, [locations, isLocationsLoading])

  const filteredFactories = useMemo<Array<T_SelectItem>>(() => {
    if (isFactoriesLoading || !factories?.items || !selectedCity) {
      return []
    } else {
      return factories.items.map((item: T_Factory) => ({
        key: item._id ?? "",
        label: item.name,
      }))
    }
  }, [factories, isFactoriesLoading, selectedCity])

  useEffect(() => {
    setSelectedFactories((prev) =>
      prev?.filter((prevItem) =>
        filteredFactories?.some((f) => f.key == prevItem.key)
      )
    )
  }, [filteredFactories])

  // MACHINE CLASS
  const filteredMachineClasses = useMemo<Array<T_SelectItem>>(() => {
    return machineClasses?.items
      ?.filter((item: T_MachineClass) => selectedCity?.key === item.factoryId)
      ?.map((item: T_MachineClass) => ({
        key: item._id,
        label: item.name,
      }))
  }, [machineClasses, selectedCity])

  useEffect(() => {
    if (machineClassSelectedIds !== undefined) {
      setMachineClassId(machineClassSelectedIds)
    }
    console.log("MACHINE CLASS IDS=====>>>", machineClassSelectedIds)
  }, [machineClassSelectedIds])

  useEffect(() => {
    setSelectedMachineClasses((prev) =>
      prev?.filter((prevItem) =>
        filteredMachineClasses?.some((mc) => mc.key == prevItem.key)
      )
    )
  }, [filteredMachineClasses])

  // MACHINES

  const filteredMachines = useMemo(() => {
    const keysToMachine = selectedMachineClasses?.map((item: any) => item.key)
    return machines?.items
      ?.filter((item: any) => keysToMachine?.includes(item.machineClassId))
      .map((item: T_Machine) => ({
        key: item._id,
        label: item.name,
      }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machines, selectedCity, selectedFactories, selectedMachineClasses])

  useEffect(() => {
    if (machineSelectedIds !== undefined) {
      setMachineId(machineSelectedIds)
    }
  }, [machineSelectedIds])

  useEffect(() => {
    setSelectedMachines((prev) =>
      prev?.filter((prevItem) =>
        filteredMachines?.some((m: T_SelectItem) => m.key == prevItem.key)
      )
    )
  }, [filteredMachines])

  useEffect(() => {
    if (partsSelectedIds !== undefined) {
      setPartId(partsSelectedIds)
    }
  }, [partsSelectedIds])

  useEffect(() => {
    setSelectedParts((prev) =>
      prev?.filter((prevItem) =>
        selectedParts?.some((m: T_SelectItem) => m.key == prevItem.key)
      )
    )
  }, [selectedParts])

  useEffect(() => {
    const token = Cookies.get("tfl")
    const locationsQuery = new URLSearchParams({
      locations: selectedCity?.key as string,
    }).toString()

    const machineClassesQuery = new URLSearchParams({
      machineClasses: machineClasses?.items.map((machine: any) => machine._id),
    }).toString()

    const fetchData = async () => {
      if (!selectedCity) return
      let page = 1

      const res = await fetch(
        `${API_URL_PARTS}/by/location-machine-class?page=${page}&${machineClassesQuery}&${locationsQuery}`,
        // &search=${search}&startDate=${startDate}&endDate=${endDate},
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const responseJSON = await res.json()
      setParts(responseJSON.items)
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, filteredMachineClasses, machines])

  const onCityChange = useCallback(
    (val?: T_SelectItem) => setSelectedCity(val),
    [setSelectedCity]
  )
  const onMachineClassChange = useCallback(
    (val?: T_SelectItem[]) => {
      setSelectedMachineClasses(val)
    },
    [setSelectedMachineClasses]
  )
  const onChangePart = useCallback(
    (val?: T_SelectItem[]) => setSelectedParts(val),
    [setSelectedParts]
  )
  const onMachinesChange = useCallback(
    (val?: T_SelectItem[]) => setSelectedMachines(val),
    [setSelectedMachines]
  )

  function handleClick() {
    setShowReport(true)
  }

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
                      <div className="text-sm">Machine Class</div>
                      <CustomSelectComponent
                        multiple
                        items={machineClasses?.items.map((machine: any) => ({
                          key: machine._id,
                          label: machine.name,
                        }))}
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
                      <div className="text-sm">Part</div>
                      <CustomSelectComponent
                        multiple
                        items={
                          parts?.map((p) => ({
                            key: p._id,
                            label: p.name,
                          })) as T_Dispaly_Part_Types[]
                        }
                        value={selectedParts}
                        onChange={onChangePart}
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
                      <div className="px-2 text-[11px]">
                        <button className="flex justify-center py-2 px-4 border rounded-lg border-1 border-black bg-red-900 text-slate-50">
                          TODAY
                        </button>
                        {/* <Button variant="contained">Today</Button> */}
                      </div>
                    </div>
                  </div>
                  {/* END SELECT */}
                  <Divider />
                  <div className="flex justify-end p-6 text-[11px]">
                    <button
                      className="flex justify-center py-2 px-2 border rounded-lg border-1 border-black bg-red-900 text-slate-50"
                      onClick={handleClick}
                    >
                      GENERATE REPORT
                    </button>
                  </div>
                  {showReport && (
                    <NewWindow
                      copyStyles={true}
                      features={{
                        width: paginated?.items?.length! > 0 ? 1440 : 500,
                        height: 1000,
                      }}
                      center="parent"
                      onUnload={() => setShowReport(false)}
                      title={"Report"}
                      name="Report"
                      ref={myRef}
                    >
                      <SystemReport
                        data={paginated}
                        // city={cityArray}
                        keyword={keyword}
                        sortType={sortType}
                        factoryId={factories?.items?.map(
                          (factory: { _id: string }) => factory._id
                        )}
                        process={process}
                        machineId={machineSelectedIds}
                        partId={partsSelectedIds}
                        machineClassId={machineClassSelectedIds}
                        locationId={cityArray}
                        locationData={
                          locations?.items?.filter((item) =>
                            cityArray?.includes(item._id ?? "")
                          ) ?? []
                        }
                        machineClassData={
                          machineClasses?.items?.filter(
                            (item: T_MachineClass) =>
                              machineClassSelectedIds?.includes(item._id ?? "")
                          ) ?? []
                        }
                        machineData={
                          machines?.items?.filter((item: T_Machine) =>
                            machineSelectedIds?.includes(
                              (item._id as string) ?? ""
                            )
                          ) ?? []
                        }
                        startDateRange={""}
                        endDateRange={""}
                        newWindowRef={myRef}
                      />
                    </NewWindow>
                  )}
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
                    {/* PART */}
                    <div className="flex flex-col w-full col-span-1 text-xs text-left h-fit">
                      {selectedParts?.map((item) => (
                        <div key={item.key} className="p-1">
                          <Chip
                            label={item.label}
                            className="text-left 1"
                            variant="outlined"
                            size="small"
                            onDelete={() => {
                              setSelectedParts((prev) => {
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
