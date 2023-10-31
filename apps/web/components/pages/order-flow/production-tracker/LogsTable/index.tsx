"use client"
import { DatePicker, Space } from "antd"
import NewWindow from "react-new-window"
import Report from "../../../production/timer/Report"
import dayjs from "dayjs"
import moment from "moment"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
// import { usePathname } from "next/navigation"
import React, { Dispatch, useEffect, useState, useRef, use } from "react"
// import useGlobalTimerLogsMulti from "../../../../../hooks/timerLogs/useGlobalTimerLogsMultiFilter"
import useFactories from "../../../../../hooks/factories/useFactories"
import {
  T_Factory,
  T_Machine,
  T_MachineClass,
  T_Part,
  T_Locations,
} from "custom-validator"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid"
import useLocations from "../../../../../hooks/locations/useLocations"
import usePaginatedParts from "../../../../../hooks/parts/usePaginatedParts"
import { API_URL_PARTS } from "../../../../../helpers/constants"
import Cookies from "js-cookie"
import { useQueryClient } from "@tanstack/react-query"
import useGlobalTimerLogsMulti from "../../../../../hooks/timerLogs/useGetGlobalTimerLogsMultiFilter"
import useGetMachinesByMachineClasses from "../../../../../hooks/machines/useGetMachinesByMachineClasses"
import useMachineClasses from "../../../../../hooks/machineClasses/useMachineClassesByLocation"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import ListItemText from "@mui/material/ListItemText"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import Checkbox from "@mui/material/Checkbox"
import useGetGlobalMetrics from "../../../../../hooks/timerLogs/useGetGlobalMetrics"
import GlobalTableReport from "../GlobalReport"

export type OptionType = {
  value: number
  label: string
}

const ITEM_HEIGHT = 48
// const ITEM_PADDING_TOP = 2;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5,
      padding: 0,
      // width: 200,
    },
  },
}

const { RangePicker } = DatePicker

const LogsTable = ({ locationId }: { locationId: string }) => {
  const queryClient = useQueryClient()
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const toggleAccordion = (id: string) => {
    if (openAccordion === id) {
      setOpenAccordion(null)
    } else {
      setOpenAccordion(id)
    }
  }

  const [parts, setParts] = useState([])
  const [keyword, setKeyword] = useState<string>("")
  const [showReport, setShowReport] = useState(false)
  const [sortType, setSortType] = useState<string>("")
  const [process, setProcess] = useState<boolean>(false)
  const [machineClass, setMachineClass] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<Date[] | string[]>([])
  const [minWidth, setMinWidth] = useState<number>(window.innerWidth)
  const [city, setCity] = useState<string[]>(["64d5814fb996589a945a6402"])
  const [checkedProduction, setCheckedProduction] = useState<{ id: string }[]>(
    []
  )
  const [bulkSelectCheckbox, setBulkSelectCheckbox] = useState(false)
  const [partsSelected, setPartsSelected] = useState<string[]>([])
  const [partSelector, setPartSelector] = useState<string[]>([])
  const [machine, setMachine] = useState<string[]>([])
  const [search, setSearch] = useState<string>("")
  const [loadOptionsCount, setLoadOptionsCount] = useState(0)
  const [cityCounter, setCityCounter] = useState<number>(city.length)
  const [selectedMachineValues, setSelectedMachineValues] = useState<string[]>()
  const [machineClassCounter, setMachineClassCounter] = useState<number>()
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
  const [machineCounter, setMachineCounter] = useState<number>()
  const [partsCounter, setPartsCounter] = useState<number>(0)
  const today = moment()
  const myRef = useRef<NewWindow | null>(null)

  useEffect(() => {
    // Function to update the window width when the window is resized
    const handleResize = () => {
      setMinWidth(window.innerWidth)
    }

    // Add an event listener for the "resize" event
    window.addEventListener("resize", handleResize)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleInputChange = (
    e: React.MouseEvent<HTMLButtonElement>,
    key: string
  ) => {
    const newValue = e.currentTarget.value
    setKeyword(key)
    setSortType(sortType === "asc" ? "desc" : "asc")
  }

  const handleProcess = () => {
    setProcess(process ? false : true)
  }

  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  const { data: machineClasses, isLoading: isMachineClassesLoading } =
    useMachineClasses(city)

  const { data: machines, isLoading: isMachinesLoading } =
    useGetMachinesByMachineClasses(machineClass)
  useEffect(() => {
    if (machines && machines.items) {
      const initialMachineSelection = machines?.items?.map((item) => item._id)
      setMachine(initialMachineSelection as string[])
      setMachineCounter(machine.length)
    }
  }, [machines])
  const { data: locations, isLoading: isLocationsLoading } = useLocations()
  const {
    data: allParts,
    isLoading: isGetAllPartsLoading,
    setLocationId,
    setPage: setPartsPage,
    page: partsPage,
    setName,
  } = usePaginatedParts()
  const numberOfPartsPages = Math.ceil((allParts?.itemCount as number) / 6)

  useEffect(() => {
    setLocationId(city[0])
    setPartsPage(1)
  }, [city, setLocationId])

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["global-timer-logs"],
    })
  }, [partSelector])

  const handlePartSelect = (e: any) => {
    const val = e.map((i: any) => i)
    setPartSelector(e)
  }

  useEffect(() => {
    setPartSelector(partSelector)
  }, [partSelector])

  useEffect(() => {
    const token = Cookies.get("tfl")
    //@ts-expect-error
    const locationsQuery = new URLSearchParams({ locations: city }).toString()
    //@ts-expect-error
    const machineClassesQuery = new URLSearchParams({
      machineClasses: machineClass,
    }).toString()

    const fetchData = async () => {
      const res = await fetch(
        `${API_URL_PARTS}/by/location-machine-class?page=${page}&${machineClassesQuery}&${locationsQuery}&search=${search}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const responseJSON = await res.json()
      setParts(responseJSON)
      setLoadOptionsCount(loadOptionsCount + 1)
    }

    fetchData()
  }, [city, machineClass])

  const disabledDate = (current: any) => {
    return current && current >= today
  }
  // Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())

  const [filterBy, setFilterBy] = useState("All")
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
  } = useGlobalTimerLogsMulti(city, sortType, keyword, process)
  const numberOfPages = Math.ceil((paginated?.itemCount as number) / 10)
  useEffect(() => {
    setMachineClassId(machineClass)
    setPage(1)
  }, [machineClass, setFactoryId])

  useEffect(() => {
    setMachineId(machine)
    setPage(1)
  }, [machine, setMachineId])

  useEffect(() => {
    setPartId(partsSelected)
    setPage(1)
  }, [partsSelected, setPartId])

  // useEffect(() => {
  //   setStartDateRange(dateRange)
  //   setPage(1)
  // }, [dateRange, setStartDateRange])
  const {
    data: globalMetrics,
    isLoading: isGlobalMetricsLoading,
    isRefetching: isGlobalMetricsRefetching,
    setFactoryIds,
    setMachineClassIds,
    setMachineIds,
    setStartDateRanges,
    setEndDateRanges,
    setPartIds,
  } = useGetGlobalMetrics(city, process)

  useEffect(() => {
    setMachineClassIds(machineClass)
  }, [machineClass, setMachineClassIds])

  useEffect(() => {
    setMachineIds(machine)
  }, [machine, setMachineIds])

  useEffect(() => {
    setPartIds(partsSelected)
  }, [partsSelected, setPartIds])

  // useEffect(() => {
  //   setEndDateRanges(dateRange)
  //   setPage(1)
  // }, [dateRange, setEndDateRange])

  function formatTime(seconds: string) {
    const duration = moment.duration(seconds, "seconds")
    const minutes = duration.minutes()
    const remainingSeconds = duration.seconds()

    let result = ""

    if (minutes > 0) {
      result += `${minutes} min`
    }

    if (remainingSeconds > 0) {
      if (result !== "") {
        result += ", "
      }
      result += `${remainingSeconds} sec`
    }

    return result
  }

  const handleCheckboxChange = (e: any) => {
    const isChecked = e.target.checked
    setIsCheckboxChecked(isChecked)
    if (isChecked) {
      const currentDate = dayjs().toDate()
      setDateRange([dayjs().format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")])
      datePick([currentDate, currentDate])
    } else {
      setDateRange([])
      setStartDateRange("")
      setEndDateRange("")
      setStartDateRanges("")
      setEndDateRanges("")
    }
  }

  const datePick = (inputValue: any) => {
    setPage(1)
    setDateRange(inputValue)
    if (isCheckboxChecked) {
      // If the checkbox is checked, set the start and end dates to the current date
      // const currentDate = dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
      setStartDateRange(
        dayjs(inputValue[0]).startOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
      )
      setEndDateRange(
        dayjs(inputValue[1]).endOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
      )
      setStartDateRanges(
        dayjs(inputValue[0]).startOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
      )
      setEndDateRanges(
        dayjs(inputValue[1]).endOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
      )
    } else if (inputValue && inputValue[0] && inputValue[1]) {
      // Handle the case when the checkbox is not checked, but both start and end dates are provided
      setStartDateRange(
        dayjs(inputValue[0]).startOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
      )
      setEndDateRange(
        dayjs(inputValue[1]).endOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
      )
      setStartDateRanges(
        dayjs(inputValue[0]).startOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
      )
      setEndDateRanges(
        dayjs(inputValue[1]).endOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
      )
    } else {
      // Handle the case when one or both dates are empty
      setStartDateRange("")
      setEndDateRange("")
      setStartDateRanges("")
      setEndDateRanges("")
    }
  }

  // const { Option } = Select

  const handleLocationChange = (event: any) => {
    const selectedMachineClass: Array<any> = []
    setCity(event.target.value)
    setMachineClass(selectedMachineClass)
  }

  useEffect(() => {
    setCityCounter(city.length)
  }, [city])

  const handleMachineClassChange = (event: SelectChangeEvent) => {
    const selectedMachineClasses: string = event.target.value

    const selectedMachines: Array<any> = []
    //@ts-expect-error
    setMachineClass(selectedMachineClasses)
    setMachine(selectedMachines)
  }

  useEffect(() => {
    setMachineClassCounter(machineClass.length)
  }, [machineClass])

  const handleMachineChange = (event: any) => {
    const selectedParts: Array<any> = []
    setSelectedMachineValues(event.target.value)
    setMachine(event.target.value)
    setPartsSelected(selectedParts)
  }

  useEffect(() => {
    setMachineCounter(machine.length)
    setMachineClassCounter(machineClass.length)
  }, [machine])

  const handlePartsChange = (event: any) => {
    setPartsSelected(event.target.value)
  }

  useEffect(() => {
    setPartsCounter(partsSelected.length)
  }, [partsSelected])

  useEffect(() => {
    const filterInputs = () => {
      if (filterBy === "Factories") {
        return (
          <select
            id="factories"
            name="factories"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
            onChange={(e) => {
              //@ts-expect-error
              setFactoryId(e.target.value)
              //@ts-expect-error
              setMachineClassId("")
              //@ts-expect-error
              setMachineId("")
            }}
            disabled={isFactoriesLoading || isFactoriesLoading}
          >
            <option value="">Select Factory</option>
            {factories?.items?.map((item: T_Factory, index: number) => {
              return (
                <option key={index} value={item._id as string}>
                  {item.name}
                </option>
              )
            })}
          </select>
        )
      } else if (filterBy === "Machine Classes") {
        return (
          <select
            id="machineClasses"
            name="machineClasses"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
            onChange={(e) => {
              //@ts-expect-error
              setMachineClassId(e.target.value)
              //@ts-expect-error
              setFactoryId("")
              //@ts-expect-error
              setMachineId("")
            }}
            disabled={isMachineClassesLoading || isFactoriesLoading}
          >
            <option value="">Select Machine Classes</option>
            {machineClasses?.items?.map(
              (item: T_MachineClass, index: number) => {
                return (
                  <option key={index} value={item._id as string}>
                    {item.name}
                  </option>
                )
              }
            )}
          </select>
        )
      } else if (filterBy === "Machines") {
        return (
          <select
            id="machines"
            name="machines"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
            onChange={(e) => {
              //@ts-expect-error
              setMachineId(e.target.value)
              //@ts-expect-error
              setMachineClassId("")
              //@ts-expect-error
              setFactoryId("")
            }}
            disabled={isMachinesLoading || isFactoriesLoading}
          >
            <option value="">Select Machines</option>
            {machines?.items?.map((item: T_Machine, index: number) => {
              return (
                <option key={index} value={item._id as string}>
                  {item.name}
                </option>
              )
            })}
          </select>
        )
      } else {
        return (
          <select
            id="all"
            name="all"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled
          >
            <option></option>
          </select>
        )
      }
    }
  }, [filterBy])

  const handleSelectAllProduction = () => {
    const data = paginated?.items ?? []
    let updatedArray = [] as any

    if (checkedProduction.length === data.length) {
      updatedArray = []
    } else {
      updatedArray = data
        ?.filter((item) => item?._id !== undefined)
        .map((item) => ({ id: item?._id }))
    }

    setCheckedProduction(updatedArray)
  }

  useEffect(() => {
    if (paginated?.items.length == checkedProduction.length) {
    }
  })

  const isChecked = (id: string) => {
    return checkedProduction.filter((item) => item.id === id).length > 0
  }

  const handleChangeCheck = (e: any, id: string) => {
    e.stopPropagation()
    setCheckedProduction((prevState) =>
      prevState.some((item) => item.id === id)
        ? prevState.filter((item) => item.id !== id)
        : [...prevState, { id }]
    )
  }

  function handleClick() {
    setShowReport(true)
  }

  return (
    <>
      <div
        className={`w-full mt-12 overflow-hidden bg-white drop-shadow-lg rounded-md ${
          paginated ? "overflow-hidden" : "overflow-x-auto"
        }`}
      >
        <div className="px-1 w-full pt-4">
          <div className="flex px-2">
            <div className="flex flex-col whitespace-nowrap justify-between">
              <h3 className="text-2xl font-semibold pr-1">GLOBAL PRODUCTION</h3>
              <div className="w-full flex justify-center items-center">
                <select
                  id="filterBy"
                  name="filterBy"
                  className=" mt-2 block rounded-lg border-0 py-1 px-2 pl-2 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6"
                  onChange={(e) => setFilterBy(e.target.value)}
                >
                  <option value="BatchAction">Batch action</option>
                  <option value="Factories">Factory</option>
                  <option value="Machine Classes">Machine Class</option>
                  <option value="Machines">Machine</option>
                </select>
              </div>
            </div>
            <div className=" w-full space-y-3 px-4">
              <div className="flex w-full">
                {/* city */}
                <div className="flex w-1/2 text-[11px] items-center">
                  <p className="w-1/6 font-semibold text-right mr-2">CITY</p>
                  {/* <Select
                    // defaultValue={[colourOptions[2], colourOptions[3]]}
                    isMulti
                    name="colors"
                    options={[
                      { value: "chocolate", label: "Chocolate" },
                      { value: "strawberry", label: "Strawberry" },
                      { value: "vanilla", label: "Vanilla" },
                    ]}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  /> */}
                  {/* <Space direction="vertical" className="min-w-full">
                    <Select
                      mode="multiple"
                      style={{ width: "100%", height: '32px', overflow: "hidden", whiteSpace: "nowrap" }}
                      placeholder={"select city"}
                      defaultValue={[city[0]]}
                      size="middle"
                      onChange={(value) => handleLocationChange(value)}
                      dropdownRender={(menu) => (
                        <div>
                          {menu}
                        </div>
                      )}
                    >
                      {locations?.items?.map(
                        (item: T_Locations, index: number) => {
                          return (
                            <Option
                              key={index}
                              value={item._id as string}
                              label={item.name}
                            >
                              <Space>{item.name}</Space>
                            </Option>
                          )
                        }
                      )}
                    </Select> */}
                  <FormControl className="w-2/3" size="small">
                    {/* <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel> */}
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      style={{
                        width: "100%",
                        border: "0.3pt solid #ccc",
                        borderRadius: "8px",
                        fontSize: "14px",
                        height: "38px",
                      }}
                      value={city}
                      onChange={(event) => handleLocationChange(event)}
                      renderValue={() => `${cityCounter} selected`}
                      MenuProps={MenuProps}
                    >
                      {locations?.items?.map(
                        (item: T_Locations, index: number) => (
                          <MenuItem
                            key={index}
                            // value={[item._id, item.name ] as string[]}
                            value={item._id as string}
                          >
                            <ListItemText primary={item.name} />
                            <Checkbox
                              checked={city.includes(item._id as string)}
                            />
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                  {/* </Space> */}
                </div>
                {/* Machine class */}
                <div className="flex w-1/2 text-[11px] items-center">
                  <p className="w-1/6 font-semibold text-right mr-2">
                    MACHINE CLASS
                  </p>
                  {/* <Space direction="vertical" className="min-w-full">
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      placeholder={"select machine class"}
                      size="middle"
                      disabled={city ? false : true}
                      onChange={(value) => handleMachineClassChange(value)}
                    >
                      {machineClasses?.items?.map(
                        (item: T_MachineClass, index: number) => {
                          return (
                            <Option
                              key={index}
                              value={item._id as string}
                              label={item.name}
                            >
                              {item.name}
                            </Option>
                          )
                        }
                      )}
                    </Select>
                  </Space> */}
                  <FormControl className="w-2/3" size="small">
                    {/* <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel> */}
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      style={{
                        width: "100%",
                        border: "0.3pt solid #ccc",
                        borderRadius: "8px",
                        fontSize: "14px",
                        height: "38px",
                        marginLeft: "10px",
                      }}
                      value={machineClass}
                      onChange={(event: any) => handleMachineClassChange(event)}
                      renderValue={() => `${machineClassCounter} selected`}
                      MenuProps={MenuProps}
                    >
                      {machineClasses &&
                      machineClasses.items &&
                      machineClasses.items.length > 0 ? (
                        machineClasses?.items?.map(
                          (item: T_MachineClass, index: number) => (
                            <MenuItem
                              key={index}
                              // value={[item._id, item.name ] as string[]}
                              value={item._id as string}
                            >
                              <ListItemText primary={item.name} />
                              <Checkbox
                                checked={machineClass.includes(
                                  item._id as string
                                )}
                              />
                            </MenuItem>
                          )
                        )
                      ) : (
                        // Render "No data found" when no data is available
                        <MenuItem disabled>
                          <ListItemText
                            className="mx-4 pl-4"
                            primary="No data found"
                          />
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="flex w-full">
                {/* machine */}
                <div className="flex w-1/2 text-[11px] items-center">
                  <p className="w-1/6 font-semibold text-right mr-2">MACHINE</p>
                  {/* <Space direction="vertical" className="min-w-full">
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      placeholder={"Select machine"}
                      // value={''}
                      disabled={machineClass ? false : true}
                      onChange={(value) => handleMachineChange(value)}
                    >
                      {machines?.items?.map(
                        (item: T_Machine, index: number) => {
                          return (
                            <Option
                              key={index}
                              value={item._id as string}
                              label={item.name}
                            >
                              <Space>{item.name}</Space>
                            </Option>
                          )
                        }
                      )}
                    </Select>
                    <div>{selectedMachineValues?.length} selected</div>
                  </Space> */}
                  <FormControl className="w-2/3" size="small">
                    {/* <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel> */}
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      style={{
                        width: "100%",
                        border: "0.3pt solid #ccc",
                        borderRadius: "8px",
                        fontSize: "14px",
                        height: "38px",
                      }}
                      value={machine}
                      onChange={(event) => handleMachineChange(event)}
                      renderValue={() => `${machineCounter} selected`}
                      MenuProps={MenuProps}
                    >
                      {machines &&
                      machines.items &&
                      machines.items.length > 0 ? (
                        machines?.items?.map(
                          (item: T_Machine, index: number) => (
                            <MenuItem
                              key={index}
                              // value={[item._id, item.name ] as string[]}
                              value={item._id as string}
                            >
                              <ListItemText primary={item.name} />
                              <Checkbox
                                checked={machine.includes(item._id as string)}
                              />
                            </MenuItem>
                          )
                        )
                      ) : (
                        // Render "No data found" when no data is available
                        <MenuItem disabled>
                          <ListItemText
                            className="mx-4 pl-4"
                            primary="No data found"
                          />
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </div>
                {/* part selector */}
                <div className="flex w-1/2 text-[11px] items-center">
                  <p className="w-1/6 font-semibold text-right ml-0 pl-0 mr-2">
                    PART SELECTOR
                  </p>
                  {/* <AsyncPaginate
                    isMulti
                    value={partSelector}
                    isDisabled={machine ? false : true}
                    debounceTimeout={1000}
                    placeholder={"Select"}
                    // onInputChange={(e) => onSearch(e)}
                    //@ts-expect-error
                    loadOptions={loadOptions}
                    onChange={(e) => handlePartSelect(e)}
                    reduceOptions={reduceGroupedOptions}
                    styles={customStyles}
                    additional={{
                      page: 1,
                    }}
                  /> */}
                  <FormControl className="w-2/3" size="small">
                    {/* <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel> */}
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      style={{
                        width: "100%",
                        border: "0.3pt solid #ccc",
                        borderRadius: "8px",
                        fontSize: "14px",
                        height: "38px",
                        marginLeft: "10px",
                      }}
                      value={partsSelected}
                      onChange={(event) => handlePartsChange(event)}
                      renderValue={() => `${partsCounter} selected`}
                      MenuProps={MenuProps}
                    >
                      {
                        //@ts-expect-error
                        parts && parts.items && parts.items.length > 0 ? (
                          //@ts-expect-error
                          parts.items.map((item, index) => (
                            <MenuItem
                              key={index}
                              // value={[item._id, item.name ] as string[]}
                              value={item._id as string}
                            >
                              <ListItemText primary={item.name} />

                              <Checkbox
                                checked={partsSelected.includes(item._id)}
                              />
                            </MenuItem>
                          ))
                        ) : (
                          // Render "No data found" when no data is available
                          <MenuItem disabled>
                            <ListItemText
                              className="mx-4 pl-4"
                              primary="No data found"
                            />
                          </MenuItem>
                        )
                      }
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="flex w-full">
                {/* date range */}
                <div className="flex w-1/2 text-[11px] items-center">
                  <p className="w-1/6 font-semibold text-right mr-2">
                    DATE RANGE
                  </p>
                  <div className="w-2/3">
                    <Space direction="vertical" className="w-full" size={12}>
                      <RangePicker
                        disabled={isCheckboxChecked}
                        //@ts-expect-error
                        value={isCheckboxChecked ? [null] : dateRange}
                        disabledDate={disabledDate}
                        onChange={(e) => datePick(e)}
                      />
                    </Space>
                  </div>
                </div>
                {/* Generate report */}
                <div className="flex w-1/2 text-[11px] items-center justify-end px-14">
                  <button
                    className="flex justify-center py-2 px-2 border rounded-lg border-1 border-black bg-red-900 text-slate-50"
                    onClick={handleClick}
                  >
                    GENERATE REPORT
                  </button>
                </div>
              </div>
              <div className="w-full flex text-[12px] px-[27%] font-semibold">
                <div>
                  <label htmlFor="checkbox-date">Current Date</label>
                  <input
                    id="checkbox-date"
                    type="checkbox"
                    checked={isCheckboxChecked}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 ml-2 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-500 dark:ring-offset-gray-100 dark:focus:ring-offset-gray-100 focus:ring-2 dark:bg-gray-100 dark:border-gray-900"
                  />
                </div>
              </div>
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
                <GlobalTableReport
                  data={paginated}
                  city={city[0]}
                  keyword={keyword}
                  sortType={sortType}
                  process={process}
                  factoryId={factories?.items?.map(
                    (factory: { _id: string }) => factory._id
                  )}
                  machineId={machine}
                  partId={partsSelected}
                  machineClassId={machineClass}
                  locationId={city}
                  locationData={
                    locations?.items?.filter((item) =>
                      city.includes(item._id ?? "")
                    ) ?? []
                  }
                  machineClassData={
                    machineClasses?.items?.filter((item: T_MachineClass) =>
                      machineClass.includes(item._id ?? "")
                    ) ?? []
                  }
                  machineData={
                    machines?.items?.filter((item: T_Machine) =>
                      machine.includes((item._id as string) ?? "")
                    ) ?? []
                  }
                  startDateRange={
                    dateRange && dateRange.length > 0
                      ? dayjs(dateRange[0])
                          .startOf("day")
                          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
                      : ""
                  }
                  endDateRange={
                    dateRange && dateRange.length > 1
                      ? dayjs(dateRange[1])
                          .endOf("day")
                          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
                      : ""
                  }
                  newWindowRef={myRef}
                />
              </NewWindow>
            )}
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
            {!isPaginatedLoading &&
            paginated?.items &&
            paginated?.items.length > 0 ? (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed">
                <thead className="text-xs text-gray-700 uppercase bg-white-50 dark:bg-white-700 dark:text-gray-400 shadow-none">
                  <tr>
                    <th scope="col" className="w-[10%] pl-10 text-slate-900">
                      <input
                        id={`checkbox-table-search`}
                        type="checkbox"
                        checked={
                          checkedProduction.length == paginated.items.length
                        }
                        className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-500 dark:ring-offset-gray-100 dark:focus:ring-offset-gray-100 focus:ring-2 dark:bg-gray-100 dark:border-gray-900"
                        onChange={handleSelectAllProduction}
                      />
                    </th>
                    <th scope="col" className="w-[10%] text-slate-900">
                      <div className="flex items-center">
                        DATE
                        <button
                          onClick={(e) => handleInputChange(e, "createdAt")}
                        >
                          <svg
                            className="w-3 h-3 ml-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="w-[10%] text-slate-900">
                      <div className="flex items-center">
                        MACHINE
                        <button
                          onClick={(e) => handleInputChange(e, "machineId")}
                        >
                          <svg
                            className="w-3 h-3 ml-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="w-[40%] py-3 text-slate-900">
                      <div className="flex items-center">
                        PART
                        <button onClick={(e) => handleInputChange(e, "partId")}>
                          <svg
                            className="w-3 h-3 ml-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-slate-900">
                      <div className="flex items-center">
                        ID
                        <button
                          onClick={(e) => handleInputChange(e, "globalCycle")}
                        >
                          <svg
                            className="w-3 h-3 ml-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-slate-900">
                      <div className="flex items-center">
                        STATUS
                        <button onClick={(e) => handleInputChange(e, "status")}>
                          <svg
                            className="w-3 h-3 ml-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="w-[15%] px-6 py-3 text-slate-900"
                    >
                      <div className="flex items-center ">
                        TIME
                        <button onClick={(e) => handleInputChange(e, "time")}>
                          <svg
                            className="w-3 h-3 ml-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                {/* table body starts here */}
                <tbody
                  data-accordion="open"
                  className="border-t-4 border-indigo-900"
                >
                  {paginated?.items &&
                    paginated?.items.map((item, idx) => {
                      const rowClass =
                        idx % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                      const isAccordionOpen =
                        openAccordion === `accordion-arrow-icon-body-${idx}`
                      const checked = isChecked(item._id ?? "")
                      return (
                        <React.Fragment key={item._id}>
                          {/* {idx === 0 ? ( // Add accordion to the first row (index 0) */}
                          <tr
                            key={idx}
                            className={`bg-gray text-slate-900 font-medium border-b ${rowClass} ${
                              isAccordionOpen ? "open" : ""
                            } ${!item.jobId ? "bg-red-50" : ""}`}
                            data-accordion-target={`#accordion-arrow-icon-body-${idx}`}
                            aria-expanded={isAccordionOpen}
                            aria-controls={`accordion-arrow-icon-body-${idx}`}
                            onClick={() =>
                              toggleAccordion(
                                `accordion-arrow-icon-body-${idx}`
                              )
                            }
                          >
                            <td className="pr-6">
                              <div className="flex items-center">
                                {isAccordionOpen ? (
                                  <ChevronDownIcon className="w-4 ml-2 mr-4 h-4 stroke-2 stroke-blue-950" />
                                ) : (
                                  <ChevronRightIcon className="w-4 ml-2 mr-4 h-4 stroke-2 stroke-blue-950" />
                                )}
                                <input
                                  id={`checkbox-table-search-${idx}`}
                                  type="checkbox"
                                  className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-500 dark:ring-offset-gray-100 dark:focus:ring-offset-gray-100 focus:ring-2 dark:bg-gray-100 dark:border-gray-900"
                                  onClick={(e) =>
                                    handleChangeCheck(e, item?._id ?? "")
                                  }
                                  checked={checked}
                                />
                                <label
                                  htmlFor={`checkbox-table-search-${idx}`}
                                  className="sr-only"
                                >
                                  {item.cycle}
                                </label>
                              </div>
                            </td>
                            <th
                              scope="row"
                              className=" py-4 font-medium text-gray-900 whitespace-nowrap"
                            >
                              {dayjs
                                .tz(dayjs(item.createdAt), "America/Chicago")
                                .format("MM/DD/YYYY")}
                            </th>
                            <td className=" py-4">
                              {/* @ts-ignore */}
                              {item?.machineId?.name as string}
                            </td>
                            <td
                              className={` py-4 text-sm text-gray-500 flex flex-col ${
                                item.jobId ? "text-gray-900" : "text-red-500"
                              }`}
                            >
                              {typeof item.partId === "object"
                                ? item.partId.name
                                : ""}
                            </td>
                            <td className="px-6 py-4">
                              {item.globalCycle ? item.globalCycle : ""}
                            </td>
                            <td className="px-6 py-4">
                              {item.status === "Gain" ? (
                                <span
                                  className={`font-bold ${
                                    item.jobId
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              ) : (
                                <span className="font-bold text-red-500">
                                  {item.status}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {item.status === "Gain" ? (
                                <span
                                  className={`font-bold ${
                                    item.jobId
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  {formatTime(item.time.toFixed(2))}
                                </span>
                              ) : (
                                <span className="font-bold text-red-500">
                                  {formatTime(item.time.toFixed(2))}
                                </span>
                              )}
                            </td>
                          </tr>
                          {/* ) : null} */}

                          {isAccordionOpen && (
                            <tr
                              id={`accordion-arrow-icon-body-${idx}`}
                              aria-labelledby={`accordion-arrow-icon-heading-${idx}`}
                              className={`${isAccordionOpen ? "open" : ""}`}
                            >
                              <td colSpan={7}>
                                <div className=" border border-b-0 border-gray-100 bg-gray-100  h-13">
                                  <div className="w-[73%]">
                                    <div className="flex justify-between">
                                      <span className="flex w-[27rem] text-[14px] text-slate-900 font-semibold border-r-4 border-gray-500 p-0 pb-8">
                                        <p className="w-2/3 text-right">
                                          ADDITIONAL INFO
                                        </p>
                                      </span>

                                      <span className="flex w-[22rem] text-[13px] ">
                                        <p
                                          className={`px-3 py-4 text-sm text-gray-500 font-semibold ${
                                            item.jobId
                                              ? "text-gray-900"
                                              : "text-red-500"
                                          }`}
                                        >
                                          OPERATOR :
                                        </p>
                                        <p
                                          className={`px-3 py-4 text-sm text-gray-500 ${
                                            item.jobId
                                              ? "text-gray-900"
                                              : "text-red-500"
                                          }`}
                                        >
                                          {typeof item.operator === "object"
                                            ? item.operator?.firstName
                                            : ""}{" "}
                                          {typeof item.operator === "object"
                                            ? item.operator?.lastName
                                            : ""}
                                        </p>
                                      </span>
                                      <span className="flex w-[30rem] text-[13px] text-slate-900 ">
                                        <p
                                          className={`px-3 py-4 text-sm text-gray-500 font-semibold ${
                                            item.jobId
                                              ? "text-gray-900"
                                              : "text-red-500"
                                          }`}
                                        >
                                          STOP REASON :
                                        </p>
                                        <p
                                          className={`px-3 py-4 text-sm  text-gray-500 ${
                                            item.jobId
                                              ? "text-gray-900"
                                              : "text-red-500"
                                          }`}
                                        >
                                          {item.stopReason.join(", ")}
                                        </p>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    })}
                </tbody>
              </table>
            ) : null}
          </div>
        </div>
        {isPaginatedLoading ||
        (paginated?.items && paginated?.items.length === 0) ? (
          <div className="flex mb-4 w-full">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed">
                <thead className="text-xs text-gray-700 uppercase bg-white-50 dark:bg-white-700 dark:text-gray-400 shadow-none">
                  <tr>
                    {/* <th scope="col" className="px-6 py-3 text-slate-900">
                      <input
                        id={`checkbox-table-search`}
                        type="checkbox"
                        checked={checkedProduction.length == 5}
                        className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-500 dark:ring-offset-gray-100 dark:focus:ring-offset-gray-100 focus:ring-2 dark:bg-gray-100 dark:border-gray-900"
                        onClick={(e) => handleSelectAllProduction(e)}
                      />
                    </th> */}
                    <th scope="col" className="px-6 py-3 text-slate-900">
                      <div className="flex items-center">
                        DATE
                        <button>
                          <svg
                            className="w-3 h-3 ml-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"></path>
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-slate-900">
                      <div className="flex items-center">
                        MACHINE
                        <button>
                          <svg
                            className="w-3 h-3 ml-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"></path>
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-slate-900">
                      <div className="flex items-center">
                        PART
                        <button>
                          <svg
                            className="w-3 h-3 ml-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"></path>
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-slate-900">
                      <div className="flex items-center">
                        ID
                        <button>
                          <svg
                            className="w-3 h-3 ml-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"></path>
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-slate-900">
                      <div className="flex items-center">
                        STATUS
                        <button>
                          <svg
                            className="w-3 h-3 ml-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"></path>
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-slate-900">
                      <div className="flex items-center ">
                        TIME
                        <button>
                          <svg
                            className="w-3 h-3 ml-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"></path>
                          </svg>
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody
                  data-accordion="open"
                  className="border-t-4 border-indigo-900"
                >
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                    data-accordion-target="#accordion-arrow-icon-body-0"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-0"
                  >
                    <td className="pr-6 py-5">
                      {/* <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          className="pr-4 pl-2 h-4 stroke-2 stroke-gray-800"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <input
                          id="checkbox-table-search-0"
                          className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-500 dark:ring-offset-gray-100 dark:focus:ring-offset-gray-100 focus:ring-2 dark:bg-gray-100 dark:border-gray-900"
                          type="checkbox"
                        />
                        <label
                          htmlFor="checkbox-table-search-0"
                          className="sr-only"
                        ></label>
                      </div> */}
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    ></th>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 text-sm  flex flex-col text-gray-900"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-500"></span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-500"></span>
                    </td>
                  </tr>
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-200"
                    data-accordion-target="#accordion-arrow-icon-body-0"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-0"
                  >
                    <td className="pr-6 py-5">
                      {/* <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          className="pr-4 pl-2 h-4 stroke-2 stroke-gray-800"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <input
                          id="checkbox-table-search-0"
                          className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-500 dark:ring-offset-gray-100 dark:focus:ring-offset-gray-100 focus:ring-2 dark:bg-gray-100 dark:border-gray-900"
                          type="checkbox"
                        />
                        <label
                          htmlFor="checkbox-table-search-0"
                          className="sr-only"
                        ></label>
                      </div> */}
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    ></th>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 text-sm  flex flex-col text-gray-900"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-500"></span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-500"></span>
                    </td>
                  </tr>
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                    data-accordion-target="#accordion-arrow-icon-body-0"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-0"
                  >
                    <td className="pr-6 py-5">
                      {/* <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          className="pr-4 pl-2 h-4 stroke-2 stroke-gray-800"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <input
                          id="checkbox-table-search-0"
                          className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-500 dark:ring-offset-gray-100 dark:focus:ring-offset-gray-100 focus:ring-2 dark:bg-gray-100 dark:border-gray-900"
                          type="checkbox"
                        />
                        <label
                          htmlFor="checkbox-table-search-0"
                          className="sr-only"
                        ></label>
                      </div> */}
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    ></th>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 text-sm  flex flex-col text-gray-900"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-500"></span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-500"></span>
                    </td>
                  </tr>
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-200"
                    data-accordion-target="#accordion-arrow-icon-body-0"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-0"
                  >
                    <td className="pr-6 py-5">
                      {/* <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          className="pr-4 pl-2 h-4 stroke-2 stroke-gray-800"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <input
                          id="checkbox-table-search-0"
                          className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-500 dark:ring-offset-gray-100 dark:focus:ring-offset-gray-100 focus:ring-2 dark:bg-gray-100 dark:border-gray-900"
                          type="checkbox"
                        />
                        <label
                          htmlFor="checkbox-table-search-0"
                          className="sr-only"
                        ></label>
                      </div> */}
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    ></th>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 text-sm  flex flex-col text-gray-900"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-500"></span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-500"></span>
                    </td>
                  </tr>
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                    data-accordion-target="#accordion-arrow-icon-body-0"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-0"
                  >
                    <td className="pr-6 py-5">
                      {/* <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          className="pr-4 pl-2 h-4 stroke-2 stroke-gray-800"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <input
                          id="checkbox-table-search-0"
                          className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-500 dark:ring-offset-gray-100 dark:focus:ring-offset-gray-100 focus:ring-2 dark:bg-gray-100 dark:border-gray-900"
                          type="checkbox"
                        />
                        <label
                          htmlFor="checkbox-table-search-0"
                          className="sr-only"
                        ></label>
                      </div> */}
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    ></th>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 text-sm  flex flex-col text-gray-900"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-500"></span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-500"></span>
                    </td>
                  </tr>
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-200  "
                    data-accordion-target="#accordion-arrow-icon-body-1"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-1"
                  >
                    <td className="pr-6 py-5">
                      {/* <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          className="pr-4 pl-2 h-4 stroke-2 stroke-gray-800"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <input
                          id="checkbox-table-search-1"
                          className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-500 dark:ring-offset-gray-100 dark:focus:ring-offset-gray-100 focus:ring-2 dark:bg-gray-100 dark:border-gray-900"
                          type="checkbox"
                        />
                        <label
                          htmlFor="checkbox-table-search-1"
                          className="sr-only"
                        ></label>
                      </div> */}
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    ></th>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 text-sm flex flex-col text-gray-900"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-500"></span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-500"></span>
                    </td>
                  </tr>
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-100  "
                    data-accordion-target="#accordion-arrow-icon-body-2"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-2"
                  >
                    <td className="pr-6 py-5">
                      {/* <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          className="pr-4 pl-2 h-4 stroke-2 stroke-gray-800"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <input
                          id="checkbox-table-search-2"
                          className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-500 dark:ring-offset-gray-100 dark:focus:ring-offset-gray-100 focus:ring-2 dark:bg-gray-100 dark:border-gray-900"
                          type="checkbox"
                        />
                        <label
                          htmlFor="checkbox-table-search-2"
                          className="sr-only"
                        ></label>
                      </div> */}
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    ></th>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 text-sm flex flex-col text-gray-900"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-500"></span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-500"></span>
                    </td>
                  </tr>
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-200  "
                    data-accordion-target="#accordion-arrow-icon-body-3"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-3"
                  >
                    <td className="pr-6 py-5">
                      {/* <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          className="pr-4 pl-2 h-4 stroke-2 stroke-gray-800"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <input
                          id="checkbox-table-search-3"
                          className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-500 dark:ring-offset-gray-100 dark:focus:ring-offset-gray-100 focus:ring-2 dark:bg-gray-100 dark:border-gray-900"
                          type="checkbox"
                        />
                        <label
                          htmlFor="checkbox-table-search-3"
                          className="sr-only"
                        ></label>
                      </div> */}
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    ></th>
                    <td className="px-6 py-5"></td>
                    <td className="px-6 text-sm flex flex-col text-gray-900"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-500"></span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-500"></span>
                    </td>
                  </tr>
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                    data-accordion-target="#accordion-arrow-icon-body-4"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-4"
                  >
                    <td className="pr-6 py-5">
                      {/* <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          className="pr-4 pl-2 h-4 stroke-2 stroke-gray-800"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <input
                          id="checkbox-table-search-4"
                          className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-500 dark:ring-offset-gray-100 dark:focus:ring-offset-gray-100 focus:ring-2 dark:bg-gray-100 dark:border-gray-900"
                          type="checkbox"
                        />
                        <label
                          htmlFor="checkbox-table-search-4"
                          className="sr-only"
                        ></label>
                      </div> */}
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    ></th>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 text-sm flex flex-col text-gray-900"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-500"></span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-red-500"></span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
        <div className="border-t border-gray-300">
          <div className="flex w-full h-20 items-center justify-between px-4 py-3 sm:px-6">
            <div className="h-10 z-[-1] sm:hidden">
              <a
                href="#"
                className="absolute left-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                href="#"
                className="absolute right-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </a>
            </div>
            <div className="h-12 flex items-center justify-between w-full">
              <div className="">
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {paginated?.items?.length as number}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {paginated?.itemCount as number}
                  </span>{" "}
                  results
                </p>
              </div>
              <div className="h-12 text-end flex items-center ">
                <div className="">
                  <p className="text-sm text-gray-700">
                    Global Total Units :
                    {
                      //@ts-expect-error
                      globalMetrics?.items?.totalUnits !== undefined && (
                        <span>
                          {
                            //@ts-expect-error
                            globalMetrics?.items?.totalUnits
                          }
                        </span>
                      )
                    }
                  </p>
                  <p className="text-sm text-gray-700">
                    Global Total Tons :
                    {
                      //@ts-expect-error
                      globalMetrics?.items?.totalTons !== undefined && (
                        <span>
                          {
                            //@ts-expect-error
                            globalMetrics?.items?.totalTons.toFixed(4)
                          }
                        </span>
                      )
                    }
                  </p>

                  <p className="text-sm text-gray-700">
                    Global Units Per Hour :
                    {
                      //@ts-expect-error
                      globalMetrics?.items?.globalUnitsPerHour !==
                        undefined && (
                        <span>
                          {
                            //@ts-expect-error
                            globalMetrics?.items?.globalUnitsPerHour.toFixed(4)
                          }
                        </span>
                      )
                    }
                  </p>
                  <p className="text-sm text-gray-700">
                    Global Tons Per Hour :
                    {
                      //@ts-expect-error
                      globalMetrics?.items?.globalTonsPerHour !== undefined && (
                        <span>
                          {
                            //@ts-expect-error
                            globalMetrics?.items?.globalTonsPerHour.toFixed(4)
                          }
                        </span>
                      )
                    }
                  </p>
                </div>
              </div>

              <button
                className="flex justify-center items-center p-2 text-lg"
                onClick={() => handleProcess()}
              >
                {process ? "RESUME" : "PAUSE"}
              </button>
              <div>
                {isPaginatedLoading ? (
                  <div className="animate-pulse flex space-x-4">
                    <div className="h-8 w-36 mt-7 bg-slate-200 rounded"></div>
                  </div>
                ) : (
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => {
                        setCheckedProduction([]), setPage(page - 1)
                      }}
                      disabled={page === 1 || numberOfPages === 0}
                      className="relative disabled:opacity-70 inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon
                        className={`h-5 w-5 ${
                          page > 1 && "stroke-1 stroke-blue-950"
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                      {page} / {numberOfPages ? numberOfPages : 1}
                    </button>
                    <button
                      onClick={() => {
                        setCheckedProduction([]), setPage(page + 1)
                      }}
                      className="relative disabled:opacity-70 inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      disabled={page === numberOfPages || numberOfPages === 0}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon
                        className={`h-5 w-5 ${
                          numberOfPages > 1 &&
                          page < numberOfPages &&
                          "stroke-1 stroke-blue-950"
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LogsTable
