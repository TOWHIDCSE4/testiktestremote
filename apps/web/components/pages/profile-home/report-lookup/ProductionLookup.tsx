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
import SystemReport from "../../production/system-check/Report/SystemReport"
import NewWindow from "react-new-window"
import useGlobalTimerLogsMulti from "../../../../hooks/timerLogs/useGetGlobalTimerLogsMultiFilter"
import dayjs from "dayjs"
// import DeleteIcon from "@mui/icons-material/Delete"

import { DatePicker } from "antd"
import useGetProfileLookup from "../../../../hooks/productionlookup/useGetProductionLookupFilter"
import useGetDashboardConfig from "../../../../hooks/dashboardConfig/useGetDashboardConfig"

type T_Dispaly_Part_Types = {
  key: string
  label: string
}

function objectToArray(obj: any) {
  return obj ? [obj?.key] : []
}

const Content = () => {
  const myRef = useRef<NewWindow | null>(null)
  const [parts, setParts] = useState<T_Part[]>()
  const [part, onPartChange] = useState()
  const [selectedCity, setSelectedCity] = useState<T_SelectItem[]>()
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
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const [keyword, setKeyword] = useState<string>("")
  const [sortType, setSortType] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  const [isCheckboxChecked, setIsCheckboxChecked] = useState<
    boolean | undefined
  >(false)
  const { data: locations, isLoading: isLocationsLoading } = useLocations()
  const { data: machines, isLoading: isMachinesLoading } = useMachines()
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  const {
    data: machineClasses,
    isLoading: isMachineClassesLoading,
    setStartDateForMachineClass,
    setEndDateForMachineClass,
  } = useMachineClasses(selectedCity?.map((city) => city.key) as string[])

  const { data: isPinned, isLoading: isPinnedLoading } = useGetDashboardConfig()

  const [dateRange, setDateRange] = useState<Date[] | string[]>([])
  const machineClassSelectedIds = useMemo(
    () =>
      selectedMachineClasses?.map(
        (selectedMachineClass) => selectedMachineClass.key
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(selectedMachineClasses)]
  )

  const machineSelectedIds = selectedMachines?.map((machineId) => machineId.key)
  const partsSelectedIds = selectedParts?.map((partsId) => partsId.key)

  const process = true

  const {
    data,
    isLoading,
    isRefetching,
    page,
    setPage,
    setFactoryId,
    setMachineClassId,
    setMachineId,
    setStartDateRange,
    setEndDateRange,
    setPartId,
  } = useGlobalTimerLogsMulti(
    selectedCity?.map((city) => city.key) as string[],
    sortType,
    keyword,
    process
  )

  // CITY
  const filteredCities = useMemo<Array<T_SelectItem>>(() => {
    if (isLocationsLoading || !locations?.items) return []

    return locations?.items.map((item) => ({
      key: item._id ?? "",
      label: item.name,
    }))
  }, [locations, isLocationsLoading])

  const filteredFactories = useMemo<Array<T_SelectItem>>(() => {
    if (isFactoriesLoading || !factories?.items || !selectedCity) return []

    const data = factories?.items.map((item: T_Factory) => ({
      key: item._id ?? "",
      label: item.name,
    }))

    setSelectedFactories((prev) =>
      prev?.filter((prevItem) => data?.some((f: any) => f.key == prevItem.key))
    )
    return data
  }, [factories, isFactoriesLoading, selectedCity])

  // MACHINE CLASS
  const filteredMachineClasses = useMemo<Array<T_SelectItem>>(() => {
    const selectedCitiesIds = selectedCity?.map((city) => city.key)
    return machineClasses?.items
      ?.filter((item: T_MachineClass) =>
        selectedCitiesIds?.includes(item.factoryId)
      )
      ?.map((item: T_MachineClass) => ({
        key: item._id,
        label: item.name,
      }))
  }, [machineClasses, selectedCity])

  useEffect(() => {
    if (machineClassSelectedIds !== undefined) {
      setMachineClassId(machineClassSelectedIds)
    }
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
  }, [machines, selectedMachineClasses])

  useEffect(() => {
    if (machineSelectedIds !== undefined) {
      setMachineId(machineSelectedIds)
    }
  }, [machineSelectedIds?.join(",")])

  useEffect(() => {
    if (startDate !== undefined) setStartDateRange(startDate)
  }, [startDate])

  useEffect(() => {
    if (endDate !== undefined) setEndDateRange(endDate)
  }, [endDate])

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
  }, [partsSelectedIds?.join(",")])

  useEffect(() => {
    setSelectedParts((prev) =>
      prev?.filter((prevItem) =>
        selectedParts?.some((m: T_SelectItem) => m.key == prevItem.key)
      )
    )
  }, [selectedParts?.join()])

  useEffect(() => {
    setSelectedCity([])
    setSelectedMachineClasses([])
    setSelectedMachines([])
    setSelectedParts([])
  }, [startDate, endDate])

  useEffect(() => {
    const token = Cookies.get("tfl")
    const locationsQuery = new URLSearchParams({
      locations: selectedCity?.map((city) => city.key) as unknown as string,
    }).toString()

    const machineClassesQuery = new URLSearchParams({
      machineClasses: selectedMachineClasses?.map(
        (machine) => machine.key
      ) as unknown as string,
    }).toString()

    const fetchData = async () => {
      if (!selectedCity?.length) return
      const page = 1

      const res = await fetch(
        `${API_URL_PARTS}/by/location-machine-class?page=${page}&${machineClassesQuery}&${locationsQuery}&startDate=${startDate}&endDate=${endDate}`,
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
  }, [selectedMachines, startDate, endDate])

  const onCityChange = useCallback(
    (val?: T_SelectItem[]) => setSelectedCity(val),
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

  function handleDate() {
    setIsCheckboxChecked(!isCheckboxChecked)
    if (!isCheckboxChecked) {
      setEndDate(dayjs().endOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"))
      setStartDate(dayjs().startOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"))
    } else {
      setStartDate("")
      setEndDate("")
    }
  }

  // useEffect(() => {
  //   const profileLookupData = filters?.profileLookup

  //   setSelectedCity(
  //     profileLookupData?.locations?.map((location: any) => ({
  //       key: location.key,
  //       label: location.label,
  //     }))
  //   )
  //   setSelectedMachineClasses(
  //     profileLookupData?.machineClasses?.map((machineClasses: any) => ({
  //       key: machineClasses.key,
  //       label: machineClasses.label,
  //     }))
  //   )
  //   setSelectedMachines(
  //     profileLookupData?.machines?.map((machines: any) => ({
  //       key: machines.key,
  //       label: machines.label,
  //     }))
  //   )
  //   setSelectedParts(
  //     profileLookupData?.parts?.map((parts: any) => ({
  //       key: parts.key,
  //       label: parts.label,
  //     }))
  //   )
  //   setIsIncludeCycle(profileLookupData?.includeCycles)
  //   setStartDate(profileLookupData?.startDate)
  //   setEndDate(profileLookupData?.endDate)
  // }, [filters])

  return (
    <>
      {isPinned?.items?.systemLookup === true ? (
        <div className={` pb-10`}>
          <div className="px-4 mx-auto content md:px-7 lg:px-16 2xl:px-44 2xl:max-w-7xl">
            <div className="relative flex flex-col w-full gap-12 py-4">
              <div className="flex w-full bg-white border border-gray-200 rounded-lg">
                <div className="flex flex-col flex-1 p-4">
                  <div className="text-xl font-bold">
                    PRODUCTION REPORT LOOKUP
                  </div>
                  <div className="flex flex-col flex-1 py-4">
                    <div className="w-[12%]">
                      <div className="text-sm whitespace-nowrap">
                        Review Range
                      </div>
                      <DatePicker.RangePicker
                        className="text-[10px] text-white w-[15rem] border-blue-950"
                        disabledDate={(current: any) =>
                          current.valueOf() >= Date.now()
                        }
                        onChange={(dateValues: any) => {
                          if (!dateValues) return
                          setStartDate(
                            dayjs(dateValues[0]).format(
                              "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
                            )
                          )
                          setEndDate(
                            dayjs(dateValues[1]).format(
                              "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
                            )
                          )
                          setStartDateForMachineClass(
                            dayjs(dateValues[0]).format(
                              "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
                            )
                          )
                          setEndDateForMachineClass(
                            dayjs(dateValues[1]).format(
                              "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
                            )
                          )
                        }}
                      />
                    </div>
                    {/* BEGIN SELECT */}
                    <div className="flex mb-4 gap-x-3">
                      <div className="w-1/6">
                        <div className="text-sm">Select City</div>
                        <CustomSelectComponent
                          multiple
                          items={filteredCities}
                          value={selectedCity}
                          onChange={onCityChange}
                        />
                      </div>
                      <div className="w-1/5">
                        <div className="text-sm">Machine Class</div>
                        <CustomSelectComponent
                          multiple
                          items={machineClasses?.items?.map((machine: any) => ({
                            key: machine._id,
                            label: machine.name,
                          }))}
                          value={selectedMachineClasses}
                          onChange={onMachineClassChange}
                        />
                      </div>
                      <div className="w-1/5">
                        <div className="text-sm">Machine</div>
                        <CustomSelectComponent
                          multiple
                          items={filteredMachines}
                          value={selectedMachines}
                          onChange={onMachinesChange}
                        />
                      </div>
                      <div className="w-1/5">
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
                      <div className="w-[7rem]">
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
                      <div className="w-[12%]">
                        <div className="text-sm whitespace-nowrap">
                          Current Date
                        </div>
                        <div className="px-0 text-[11px] flex space-x-2 pt-3">
                          <label htmlFor="checkbox-date">TODAY</label>
                          <input
                            id="checkbox-date"
                            type="checkbox"
                            checked={isCheckboxChecked}
                            onChange={handleDate}
                            className="flex justify-center py-1 px-1 rounded-full border border-1 border-black text-black"
                          />

                          {/* <Button variant="contained">Today</Button> */}
                        </div>
                      </div>
                    </div>
                    {/* END SELECT */}

                    {showReport && (
                      <NewWindow
                        copyStyles={true}
                        features={{
                          width: 1440,
                          height: 1000,
                        }}
                        center="parent"
                        onUnload={() => setShowReport(false)}
                        title={"Report"}
                        name="Report"
                        ref={myRef}
                      >
                        <SystemReport
                          data={data}
                          isIncludeCycle={isIncludeCycle}
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
                          locationId={
                            selectedCity?.map((city) => city.key) as string[]
                          }
                          locationData={
                            locations?.items?.filter((item) =>
                              selectedCity
                                ?.map((city) => city.key)
                                ?.includes(item._id ?? "")
                            ) ?? []
                          }
                          machineClassData={
                            machineClasses?.items?.filter(
                              (item: T_MachineClass) =>
                                machineClassSelectedIds?.includes(
                                  item._id ?? ""
                                )
                            ) ?? []
                          }
                          machineData={
                            machines?.items?.filter((item: T_Machine) =>
                              machineSelectedIds?.includes(
                                (item._id as string) ?? ""
                              )
                            ) ?? []
                          }
                          startDateRange={startDate}
                          endDateRange={endDate}
                          newWindowRef={myRef}
                        />
                      </NewWindow>
                    )}
                    <p className="text-md pt-5">Confirmation Selection</p>
                    <Divider />
                    {/* BEGIN CONFIRM */}
                    <div className="grid grid-cols-6 gap-x-3">
                      {/* CITY */}
                      <div className="flex flex-col w-full col-span-1 text-xs text-left h-fit">
                        {selectedCity?.map((city) => (
                          <div key={city.key} className="p-1">
                            <Chip
                              label={city.label}
                              className="text-left"
                              variant="outlined"
                              size="small"
                              onDelete={() => {
                                setSelectedCity((prev) => {
                                  return prev?.filter(
                                    (previtem) => previtem.key != city.key
                                  )
                                })
                                setSelectedParts(undefined)
                              }}
                              deleteIcon={
                                <span className="text-end rounded-full text-xs px-[5px] py-[1px] bg-gray-500 text-white">
                                  X
                                </span>
                              }
                              style={{
                                width: "100px",
                                justifyContent: "space-between",
                              }}
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
                              className="text-left"
                              variant="outlined"
                              size="small"
                              onDelete={() => {
                                setSelectedMachineClasses((prev) => {
                                  return prev?.filter(
                                    (previtem) => previtem.key != item.key
                                  )
                                })
                              }}
                              deleteIcon={
                                <span className="text-end rounded-full text-xs px-[5px] py-[1px] bg-gray-500 text-white">
                                  X
                                </span>
                              }
                              style={{
                                width: "100px",
                                justifyContent: "space-between",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {/* MACHINE */}
                      <div className="flex flex-col w-full col-span-1 text-xs text-left h-fit pl-2">
                        {selectedMachines?.map((item) => (
                          <div key={item.key} className="p-1">
                            <Chip
                              label={item.label}
                              className="text-left"
                              variant="outlined"
                              size="small"
                              onDelete={() => {
                                setSelectedMachines((prev) => {
                                  return prev?.filter(
                                    (previtem) => previtem.key != item.key
                                  )
                                })
                              }}
                              deleteIcon={
                                <span className="text-end rounded-full text-xs px-[5px] py-[1px] bg-gray-500 text-white">
                                  X
                                </span>
                              }
                              style={{
                                width: "100px",
                                justifyContent: "space-between",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {/* PART */}
                      <div className="flex flex-col w-full col-span-1 text-xs text-left h-fit pl-8">
                        {selectedParts?.map((item) => (
                          <div key={item.key} className="p-1">
                            <Chip
                              label={item.label}
                              className="text-left"
                              variant="outlined"
                              size="small"
                              onDelete={() => {
                                setSelectedParts((prev) => {
                                  return prev?.filter(
                                    (previtem) => previtem.key != item.key
                                  )
                                })
                              }}
                              deleteIcon={
                                <span className="text-end rounded-full px-[5px] py-[1px] text-xs bg-gray-500 text-white">
                                  X
                                </span>
                              }
                              style={{
                                width: "100px",
                                justifyContent: "space-between",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {/* INCLUDE CYCLE */}
                      <div className="flex flex-col w-full col-span-1 text-xs text-left h-fit">
                        {isIncludeCycle ? "Yes" : "No"}
                      </div>
                      {/* DATE RANGE */}
                      <div className="flex justify-end text-xs whitespace-nowrap">
                        {startDate === endDate
                          ? "Today"
                          : dayjs(startDate).format("YYYY-MM-DD") +
                            " - " +
                            dayjs(endDate).format("YYYY-MM-DD")}
                      </div>
                    </div>
                    {/* END CONFIRM */}
                  </div>
                  <div className="flex justify-end text-[11px]">
                    <button
                      className="flex justify-center mr-2 py-2 px-2 border rounded-lg border-1 border-black bg-blue-950 text-slate-50"
                      onClick={handleClick}
                    >
                      REPORT
                    </button>
                    <button
                      className={`flex justify-center py-2 px-2 border bg-blue-950 border-black rounded-lg border-1 disabled:bg-gray-400 disabled:border-none  text-slate-50`}
                      onClick={() => console.log("test")}
                      disabled={selectedCity?.length === 0}
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className={`flex flex-col  items-center`}>
                  <IconButton
                    onClick={() => {
                      setSelectedCity(undefined)
                      setSelectedParts(undefined)
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
      ) : (
        <></>
      )}
    </>
  )
}

export default Content
