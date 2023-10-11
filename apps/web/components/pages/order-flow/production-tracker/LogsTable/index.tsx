"use client"
import { DatePicker, Space } from "antd"
// import Select from "react-select"
// import {
//   ChevronUpDownIcon,
//   EllipsisVerticalIcon,
//   MagnifyingGlassIcon,
// } from "@heroicons/react/24/solid"
// import useGetAllTimerLogs from "../../../../../hooks/timerLogs/useGetAllTimerLogs"
import dayjs from "dayjs"
// import {
//   AsyncPaginate,
//   reduceGroupedOptions,
// } from "react-select-async-paginate"
// import type { GroupBase, OptionsOrGroups } from "react-select"
import moment from "moment"

export type OptionType = {
  value: number
  label: string
}

import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
// import { usePathname } from "next/navigation"
import React, { Dispatch, useEffect, useState } from "react"
// import useGlobalTimerLogsMulti from "../../../../../hooks/timerLogs/useGlobalTimerLogsMultiFilter"
import useFactories from "../../../../../hooks/factories/useFactories"
import {
  T_Factory,
  T_Machine,
  T_MachineClass,
  T_Part,
  T_Locations,
  T_BackendResponse,
} from "custom-validator"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid"
// import useMachineClasses from "../../../../../hooks/machineClasses/useMachineClassByLocation"
// import useGetMachinesByMachineClasses from "../../../../../hooks/machines/useGetMachineByMachineClass"
import { set } from "mongoose"
import useGetMachinesByLocation from "../../../../../hooks/machines/useGetMachinesByLocation"
import useLocations from "../../../../../hooks/locations/useLocations"
import usePaginatedParts from "../../../../../hooks/parts/usePaginatedParts"
import { API_URL_PARTS } from "../../../../../helpers/constants"
import Cookies from "js-cookie"
import { useQueryClient } from "@tanstack/react-query"
import useGlobalTimerLogsMulti from "../../../../../hooks/timerLogs/useGetGlobalTimerLogsMultiFilter"
import useGetMachinesByMachineClasses from "../../../../../hooks/machines/useGetMachinesByMachineClasses"
import useMachineClasses from "../../../../../hooks/machineClasses/useMachineClassesByLocation"
import CustomSelect from "./CustomSelect"
import OutlinedInput from "@mui/material/OutlinedInput"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import ListItemText from "@mui/material/ListItemText"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import Checkbox from "@mui/material/Checkbox"
import { query } from "express"
import useGetPartsByMachineClasses from "../../../../../hooks/parts/useGetPartsByMachines"
import useGetGlobalMetrics from "../../../../../hooks/timerLogs/useGetGlobalMetrics"

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

  const [sortType, setSortType] = useState<string>("")
  const [keyword, setKeyword] = useState<string>("")
  const [process, setProcess] = useState<boolean>(false)
  const [minWidth, setMinWidth] = useState<number>(window.innerWidth)
  const [batchAction, setBatchAction] = useState<string>("")
  const [city, setCity] = useState<string[]>(["64d5814fb996589a945a6402"])
  const [cityLocation, setCityLocation] = useState<string[]>([])
  const [machineClass, setMachineClass] = useState<string[]>([])
  const [factoryById, setFactoryById] = useState<string>("")
  const [dateRange, setDateRange] = useState<Date[] | string[]>([])
  // const [endDate, setEndDate] = useState<Date | string>()
  const [parts, setParts] = useState([])
  const [checkedProduction, setCheckedProduction] = useState<{ id: string }[]>(
    []
  )
  const [partSelector, setPartSelector] = useState<string[]>([])
  const [partsSelected, setPartsSelected] = useState<string[]>([])
  const [machine, setMachine] = useState<string[]>([])
  const [search, setSearch] = useState<string>("")
  const [selectedMachineValues, setSelectedMachineValues] = useState<string[]>()
  const [loadedListOptions, setLoadedListOptions] = useState<
    { value: string; label: string }[]
  >([])
  const [loadOptionsCount, setLoadOptionsCount] = useState(0)
  const [typingTimeout, setTypingTimeout] = useState(null)
  const [cityCounter, setCityCounter] = useState<number>(city.length)
  const [machineClassCounter, setMachineClassCounter] = useState<number>()
  const [machineCounter, setMachineCounter] = useState<number>()
  const [partsCounter, setPartsCounter] = useState<number>(0)
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
  const today = moment()
  const [isCurrentDate, setCurrentDate] = useState(today.format("yyyy-MM-DD"))

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

  // const defaultDateRange = [moment('2023-10-01'), moment('2023-10-10')];
  // console.log("🚀 ~ file: index.tsx:155 ~ defaultDateRange:", defaultDateRange)
  // useEffect(() => {
  //   setMachineClass(machineClasses)
  // },[city])

  const { data: machines, isLoading: isMachinesLoading } =
    useGetMachinesByMachineClasses(machineClass)
  // const {data: partsData, isLoading: IsPartsLoading} = useGetPartsByMachineClasses(city, machineClass)
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

  // useEffect(() => {
  //   console.log("cityLocation", cityLocation)
  //   if (locations && locations.items) {
  //     // Find the matching location objects based on the keys
  //     const selectedLocations = locations.items.filter((item) => city.includes(item._id));

  //     // Extract the names from the matching location objects
  //     const selectedNames = selectedLocations.map((location) => location.name);

  //     // Set the selected names to cityLocation
  //     setCityLocation(selectedNames);
  //   } else {
  //     // Handle the case where locations or locations.items is undefined
  //     // You can set a default value or handle it as needed
  //     setCityLocation([]); // Set to an empty array as an example
  //   }

  // },[])
  useEffect(() => {
    setLocationId(city[0])
    setPartsPage(1)
    // console.log(city)
  }, [city, setLocationId])

  useEffect(() => {
    console.log("Selected part", partSelector)
    queryClient.invalidateQueries({
      queryKey: ["global-timer-logs"],
    })
  }, [partSelector])

  const handlePartSelect = (e: any) => {
    console.log(e)
    const val = e.map((i) => i)
    console.log("🚀 ~ file: index.tsx:1681 ~ handlePartSelect ~ obj:", e)
    setPartSelector(e)
    console.log(
      "🚀 ~ file: index.tsx:1676 ~ LogsTable ~ partSelector:",
      partSelector
    )
  }

  useEffect(() => {
    // console.log("Part selector after update:", partSelector)
    setPartSelector(partSelector)
  }, [partSelector])

  // const customStyles = {
  //   control: (provided: any, state: any) => ({
  //     ...provided,
  //     width: "15rem",
  //     height: "2rem",
  //     overflow: "hidden",
  //     flex: "nowrap",
  //     display: "flex",
  //     borderRadius: "15px",
  //     border: "1px solid #ccc",
  //     marginLeft: "5px",
  //     boxShadow: state.isFocused ? "0 0 0 2px #ccc" : null,
  //   }),
  //   option: (provided: any, state: any) => ({
  //     ...provided,
  //     backgroundColor: state.isFocused ? "#3699FF" : null,
  //     color: state.isFocused ? "white" : null,
  //   }),
  // }

  // const loadOptions = (inputValue: string) => {
  //   // Assuming the response is an array of items
  //   const newOptions =
  //     allParts?.items?.map((item: T_Part) => ({
  //       value: item._id as string,
  //       label: item.name,
  //     })) || []

  //   const totalPages = allParts?.itemCount
  //   console.log(totalPages)

  //   // Check if the map function has reached the end of allParts
  //   if (newOptions.length === allParts?.items?.length) {
  //     if (numberOfPartsPages > partsPage) {
  //       // Increment partsPage by 1 when mapping is finished
  //       setPartsPage(partsPage + 1)
  //     }
  //   }

  //   return {
  //     options: newOptions || [],
  //     hasMore: true,
  //   }
  // }

  // const loadOptions = async (inputValue: string, loadOption: any, {page}:any) => {
  //   // Check if the search box is not empty
  //   // if (inputValue.trim() !== "") {
  //   //   setLoadOptionsCount(loadOptionsCount + 1)
  //   //   setPartsPage(1) // Reset partsPage to an empty value
  //   // } else {
  //   //   setLoadOptionsCount(0)
  //   // }
  //   // //   // Assuming the response is an array of items
  //   const newOptions = await
  //     allParts?.items?.map((item: T_Part) => ({
  //       value: item._id as string,
  //       label: item.name as string,
  //     })) || []

  //   // // Filter options based on the inputValue
  //   // const filteredOptions = newOptions.filter((option) =>
  //   //   option.label.toLowerCase().includes(inputValue.toLowerCase())
  //   // )

  //   // // Check if the map function has reached the end of allParts
  //   // if (filteredOptions.length === allParts?.items?.length) {
  //   //   if (numberOfPartsPages > partsPage) {
  //   //     // Increment partsPage by 1 when mapping is finished
  //   //     setPartsPage(partsPage + 1)
  //   //   }
  //   // }
  //   // setLoadedListOptions(filteredOptions)
  //   console.log("the filteredOptions", newOptions)
  //   setPage(page + 1)
  //   return {
  //     options: newOptions || [],
  //     hasMore: true,
  //     additional: {
  //       page: page,
  //     }
  //   }
  // }
  // type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  //   items: T_Part[]
  // }
  useEffect(() => {
    const token = Cookies.get("tfl")
    const locationsQuery = new URLSearchParams({ locations: city }).toString()
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
      console.log(responseJSON)
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
  const numberOfPages = Math.ceil((paginated?.itemCount as number) / 5)

  useEffect(() => {
    setMachineClassId(machineClass)
    setPage(1)
  }, [machineClass, setFactoryId])

  useEffect(() => {
    setMachineId(machine)
    setPage(1)
  }, [machine, setMachineId])

  useEffect(() => {
    console.log("selectparts", partsSelected)
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
    console.log("selectparts", partsSelected)
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
      const currentDate = dayjs().toDate() // Get the current date
      // console.log(dayjs().format('YYYY-MM-DD'))
      setDateRange([dayjs().format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")])
      datePick([currentDate, currentDate]) // Call datePick with the current date
    } else {
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
      console.log(dayjs().format("YYYY-MM-DD"))
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
    // if(Array.isArray(event.target.value[0])){
    //   const cityInfo = event.target.value[0]
    //   console.log("handleLocationChange", cityInfo[0], cityInfo[1] )
    //   setCity(cityInfo[0])
    //   setCityLocation([...cityLocation, cityInfo[1]])
    //   setCounter(selectedValues.length);
    // }else{
    //   setCity(event.target.value[0])
    //   setCityLocation(event.target.value[1])
    // }
    setCity(event.target.value)
  }

  useEffect(() => {
    setCityCounter(city.length)
  }, [city])

  const handleMachineClassChange = (event: any) => {
    // console.log(`selected ${value}`);
    setMachineClass(event.target.value)
  }

  useEffect(() => {
    setMachineClassCounter(machineClass.length)
  }, [machineClass])

  const handleMachineChange = (event: any) => {
    // console.log(`selected ${value}`);
    setSelectedMachineValues(event.target.value)
    setMachine(event.target.value)
  }

  useEffect(() => {
    setMachineCounter(machine.length)
  }, [machine])

  const handlePartsChange = (event: any) => {
    // console.log(`selected ${value}`);
    // setSelectedMachineValues(event.target.value);
    setPartsSelected(event.target.value)
  }

  useEffect(() => {
    setPartsCounter(partsSelected.length)
  }, [partsSelected])

  // const TextWithCheckbox = (props: any) => {
  //   return (
  //     <div className="w-full flex justify-between">
  //       {props.children}
  //       <Checkbox checked={props.checked} />
  //     </div>
  //   );
  // };

  useEffect(() => {
    // console.log(filterBy)
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

  const handleSelectAllProduction = (event: any) => {
    const data = paginated?.items ?? []
    let updatedArray = [] as any
    updatedArray =
      data?.length > 0 && event.target.checked
        ? data
            ?.filter((item) => item?._id !== undefined)
            .map((item) => ({ id: item?._id }))
        : []
    setCheckedProduction(updatedArray)
  }

  // const handleCurrentDateChecked = (event: any) => {

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
                            <Checkbox checked={city.includes(item._id)} />
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
                      }}
                      value={machineClass}
                      onChange={(event) => handleMachineClassChange(event)}
                      renderValue={() => `${machineClassCounter} selected`}
                      MenuProps={MenuProps}
                    >
                      {machineClasses?.items?.map(
                        (item: T_MachineClass, index: number) => (
                          <MenuItem
                            key={index}
                            // value={[item._id, item.name ] as string[]}
                            value={item._id as string}
                          >
                            <ListItemText primary={item.name} />
                            <Checkbox
                              checked={machineClass.includes(item._id)}
                            />
                          </MenuItem>
                        )
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
                      {machines?.items?.map(
                        (item: T_Machine, index: number) => (
                          <MenuItem
                            key={index}
                            // value={[item._id, item.name ] as string[]}
                            value={item._id as string}
                          >
                            <ListItemText primary={item.name} />
                            <Checkbox checked={machine.includes(item._id)} />
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </div>
                {/* part selector */}
                <div className="flex w-1/2 text-[11px] items-center">
                  <p className="w-1/6 font-semibold text-right mr-2">
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
                      }}
                      value={partsSelected}
                      onChange={(event) => handlePartsChange(event)}
                      renderValue={() => `${partsCounter} selected`}
                      MenuProps={MenuProps}
                    >
                      {parts?.items?.map((item: T_Part, index: number) => (
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
                      ))}
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
                        // value={dateRange}
                        disabledDate={disabledDate}
                        onChange={(e) => datePick(e)}
                      />
                    </Space>
                  </div>
                </div>
                {/* Generate report */}
                <div className="flex w-1/2 text-[11px] items-center justify-end px-14">
                  <p className="flex justify-center py-2 px-2 border rounded-lg border-1 border-black bg-red-900 text-slate-50">
                    GENERATE REPORT
                  </p>
                </div>
              </div>
              <div className="w-full flex text-[12px] px-[30.3%] font-semibold">
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
                        checked={checkedProduction.length == 5}
                        className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-500 dark:ring-offset-gray-100 dark:focus:ring-offset-gray-100 focus:ring-2 dark:bg-gray-100 dark:border-gray-900"
                        onClick={(e) => handleSelectAllProduction(e)}
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
                          onClick={(e) => handleInputChange(e, "machine")}
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
                        <button onClick={(e) => handleInputChange(e, "part")}>
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
                        <button onClick={(e) => handleInputChange(e, "id")}>
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
                              {/* @ts-expect-error */}
                              {item?.machineId.name}
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
                                      <span className="flex w-[22rem] text-[13px] text-slate-900 ">
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
                                          className={`px-3 py-4 text-sm text-gray-500 ${
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
          {/* <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label
                  htmlFor="filterBy"
                  className="block text-sm font-medium text-gray-900"
                >
                  Filter By
                </label>
                <select
                  id="filterBy"
                  name="filterBy"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6"
                  onChange={(e) => setFilterBy(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Factories">Factory</option>
                  <option value="Machine Classes">Machine Class</option>
                  <option value="Machines">Machine</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-900"
                >
                  {filterBy}
                </label>
                {filterInputs()}
              </div>
            </div> */}
        </div>
        {isPaginatedLoading ? (
          <div className="flex items-center justify-center mb-4 mt-9 w-full h-80">
            <div
              className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-dark-blue rounded-full my-1 mx-2"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : null}
        {/* {!isPaginatedLoading &&
          paginated?.items &&
          paginated?.items.length > 0 ? (
            <table className="w-full divide-y divide-gray-300 border-t border-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className={`text-sm py-3.5 pr-3 text-left font-semibold text-gray-900 pl-4 lg:pl-8 uppercase`}
                  >
                    <a href="#" className="group inline-flex items-center">
                      ID
                      <span className="ml-2 flex-none rounded text-gray-400">
                        <ChevronUpDownIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>
                    </a>
                  </th>
                  <th
                    scope="col"
                    className={`text-sm px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
                  >
                    <a href="#" className="group inline-flex items-center">
                      Date
                      <span className="ml-2 flex-none rounded text-gray-400">
                        <ChevronUpDownIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>
                    </a>
                  </th>
                  <th
                    scope="col"
                    className={`text-sm px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
                  >
                    <a href="#" className="group inline-flex items-center">
                      Product
                      <span className="ml-2 flex-none rounded text-gray-400">
                        <ChevronUpDownIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>
                    </a>
                  </th>
                  <th
                    scope="col"
                    className={`text-sm px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
                  >
                    <a href="#" className="group inline-flex items-center">
                      Operator
                      <span className="ml-2 flex-none rounded text-gray-400">
                        <ChevronUpDownIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>
                    </a>
                  </th>
                  <th
                    scope="col"
                    className={`text-sm px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
                  >
                    <a href="#" className="group inline-flex items-center">
                      Status
                      <span className="ml-2 flex-none rounded text-gray-400">
                        <ChevronUpDownIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>
                    </a>
                  </th>
                  <th
                    scope="col"
                    className={`text-sm px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
                  >
                    <a href="#" className="group inline-flex items-center">
                      Time
                      <span className="ml-2 flex-none rounded text-gray-400">
                        <ChevronUpDownIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>
                    </a>
                  </th>
                  <th
                    scope="col"
                    className={`text-sm px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
                  >
                    <a href="#" className="group inline-flex items-center">
                      Stop Reason
                      <span className="ml-2 flex-none rounded text-gray-400">
                        <ChevronUpDownIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>
                    </a>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginated?.items &&
                  paginated?.items.map((item, idx) => (
                    <tr key={idx} className={`${!item.jobId ? "bg-red-50" : ""}`}>
                      <td
                        className={`py-4 pl-4 pr-3 text-sm font-medium sm:pl-6 lg:pl-8 ${
                          item.jobId ? "text-gray-900" : "text-red-500"
                        }`}
                      >
                        {item.globalCycle ? item.globalCycle : ""}
                      </td>
                      <td
                        className={`px-3 py-4 text-sm text-gray-500 flex flex-col ${
                          item.jobId ? "text-gray-900" : "text-red-500"
                        }`}
                      >
                        <span>
                          {dayjs
                            .tz(dayjs(item.createdAt), "America/Chicago")
                            .format("MM/DD/YYYY")}
                        </span>
                        <span>
                          {dayjs
                            .tz(dayjs(item.createdAt), "America/Chicago")
                            .format("h:mm A")}
                        </span>
                      </td>
                      <td
                        className={`px-3 py-4 text-sm text-gray-500 ${
                          item.jobId ? "text-gray-900" : "text-red-500"
                        }`}
                      >
                        {typeof item.partId === "object" ? item.partId.name : ""}
                      </td>
                      <td
                        className={`px-3 py-4 text-sm text-gray-500 ${
                          item.jobId ? "text-gray-900" : "text-red-500"
                        }`}
                      >
                        {typeof item.operator === "object"
                          ? item.operator?.firstName
                          : ""}{" "}
                        {typeof item.operator === "object"
                          ? item.operator?.lastName
                          : ""}
                      </td>
                      <td className={`px-3 py-4 text-sm text-gray-500`}>
                        {item.status === "Gain" ? (
                          <span
                            className={`font-bold ${
                              item.jobId ? "text-green-500" : "text-red-500"
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
                      <td className={`px-3 py-4 text-sm`}>
                        {item.status === "Gain" ? (
                          <span
                            className={`font-bold ${
                              item.jobId ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {item.time.toFixed(2)}s
                          </span>
                        ) : (
                          <span className="font-bold text-red-500">
                            {item.time.toFixed(2)}s
                          </span>
                        )}
                      </td>
                      <td
                        className={`px-3 py-4 text-sm text-gray-500 ${
                          item.jobId ? "text-gray-900" : "text-red-500"
                        }`}
                      >
                        {item.stopReason.join(", ")}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : null} */}
        {!isPaginatedLoading &&
        paginated?.items &&
        paginated?.items.length === 0 ? (
          <div className="flex mb-4 w-full">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed">
                <thead className="text-xs text-gray-700 uppercase bg-white-50 dark:bg-white-700 dark:text-gray-400 shadow-none">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-slate-900">
                      <input
                        id={`checkbox-table-search`}
                        type="checkbox"
                        checked={checkedProduction.length == 5}
                        className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-500 dark:ring-offset-gray-100 dark:focus:ring-offset-gray-100 focus:ring-2 dark:bg-gray-100 dark:border-gray-900"
                        onClick={(e) => handleSelectAllProduction(e)}
                      />
                    </th>
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
                    <td className="pr-6 py-9">
                      <div className="flex items-center">
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
                      </div>
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
                    <td className="pr-6 py-9">
                      <div className="flex items-center">
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
                      </div>
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
                    <td className="pr-6 py-9">
                      <div className="flex items-center">
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
                      </div>
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
                    <td className="pr-6">
                      <div className="flex items-center">
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
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    ></th>
                    <td className="px-6 py-9"></td>
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
                    <td className="pr-6 py-9">
                      <div className="flex items-center">
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
                      </div>
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
              {globalMetrics?.items?.map((item, index) => (
                <div key={index} className="h-12 text-end flex items-center ">
                  <div className="">
                    <p className="text-sm text-gray-700">
                      Global Total Units :
                      {item.totalUnits !== undefined && (
                        <span>{item.totalUnits}</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-700">
                      Global Total Tons :
                      {item.totalTons !== undefined && (
                        <span>{item.totalTons}</span>
                      )}
                    </p>

                    <p className="text-sm text-gray-700">
                      Global Units Per Hour :
                      {item.globalUnitsPerHour !== undefined && (
                        <span>{item.globalUnitsPerHour}</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-700">
                      Global Tons Per Hour :
                      {item.globalTonsPerHour !== undefined && (
                        <span>{item.globalTonsPerHour}</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}

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
