"use client"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import { Fragment, useCallback, useEffect, useState } from "react"
import {
  T_BackendResponse,
  T_Locations,
  T_MachineClass,
  T_UserRole,
} from "custom-validator"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid"
import usePaginatedUsers from "../../../hooks/users/useGetPaginatedUsers"
import NewMemberModal from "./modals/NewMemberModal"
import useLocations from "../../../hooks/locations/useLocations"
import { USER_ROLES, USER_STATUSES } from "../../../helpers/constants"
import { T_User, T_UserStatus } from "custom-validator"
import { Menu, Transition } from "@headlessui/react"
import combineClasses from "../../../helpers/combineClasses"
import useFactories from "../../../hooks/factories/useFactories"
import useUpdateUser from "../../../hooks/users/useUpdateUser"
import { useQueryClient } from "@tanstack/react-query"
import ConfirmationModal from "./modals/ConfirmationModal"
import DeleteModal from "./modals/DeleteModal"
import useProfile from "../../../hooks/users/useProfile"
import useStoreSession from "../../../store/useStoreSession"
import useMachineClasses from "../../../hooks/machineClasses/useMachineClasses"
import React from "react"
import { Alert } from "antd"
import toast from "react-hot-toast"
import { FormControl, MenuItem, Checkbox, OutlinedInput } from "@mui/material"
import Select from "@mui/material/Select"
interface ContentProps {
  userLog: string
}

const Content: React.FC<ContentProps> = ({ userLog }) => {
  const [userRole, setUserRole] = useState<string | undefined>(userLog)
  const [checkedProved, setCheckedProved] = useState<boolean>(true)
  const roleFilter = (): string[] => {
    if (userRole === "HR") {
      return ["Production", "Corporate", "Personnel", "HR"]
    } else if (userRole === "Production") {
      return ["Personnel"]
    } else if (
      userRole === "Administrator" ||
      userRole === "HR_Director" ||
      userRole === "Super"
    ) {
      return [
        "Administrator",
        "Production",
        "Corporate",
        "Personnel",
        "Dev",
        "HR",
      ]
    } else {
      return [""]
    }
  }

  const deptNameHr = ["Accounting", "Sales"]

  const approveChecking = (item: any, userId: string) => {
    if (
      storeSession?.role === "Administrator" ||
      storeSession?.role === "HR_Director" ||
      (storeSession?.role === "Production" && item._id === userId)
    ) {
      setCheckedProved(true)
    } else {
      setCheckedProved(false)
    }
  }

  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const storeSession = useStoreSession(
    (
      state: {
        role:
          | "Administrator"
          | "Corporate"
          | "Production"
          | "Personnel"
          | "HR"
          | "HR_Director"
          | "Accounting"
          | "Sales"
          | "Super"
          | "Accounting_Director"
          | "Sales_Director"
          | "Corporate_Director"
        email: string
        token: string | null
      } & {
        update: (session: {
          role:
            | "Administrator"
            | "Corporate"
            | "Production"
            | "Personnel"
            | "HR"
            | "HR_Director"
            | "Accounting"
            | "Sales"
            | "Super"
            | "Accounting_Director"
            | "Sales_Director"
            | "Corporate_Director"
          email: string
          token: string | null
        }) => void
        reset: () => void
      }
    ) => state
  )

  const queryClient = useQueryClient()
  const [isOpenTeam, setIsOpenTeam] = useState(false)
  const { data: userProfile } = useProfile()
  const [newModal, setNewModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("Pending")
  const [confirmationModal, setConfirmationModal] = useState(false)
  const [selectedColor, setSelectedColor] = useState("text-green-900")
  const [selectedRole, setSelectedRole] = useState(
    storeSession?.role === "Production"
      ? "Personnel"
      : storeSession?.role === "HR_Director"
      ? "HR"
      : storeSession?.role
  )
  const [selectedRow, setSelectedRow] = useState<T_User | null>(null)
  const [errorMsg, setErrorMsg] = useState("")
  const { mutate, isLoading: isUpdateUserLoading } = useUpdateUser()
  const [action, setAction] = useState<T_UserStatus | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenRole, setIsOpenRole] = useState()
  const [isOpenFactory, setIsOpenFactory] = useState()
  const [departments, setDepartment] = useState<string[]>(deptNameHr)
  const [alertPrompt, setAlertPrompt] = useState(false)
  const [directorStates, setDirectorStates] = useState([])
  const [accDirectorStates, setAccDirectorStates] = useState([])
  const [isOpenLocation, setIsOpenLocation] = useState(undefined)
  const [selectedFactoryIds, setSelectedFactoryIds] = useState([""])
  const [selectedFactories, setSelectedFactories] = useState<string[]>([])
  const [factoryMachineClasses, setFactoryMachineClasses] = useState([])
  const [selectedCity, setSelectedCity] = useState<string[]>([])
  const [printAll, setPrintAll] = useState("")
  const [selectedCityIds, setSelectedCityIds] = useState([""])
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState([""])
  const [selectedMachineClassIds, setSelectedMachineClassIds] = useState([""])
  const { data: locations, isLoading: isLocationsLoading } = useLocations()
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  const [selectedMachineClasses, setSelectedMachineClasses] = useState<
    string[]
  >([])
  const [checkedProduction, setCheckedProduction] = useState<{ id: string }[]>(
    []
  )
  const [firstLoad, setFirstLoad] = useState(true)
  const {
    data: paginated,
    isLoading: isPaginatedLoading,
    page,
    sortType,
    setPage,
    setRole,
    setMachineClass,
    setLocationId,
    setFactories,
    setStatus,
    setName,
    setKeyword,
    setSortType,
  } = usePaginatedUsers(
    "Pending",
    storeSession?.role === "Production"
      ? "Personnel"
      : storeSession?.role === "HR_Director"
      ? "HR"
      : storeSession?.role
  )

  useEffect(() => {
    if (paginated?.itemCount === 0 && firstLoad) {
      handleSelectDropdown("Approved")
      setFirstLoad(false)
    }
  }, [paginated])

  const { data: machineClass, isLoading: isMachineLoading } =
    useMachineClasses()

  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id))
  }

  useEffect(() => {
    const handleLocationClick = (event: any) => {
      const dropdownButton = document.getElementById("dropdownLocationButton")
      const dropdown = document.getElementById("dropdownLocation")

      if (
        dropdown &&
        !dropdown.contains(event.target) &&
        event.target !== dropdownButton
      ) {
        setIsOpenLocation(undefined)
      }
    }

    document.addEventListener("click", handleLocationClick)

    return () => {
      document.removeEventListener("click", handleLocationClick)
    }
  }, [isOpenLocation])

  useEffect(() => {
    const handleFactoryClick = (event: any) => {
      const dropdownButton = document.getElementById("dropdownFactoryButton")
      const dropdown = document.getElementById("dropdownFactory")

      if (
        dropdown &&
        !dropdown.contains(event.target) &&
        event.target !== dropdownButton
      ) {
        setIsOpenFactory(undefined)
      }
    }

    document.addEventListener("click", handleFactoryClick)

    return () => {
      document.removeEventListener("click", handleFactoryClick)
    }
  }, [isOpenFactory])

  useEffect(() => {
    const handleRoleClick = (event: any) => {
      const dropdownButton = document.getElementById("dropdownRoleButton")
      const dropdown = document.getElementById("dropdownRole")

      if (
        dropdown &&
        !dropdown.contains(event.target) &&
        event.target !== dropdownButton
      ) {
        setIsOpenRole(undefined)
      }
    }

    document.addEventListener("click", handleRoleClick)

    return () => {
      document.removeEventListener("click", handleRoleClick)
    }
  }, [isOpenRole])

  useEffect(() => {
    if (alertPrompt) {
      const timeoutId = setTimeout(() => {
        setAlertPrompt(false)
      }, 4000) // 2000 milliseconds = 2 seconds

      // Clear the timeout in case the component unmounts or alertPrompt becomes false before the timeout completes.
      return () => clearTimeout(timeoutId)
    }
  }, [alertPrompt])

  const numberOfPages = Math.ceil((paginated?.itemCount as number) / 7)
  const ARR_USER_ROLES = [
    ...(storeSession?.role === "Super" ? [USER_ROLES.Administrator] : []),
    USER_ROLES.Production,
    USER_ROLES.Personnel,
    USER_ROLES.Corporate,
    USER_ROLES.HR,
    USER_ROLES.Accounting,
    USER_ROLES.Sales,
  ]

  const isChecked = (id: string) => {
    return checkedProduction.filter((item) => item.id === id).length > 0
  }

  const callBackReq = {
    onSuccess: (data: T_BackendResponse) => {
      if (!data.error) {
        queryClient.invalidateQueries({
          queryKey: ["paginated-users"],
        })
        toast.success("User has been updated")
      } else {
        toast.error(String(data.message))
      }
    },
    onError: (err: any) => {
      toast.error(String(err))
    },
  }

  useEffect(() => {
    if (
      storeSession?.role === "Super" ||
      storeSession?.role === "Administrator" ||
      storeSession?.role === "HR_Director"
    ) {
      //@ts-expect-error
      setLocationId(locations?.items.map((item: any) => item._id))
    } else {
      //@ts-expect-error
      setLocationId(userProfile?.item?.locationId)
    }
  }, [userProfile, setLocationId, locations])

  useEffect(() => {
    if (selectedFactoryIds) {
      const factoryMachineClasses: string[] = machineClass?.items?.filter(
        (item: any) => selectedFactoryIds?.includes(item.factoryId)
      )

      //@ts-expect-error
      setFactoryMachineClasses(factoryMachineClasses)
      setSelectedMachineClasses(
        factoryMachineClasses?.map((item: any) => item.name)
      )
    } else {
      const machineClassName: string[] = []
      const machineClassIds: string[] = []
      machineClass?.items.forEach((item: T_MachineClass) => {
        machineClassName.push(item.name)
        machineClassIds.push(item._id as string)
      })
      //@ts-expect-error
      setFactoryMachineClasses(machineClassName)
      setSelectedMachineClasses(machineClassName)
      // setSelectedMachineClassIds(machineClassIds)
    }
  }, [selectedFactoryIds, machineClass])

  const handleTeamListing = (item: any) => {
    setIsOpenRole(undefined)
    setOpenAccordion(null)
    setIsOpenTeam(false)
    setSelectedRole(item)
    setRole(item)
    setPage(1)
    setKeyword("")
  }

  const statusArray = Object.values(USER_STATUSES).filter(
    (status) => status !== USER_STATUSES.Blocked
  )
  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleSelectDropdown = (value: T_UserStatus) => {
    setIsOpenRole(undefined)
    setSelectedStatus(value)
    setOpenAccordion(null)
    setIsOpen(false)
    setStatus(value)
    setPage(1)

    const colorMapping: { [key: string]: string } = {
      Pending: "text-yellow-700",
      Approved: "text-green-800",
      Rejected: "text-red-800",
      Archived: "text-yellow-500",
    }
    setSelectedColor(colorMapping[value] || "")
  }

  const handleHideFactory = (idx: any) => {
    if (isOpenFactory || isOpenFactory == 0) setIsOpenFactory(undefined)
    else setIsOpenFactory(idx)
  }

  const handleHideRole = (idx: any) => {
    if (isOpenRole || isOpenRole == 0) setIsOpenRole(undefined)
    else setIsOpenRole(idx)
  }

  const handleHideLocation = (idx: any) => {
    if (isOpenLocation || isOpenLocation == 0) setIsOpenLocation(undefined)
    else setIsOpenLocation(idx)
  }

  const onSearch = (e: any) => {
    setName(e.target.value)
  }

  const ITEM_HEIGHT = 30
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5,
        padding: 0,
      },
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left",
      },
      transformOrigin: {
        vertical: "top",
        horizontal: "left",
      },
      getContentAnchorEl: null,
    },
  }

  const handleDirectorCheck = (idx: any, item: any) => {
    const updatedstates: any = [...directorStates]
    updatedstates[idx] = !directorStates[idx]
    setDirectorStates(updatedstates)
    let updatedItem: any = {}
    if (item.role === "HR") {
      updatedItem = {
        ...item,
        role: "HR_Director" as T_UserRole,
      }
    } else {
      updatedItem = {
        ...item,
        role: "HR" as T_UserRole,
      }
    }
    mutate(updatedItem, callBackReq)
  }

  const handleAccDirectorCheck = (idx: any, item: any) => {
    const updatedstates: any = [...accDirectorStates]
    updatedstates[idx] = !accDirectorStates[idx]
    setAccDirectorStates(updatedstates)
    let updatedItem: any = {}
    if (item.role === "Accounting") {
      updatedItem = {
        ...item,
        role: "Accounting_Director" as T_UserRole,
      }
    } else if (item.role === "Sales") {
      updatedItem = {
        ...item,
        role: "Sales_Director" as T_UserRole,
      }
    } else if (item.role === "Corporate") {
      updatedItem = {
        ...item,
        role: "Corporate_Director" as T_UserRole,
      }
    } else {
      if (item.role === "Accounting_Director") {
        updatedItem = {
          ...item,
          role: "Accounting" as T_UserRole,
        }
      } else if (item.role === "Sales_Director") {
        updatedItem = {
          ...item,
          role: "Sales" as T_UserRole,
        }
      } else if (item.role === "Corporate_Director") {
        updatedItem = {
          ...item,
          role: "Corporate" as T_UserRole,
        }
      }
    }
    mutate(updatedItem, callBackReq)
  }

  const checkCity = locations?.items.find(
    (locationName: any) => locationName._id === userProfile?.item.locationId
  )

  const checkFactory = factories?.items.find(
    (factoryName: any) => factoryName._id === userProfile?.item.factoryId
  )

  useEffect(() => {
    setSelectedFactoryIds(checkFactory?._id)
  }, [checkFactory])

  // Factories Multi Select Function

  const handleFactorySelection = (event: any) => {
    const selectedFactories = event.target.value
    setSelectedFactories(selectedFactories)

    const updatedFactoryIds: any = []

    selectedFactories.forEach((selectedFactoryName: string) => {
      const factory: any = factories?.items.find(
        (item: any) => item.name === selectedFactoryName
      )
      if (factory) {
        updatedFactoryIds.push(factory._id)
      }
    })
    setSelectedFactoryIds(updatedFactoryIds)
    updatedFactoryIds.length === factories?.items?.length
      ? setFactories("")
      : setFactories(updatedFactoryIds)
  }

  useEffect(() => {
    if (factories?.items) {
      const factoryNames: string[] = []
      const factoryIds: string[] = []

      factories.items.forEach((item: any) => {
        factoryNames.push(item.name)
        factoryIds.push(item._id)
      })
      setSelectedFactories(factoryNames)
      setSelectedFactoryIds(factoryIds)
    }
  }, [factories])

  const renderSelectValueFactory = (selected: any) => {
    return selectedFactories.length === factories?.items.length
      ? "All"
      : selected.join(", ")
  }

  const handleCitySelection = (event: any) => {
    const selectedCities = event.target.value
    setSelectedCity(selectedCities)

    const updatedCityIds: string[] = []

    selectedCities.forEach((selectedCityName: string) => {
      const city: any = locations?.items.find(
        (item: any) => item.name === selectedCityName
      )
      if (city) {
        updatedCityIds.push(city._id)
      }
    })

    setSelectedCityIds(updatedCityIds)
    setLocationId(updatedCityIds)
  }

  useEffect(() => {
    if (
      userProfile?.item.role === "Production" ||
      (userProfile?.item.role === "HR" &&
        userProfile?.item.locationId &&
        locations?.items)
    ) {
      const matchingLocation = locations?.items.find(
        (item: Record<string, any>) => item._id === userProfile?.item.locationId
      )

      if (matchingLocation) {
        setSelectedCity([matchingLocation.name])
        setSelectedCityIds([String(matchingLocation?._id)])
      }
    } else if (locations?.items) {
      const locationNames: string[] = []
      const locationIds: string[] = []

      locations.items.forEach((item: T_Locations) => {
        locationNames.push(item.name)
        locationIds.push(item._id as string)
      })

      setSelectedCity(locationNames)
      setSelectedCityIds(locationIds)
    }
  }, [userProfile, locations])

  useEffect(() => {
    if (
      userProfile?.item.role === "Production" &&
      userProfile?.item.factoryId &&
      factories?.items
    ) {
      const userFactory = factories.items.find(
        (item: Record<string, any>) => item._id === userProfile?.item.factoryId
      )

      if (userFactory) {
        setFactories(String(userFactory?._id))
        setSelectedFactories([userFactory.name])
        setSelectedFactoryIds([String(userFactory?._id)])
      }
    }
  }, [userProfile, factories])

  const renderSelectValue = (selected: any) => {
    return selectedCity.length === locations?.items.length
      ? "All"
      : selected.join(", ")
  }

  const handleMachineClassSelection = (event: any) => {
    const selectedMachineClass = event.target.value
    setSelectedMachineClasses(selectedMachineClass)
    const updatedMachineClassIds: any = []

    selectedMachineClass.forEach((selectedMachineClassName: string) => {
      const machineClasses: any = machineClass?.items.find(
        (item: any) => item.name === selectedMachineClassName
      )
      if (machineClasses) {
        updatedMachineClassIds.push(machineClasses._id)
      }
    })
    setSelectedMachineClassIds(updatedMachineClassIds)
    updatedMachineClassIds.length === machineClass?.items?.length
      ? setMachineClass("")
      : setMachineClass(updatedMachineClassIds)
  }

  // useEffect(() => {
  //   if (machineClass?.items) {
  //     const machineClassName: string[] = []
  //     const machineClassIds: string[] = []
  //     machineClass?.items.forEach((item: any) => {
  //       machineClassName.push(item.name)
  //       machineClassIds.push(item._id)
  //     })
  //     setSelectedMachineClasses(machineClassName)
  //     setSelectedMachineClassIds(machineClassIds)
  //   }
  // }, [machineClass])

  const renderSelectValueMachineClass = (selected: any) => {
    return selectedMachineClasses.length === machineClass?.items.length
      ? "All"
      : selected.join(", ")
  }

  const handleDepartmentSelection = (event: any) => {
    const selectedDepts = event.target.value
    const updatedDepartments: string[] = []

    selectedDepts.forEach((selectDepartment: string) => {
      const department: any = deptNameHr.find(
        (item: string) => item === selectDepartment
      )
      if (department && !updatedDepartments.includes(department)) {
        updatedDepartments.push(department)
      }
    })

    // Assuming setDepartment is a state update function
    setDepartment(updatedDepartments)
  }

  const renderDeptSelectValue = (selected: any) => {
    return departments.length === deptNameHr.length
      ? "All"
      : selected.join(", ")
  }

  useEffect(() => {
    function handleGlobalClick(event: any) {
      if (!event.target.closest(".your-dropdown-container")) {
        setIsOpenTeam(false)
      }
    }

    document.addEventListener("click", handleGlobalClick)

    return () => {
      document.removeEventListener("click", handleGlobalClick)
    }
  }, [isOpenTeam])

  useEffect(() => {
    function handleGlobalClickTwo(event: any) {
      if (!event.target.closest(".your-dropdown-container")) {
        setIsOpen(false)
      }
    }

    document.addEventListener("click", handleGlobalClickTwo)

    return () => {
      document.removeEventListener("click", handleGlobalClickTwo)
    }
  }, [isOpen])

  const handleFactoryClose = useCallback(
    (event: Event) => {
      const dropdown = document.getElementById("dropdownFactory")

      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsOpenFactory(undefined)
      }
    },
    [setIsOpenFactory]
  )

  useEffect(() => {
    document.addEventListener("click", handleFactoryClose)

    return () => {
      document.removeEventListener("click", handleFactoryClose)
    }
  }, [handleFactoryClose, isOpenFactory])

  const handleLocationClose = useCallback(
    (event: Event) => {
      const dropdown = document.getElementById("dropdownFactory")

      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsOpenLocation(undefined)
      }
    },
    [setIsOpenLocation]
  )

  useEffect(() => {
    document.addEventListener("click", handleLocationClose)

    return () => {
      document.removeEventListener("click", handleLocationClose)
    }
  }, [handleLocationClose, isOpenLocation])

  const handleRoleClose = useCallback(
    (event: Event) => {
      const dropdown = document.getElementById("dropdownFactory")

      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsOpenRole(undefined)
      }
    },
    [setIsOpenRole]
  )

  useEffect(() => {
    document.addEventListener("click", handleRoleClose)

    return () => {
      document.removeEventListener("click", handleRoleClose)
    }
  }, [handleRoleClose, isOpenRole])

  useEffect(() => {
    if (numberOfPages === 1) {
      setPage(1)
    }
  }, [numberOfPages, setPage])

  const handleInputChange = (
    e: React.MouseEvent<HTMLButtonElement>,
    key: string
  ) => {
    setKeyword(key)
    setSortType(sortType === "asc" ? "desc" : "asc")
  }

  return (
    <>
      <div
        className={`relative w-full mt-6 bg-white overflow-visible drop-shadow-lg rounded-md ${
          paginated ? "overflow-visible" : "overflow-x-auto"
        }`}
      >
        <div className="px-1 w-full pt-1 ">
          <div className="flex w-[100%] h-32">
            <div className="flex flex-col sm:flex-none cursor-pointer w-[30%]">
              <div className="flex flex-col md:flex-col sm:flex-col lg:flex-col xl:flex-row 2xl:flex-row">
                <div className="flex items-center">
                  {/* <div className="w-[100%] md:w-[100%] sm:w-[100%] lg:w-[100%] xl:w-[50%] 2xl:w-[50%]"> */}

                  <div className="relative">
                    <button
                      // onChange={handleTeamListing}
                      onClick={() => setIsOpenTeam(!isOpenTeam)}
                      value={selectedStatus}
                      className="w-5 py-0 pl-1 bg-gray-100 ring-opacity-0 text-gray-600 border-none border-gray-300 rounded bg-opacity-0 focus:ring-gray-500 focus:ring-opacity-0 overflow-y-auto"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="mt-1 mr-2 w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </button>
                    {isOpenTeam && (
                      <div
                        className={`${
                          userProfile?.item.role === "Production" ||
                          userProfile?.item.role === "HR"
                            ? "absolute mt-1 w-40 bg-white border border-gray-300 rounded-lg shadow-lg overflow-y-auto"
                            : "absolute mt-1 w-40 h-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10 overflow-y-auto"
                        } `}
                      >
                        {roleFilter().map((item: any, index: any) => (
                          <div
                            style={{ fontSize: 14, fontWeight: 500 }}
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer overflow-y-auto"
                            onClick={() => {
                              handleTeamListing(item)
                              setIsOpenTeam(false)
                            }}
                          >
                            <a className="px-4">{item}</a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <label
                    className="text-[#7F1D1D] uppercase font-semibold pl-1"
                    style={{ whiteSpace: "nowrap", fontSize: "1rem" }}
                  >
                    Team Listing
                  </label>
                </div>
                <span className="text-md font-bold flex pl-1 mt-[1px]">
                  -
                  <p className="pl-0.5 text-[#172554] uppercase">
                    {selectedRole}
                  </p>
                </span>
              </div>
              <div className="mt-4 flex ml-0">
                <span
                  className={` text-[28px] flex uppercase mt-3 font-semibold text-2xl cursor-pointer ${selectedColor}`}
                  onClick={toggleDropdown}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="mt-1 mr-1 w-5 h-7"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                  <span
                    className={`${
                      selectedStatus === "Pending"
                        ? "text-yellow-700"
                        : selectedStatus === "Approved"
                        ? "text-green-800"
                        : selectedStatus === "Rejected"
                        ? "text-red-800"
                        : "text-yellow-500"
                    }`}
                  >
                    {selectedStatus}
                  </span>
                </span>
                {isOpen && (
                  <div
                    style={{ width: 160 }}
                    className={` sm:top-[6rem] absolute mt-1 h-30 bg-white border border-gray-300 rounded-lg shadow-lg z-10 overflow-y-auto `}
                  >
                    <ul>
                      {statusArray.map((status, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            if (Object.values(USER_STATUSES).includes(status)) {
                              handleSelectDropdown(status as T_UserStatus)
                            }
                          }}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                        >
                          {status}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2 w-[40%]">
              <div className="flex justify-end text-gray-900 space-x-1">
                <span className="text-[#7F1D1D] text-[14px] uppercase font-semibold">
                  {" "}
                  City{" "}
                </span>
                {userProfile?.item.role === "Production" ? (
                  <div className="border-b-[4px] text-[14px] border-[#172554] h w-60 uppercase space-x-2 font-semibold">
                    <span className="text-start text-[#7F1D1D]">:</span>
                    <FormControl sx={{ m: 1, width: 220 }}>
                      <Select
                        sx={{
                          boxShadow: "none",
                          ".MuiOutlinedInput-notchedOutline": { border: 0 },
                          variant: "standard",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "&:focus .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiSelect-select": {
                            paddingLeft: "0px",
                            fontWeight: "bold",
                            paddingRight: "0px",
                          },
                        }}
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        style={{
                          width: "100%",
                          fontSize: "12px",
                          height: "4px",
                        }}
                        value={selectedCity}
                        input={<OutlinedInput label="All" />}
                        onChange={handleCitySelection}
                        renderValue={renderSelectValue}
                        MenuProps={{
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left",
                          },
                          transformOrigin: {
                            vertical: "top",
                            horizontal: "left",
                          },
                          style: { top: "9px" },
                        }}
                      >
                        {locations?.items?.map((item: any, index: any) => (
                          <MenuItem key={index} value={item.name as string}>
                            <Checkbox
                              checked={selectedCity.includes(item.name)}
                              color="primary"
                            />
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                ) : (
                  <div className="border-b-[4px] text-[14px] border-[#172554] h w-60 uppercase space-x-2 font-semibold">
                    <span className="text-start text-[#7F1D1D]">:</span>
                    <FormControl sx={{ m: 1, width: 220 }}>
                      <Select
                        sx={{
                          boxShadow: "none",
                          ".MuiOutlinedInput-notchedOutline": { border: 0 },
                          variant: "standard",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "&:focus .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiSelect-select": {
                            paddingLeft: "0px",
                            fontWeight: "bold",
                            paddingRight: "0px",
                          },
                        }}
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        style={{
                          width: "100%",
                          fontSize: "12px",
                          height: "4px",
                        }}
                        value={selectedCity}
                        input={<OutlinedInput label="All" />}
                        onChange={handleCitySelection}
                        renderValue={renderSelectValue}
                        MenuProps={{
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left",
                          },
                          transformOrigin: {
                            vertical: "top",
                            horizontal: "left",
                          },
                          style: { top: "9px" },
                        }}
                      >
                        {locations?.items?.map((item: any, index: any) => (
                          <MenuItem
                            key={index}
                            value={item.name as string}
                            disabled={
                              storeSession?.role === "Personnel" &&
                              userProfile?.item.locationId !== item._id
                            }
                          >
                            <Checkbox
                              checked={selectedCity.includes(item.name)}
                              color="primary"
                            />
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}
              </div>
              <div className="flex justify-end text-gray-900 space-x-1">
                <span className="text-[#7F1D1D] text-[14px] uppercase font-semibold">
                  Factory
                </span>
                <div className="border-b-[4px] text-[14px] border-[#172554] whitespace-nowrap w-60 uppercase space-x-2 font-semibold">
                  <span className="text-start text-[#7F1D1D">:</span>
                  {/* {userProfile?.item.role !== "Production" ? ( */}
                  <FormControl sx={{ m: 1, width: 220 }}>
                    <Select
                      sx={{
                        boxShadow: "none",
                        ".MuiOutlinedInput-notchedOutline": { border: 0 },
                        variant: "standard",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "&:focus .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "& .MuiSelect-select": {
                          paddingLeft: "0px", // Adjust the value as needed
                          fontWeight: "bold",
                          paddingRight: "0px",
                        },
                      }}
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      style={{
                        width: "100%",
                        fontSize: "12px",
                        height: "4px",
                      }}
                      value={selectedFactories}
                      input={<OutlinedInput label="All" />}
                      onChange={handleFactorySelection}
                      renderValue={renderSelectValueFactory}
                      MenuProps={{
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left",
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left",
                        },
                        style: { top: "9px" },
                      }}
                    >
                      {factories?.items?.map((item: any, index: any) => (
                        <MenuItem key={index} value={item.name as string}>
                          <Checkbox
                            checked={selectedFactories.includes(item.name)}
                            color="primary"
                          />
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              {selectedRole === "Personnel" ? (
                <div className="flex justify-end text-gray-900 space-x-1">
                  <span className="text-[#7F1D1D] text-[14px] uppercase whitespace-nowrap font-semibold">
                    Machine Class
                  </span>
                  <div className="border-b-[4px] text-[14px] border-[#172554] w-60 whitespace-nowrap uppercase space-x-2 font-semibold">
                    <span className="text-start text-[#7F1D1D">:</span>
                    <FormControl sx={{ m: 1, width: 220 }}>
                      <Select
                        sx={{
                          boxShadow: "none",
                          ".MuiOutlinedInput-notchedOutline": { border: 0 },
                          variant: "standard",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "&:focus .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiSelect-select": {
                            paddingLeft: "0px", // Adjust the value as needed
                            fontWeight: "bold",
                            paddingRight: "0px",
                          },
                        }}
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        style={{
                          width: "100%",
                          fontSize: "12px",
                          height: "4px",
                        }}
                        value={selectedMachineClasses}
                        disabled={factoryMachineClasses?.length === 0}
                        input={<OutlinedInput label="All" />}
                        onChange={handleMachineClassSelection}
                        renderValue={renderSelectValueMachineClass}
                        MenuProps={{
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left",
                          },
                          transformOrigin: {
                            vertical: "top",
                            horizontal: "left",
                          },
                          style: { top: "9px" },
                        }}
                      >
                        {factoryMachineClasses?.map(
                          (item: any, index: number) => (
                            <MenuItem key={index} value={item.name as string}>
                              <Checkbox
                                checked={selectedMachineClasses.includes(
                                  item.name
                                )}
                                color="primary"
                              />
                              {item.name}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              ) : selectedRole === "Corporate" ? (
                <div className="flex justify-end text-gray-900 space-x-1">
                  <span className="text-[#7F1D1D] text-[14px] uppercase font-semibold">
                    Department
                  </span>
                  <div className="border-b-[4px] text-[14px] border-[#172554] w-60 uppercase space-x-2 font-semibold">
                    <span className="text-start text-[#7F1D1D]">:</span>

                    <FormControl sx={{ m: 1, width: 220 }}>
                      <Select
                        sx={{
                          boxShadow: "none",
                          ".MuiOutlinedInput-notchedOutline": { border: 0 },
                          variant: "standard",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "&:focus .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiSelect-select": {
                            paddingLeft: "0px", // Adjust the value as needed
                            fontWeight: "bold",
                            paddingRight: "0px",
                          },
                        }}
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        style={{
                          width: "100%",
                          fontSize: "12px",
                          height: "4px",
                        }}
                        value={departments}
                        input={<OutlinedInput label="All" />}
                        onChange={handleDepartmentSelection}
                        renderValue={renderDeptSelectValue}
                        MenuProps={{
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left",
                          },
                          transformOrigin: {
                            vertical: "top",
                            horizontal: "left",
                          },
                          style: { top: "9px" },
                        }}
                      >
                        {deptNameHr.map((item: string, index: number) => (
                          <MenuItem key={index} value={item as string}>
                            <Checkbox
                              checked={departments.includes(item)}
                              color="primary"
                            />
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="space-y-8 w-[30%] px-5">
              <div className="flex justify-center text-end text-gray-900 ">
                <span className="text-gray-500 text-[14px] uppercase ">
                  Add New
                  <br /> Team Members
                </span>
                <svg
                  onClick={() => {
                    setNewModal(true)
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-8 ml-2 mt-2 cursor-pointer text-white bg-[#172554] h-8 rounded-md"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
              <div className="flex justify-center text-gray-900 ">
                <input
                  type="search"
                  className="peer block text-sm bg-slate-200 focus:placeholder:opacity-30 placeholder:uppercase ring-1 placeholder:opacity-30 focus:ring-1 focus:border-1 focus:border-gray-400 focus:ring-slate-500 ring-gray-400 min-h-[auto] placeholder:text-gray-500 text-black w-[9.5rem] rounded border-0 bg-transparent px-3 py-[0.23rem] leading-[1.6] outline-none transition-all duration-200 ease-linear peer-focus:text-primary motion-reduce:transition-none dark:peer-focus:text-primary "
                  id="exampleSearch2"
                  placeholder="Search Users"
                  onChange={(e) => {
                    onSearch(e)
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex"></div>
          {isPaginatedLoading ? (
            <>
              <div className="relative overflow-x-auto sm:rounded-lg mt-3">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed">
                  <thead className="text-xs text-gray-700 uppercase bg-white-50 dark:bg-white-700 dark:text-gray-400 shadow-none">
                    <tr>
                      <th scope="col" className="w-[6%] text-slate-900"></th>
                      <th scope="col" className="">
                        <div className="flex items-start justify-start">
                          {/* <a href="#" className="group inline-flex items-center"> */}
                          User
                          <button
                            onClick={(e) => handleInputChange(e, "firstName")}
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
                        {/* <span className="ml-2 flex-none rounded text-gray-400">
                      <ChevronUpDownIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>
                                      </a> */}
                      </th>

                      {selectedRole === "Administrator" ? (
                        " "
                      ) : (
                        <>
                          <th className="">
                            <div className="flex items-center justify-center ml-8">
                              <span> City</span>
                              <button
                                onClick={(e) =>
                                  handleInputChange(e, "locationId")
                                }
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
                          {selectedRole !== "Personnel" && (
                            <th className="">
                              <div className="flex items-start justify-start ml-7">
                                <span className="flex">
                                  Factory<p className="text-red-600 ml-1">*</p>
                                </span>
                                <button
                                  onClick={(e) =>
                                    handleInputChange(e, "factoryId")
                                  }
                                >
                                  <svg
                                    className="w-3 h-3 ml-1"
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
                          )}
                          {selectedRole === "Personnel" ? (
                            <>
                              <th colSpan={2}>
                                <div className="flex items-start justify-start px-0 py-3 ml-9">
                                  <div className="flex items-center overflow-ellipsis whitespace-nowrap">
                                    Machine Class
                                    <p className="text-red-600 ml-1">*</p>
                                    <button
                                      onClick={(e) =>
                                        handleInputChange(e, "machineClassId")
                                      }
                                    >
                                      <svg
                                        className="w-3 h-3 ml-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </th>
                              <th className="">
                                <div className="flex items-start justify-start">
                                  <span className="flex">
                                    Factory
                                    <p className="text-red-600 ml-1">*</p>
                                  </span>
                                  <button
                                    onClick={(e) =>
                                      handleInputChange(e, "factoryId")
                                    }
                                  >
                                    <svg
                                      className="w-3 h-3 ml-1"
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
                            </>
                          ) : (
                            <th colSpan={2} className="">
                              <div className="flex items-start justify-start px-0 py-3 ml-11">
                                <div className="flex items-center ml-12">
                                  Department
                                  <p className="text-red-600 ml-1">*</p>
                                  <button
                                    onClick={(e) =>
                                      handleInputChange(e, "role")
                                    }
                                  >
                                    <svg
                                      className="w-3 h-3 ml-1"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </th>
                          )}
                        </>
                      )}
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
                      <td className="pr-6 py-5 h-14">
                        <div className="flex items-center">
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
                      className="bg-gray text-slate-900 font-medium border-b bg-gray-200"
                      data-accordion-target="#accordion-arrow-icon-body-0"
                      aria-expanded="false"
                      aria-controls="accordion-arrow-icon-body-0"
                    >
                      <td className="pr-6 py-5 h-14">
                        <div className="flex items-center">
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
                      className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                      data-accordion-target="#accordion-arrow-icon-body-0"
                      aria-expanded="false"
                      aria-controls="accordion-arrow-icon-body-0"
                    >
                      <td className="pr-6 py-5 h-14">
                        <div className="flex items-center">
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
                      className="bg-gray text-slate-900 font-medium border-b bg-gray-200"
                      data-accordion-target="#accordion-arrow-icon-body-0"
                      aria-expanded="false"
                      aria-controls="accordion-arrow-icon-body-0"
                    >
                      <td className="pr-6 py-5 h-14">
                        <div className="flex items-center">
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
                      <td className="px-6 py-4 text-sm  flex flex-col text-gray-900">
                        <div className="flex items-center justify-center mt-0 w-full ml-6">
                          <div
                            className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-dark-blue rounded-full mx-2"
                            role="status"
                            aria-label="loading"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      </td>
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
                      <td className="pr-6 py-5 h-14">
                        <div className="flex items-center">
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
                      <td className="pr-6 py-5 h-14">
                        <div className="flex items-center">
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
                      className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                      data-accordion-target="#accordion-arrow-icon-body-1"
                      aria-expanded="false"
                      aria-controls="accordion-arrow-icon-body-1"
                    >
                      <td className="pr-6 py-5 h-14">
                        <div className="flex items-center">
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
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
          {!isPaginatedLoading &&
          paginated?.items &&
          paginated?.items?.length > 0 ? (
            selectedRole === "Administrator" ? (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed">
                <thead className="text-xs text-gray-700 uppercase bg-white-50 dark:bg-white-700 dark:text-gray-400 shadow-none">
                  <tr>
                    <th scope="col" className="w-[6%] text-slate-900"></th>
                    <th scope="col" className="w-[12%]">
                      <div className="flex items-start justify-start ml-6">
                        User
                        <button
                          onClick={(e) => handleInputChange(e, "firstName")}
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
                  </tr>
                </thead>
                {
                  <tbody
                    data-accordion="open"
                    className="border-t-4 border-indigo-900"
                  >
                    {paginated?.items &&
                      paginated?.items.map((item, idx) => {
                        const rowClass =
                          idx % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                        const isAccordionOpen = openAccordion === item._id
                        return (
                          <React.Fragment key={item._id}>
                            <tr
                              key={idx}
                              className={`bg-gray h-10 text-slate-900 font-medium border-b ${rowClass}  ${
                                !item._id ? "bg-red-50" : ""
                              }`}
                              aria-colspan={6}
                            >
                              <td className="pr-6">
                                <div
                                  data-accordion-target={`#accordion-arrow-icon-body-${idx}`}
                                  aria-controls={`accordion-arrow-icon-body-${idx}`}
                                  onClick={() =>
                                    toggleAccordion(String(item._id))
                                  }
                                  aria-expanded={isAccordionOpen}
                                  className={`flex items-center ${
                                    isAccordionOpen ? "open" : ""
                                  }`}
                                >
                                  {isAccordionOpen ? (
                                    <svg
                                      height="30"
                                      viewBox="0 0 48 48"
                                      width="30"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="ml-1"
                                    >
                                      <path d="M14 20l10 10 10-10z" />
                                      <path d="M0 0h48v48h-48z" fill="none" />
                                    </svg>
                                  ) : (
                                    <svg
                                      height="16"
                                      viewBox="0 0 48 48"
                                      width="15"
                                      className="ml-2"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M-838-2232H562v3600H-838z"
                                        fill="none"
                                      />
                                      <path d="M16 10v28l22-14z" />
                                      <path d="M0 0h48v48H0z" fill="none" />
                                    </svg>
                                  )}
                                </div>
                              </td>
                              <td
                                colSpan={5}
                                className="py-0 pl-4 pr-3 text-sm font-medium overflow-hidden whitespace-nowrap"
                              >
                                {item.firstName + " " + item.lastName}
                              </td>

                              <td
                                className={`pl-0 w-full py-[2%] text-sm text-gray-500 relative`}
                              >
                                <Menu as="div" className="w-full text-end pr-4">
                                  <Menu.Button className="font-normal text-gray-400">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="1.5em"
                                      viewBox="0 0 128 512"
                                    >
                                      <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                                    </svg>{" "}
                                  </Menu.Button>
                                  <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                  >
                                    <Menu.Items className="absolute right-9 text-end mt-1 w-24 z-10 origin-top-right -top-0 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                      <div className="py-1">
                                        {item.status !== "Approved" &&
                                          (userRole === "HR_Director" ||
                                          userRole === "Administrator" ? (
                                            <>
                                              <Menu.Item>
                                                {({ active }) => (
                                                  <span
                                                    className={combineClasses(
                                                      active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700",
                                                      "block px-4 py-2 text-sm cursor-pointer text-left"
                                                    )}
                                                    onClick={() => {
                                                      setSelectedRow(item)
                                                      setConfirmationModal(true)
                                                      setAction(
                                                        USER_STATUSES.Approved as T_UserStatus
                                                      )
                                                    }}
                                                  >
                                                    Approve
                                                  </span>
                                                )}
                                              </Menu.Item>
                                              <Menu.Item>
                                                {({ active }) => (
                                                  <span
                                                    className={combineClasses(
                                                      active
                                                        ? "bg-gray-100 text-gray-900"
                                                        : "text-gray-700",
                                                      "block px-4 py-2  text-sm cursor-pointer text-left"
                                                    )}
                                                    onClick={() => {
                                                      setSelectedRow(item)
                                                      setDeleteModal(true)
                                                      setAction(
                                                        USER_STATUSES.Rejected as T_UserStatus
                                                      )
                                                    }}
                                                  >
                                                    Reject
                                                  </span>
                                                )}
                                              </Menu.Item>
                                            </>
                                          ) : (
                                            ""
                                          ))}
                                        <Menu.Item>
                                          {({ active }) => (
                                            <span
                                              className={combineClasses(
                                                active
                                                  ? "bg-gray-100 text-gray-900"
                                                  : "text-gray-700",
                                                "block px-4 py-2 text-sm cursor-pointer text-left"
                                              )}
                                              onClick={() => {
                                                setSelectedRow(item)
                                                setDeleteModal(true)
                                                setAction(
                                                  USER_STATUSES.Archived as T_UserStatus
                                                )
                                              }}
                                            >
                                              Delete
                                            </span>
                                          )}
                                        </Menu.Item>
                                      </div>
                                    </Menu.Items>
                                  </Transition>
                                </Menu>
                              </td>
                            </tr>
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
                                        <span className="flex w-[12rem] text-[14px] text-green-800 font-semibold border-r-4 border-gray-500 p-0 pb-8">
                                          <p className="w-[20rem] ml-2">
                                            ADDITIONAL INFO
                                          </p>
                                        </span>
                                        <div className="flex pl-3">
                                          <span className="flex w-[20rem] space-x-1 text-[13px] justify-start items-center">
                                            <p
                                              className={`px-3 text-sm  text-gray-500 font-semibold ${
                                                item.email
                                                  ? "text-gray-900"
                                                  : "text-red-500"
                                              }`}
                                            >
                                              EMAIL:
                                            </p>
                                            <p
                                              className={` text-sm text-gray-500 ${
                                                item.email
                                                  ? "text-gray-900"
                                                  : "text-red-500"
                                              }`}
                                            >
                                              {/* {typeof item. === "object"
                                            ? item.operator?.firstName
                                            : ""}{" "}
                                          {typeof item.operator === "object"
                                            ? item.operator?.lastName
                                            : ""} */}
                                              {item.email || "-"}
                                            </p>
                                          </span>
                                          <span className="flex w-[22rem] text-[13px] text-slate-900 justify-center items-center">
                                            <p
                                              className={`px-0 text-sm text-gray-500 font-semibold ${
                                                item.locationId
                                                  ? "text-gray-900"
                                                  : "text-red-500"
                                              }`}
                                            >
                                              CITY:
                                            </p>
                                            <p
                                              className={`px-3 text-sm text-gray-900 ${
                                                item.locationId
                                                  ? "text-gray-900"
                                                  : "text-red-500"
                                              }`}
                                            >
                                              {typeof item?.locationId ===
                                                "object" &&
                                              item?.locationId?._id
                                                ? item?.locationId?.name
                                                : ""}{" "}
                                              - This was selected during
                                              creation
                                            </p>
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex ">
                                        <span className="flex w-[12rem] text-[14px] text-green-800 font-semibold border-r-4 border-gray-500 p-0 pb-8">
                                          <p className="w-[20rem] ml-2"></p>
                                        </span>
                                        <div className="flex pl-3">
                                          {(item.archivedBy as T_User)?._id ? (
                                            <span className="flex px-3 w-[22rem] text-[13px] text-slate-900 justify-start items-start">
                                              <p
                                                className={`px-0 text-sm text-gray-500 font-semibold ${
                                                  item.locationId
                                                    ? "text-gray-900"
                                                    : "text-red-500"
                                                }`}
                                              >
                                                ARCHIVED BY:
                                              </p>
                                              <p
                                                className={`px-3 text-sm text-gray-900 ${
                                                  item.locationId
                                                    ? "text-gray-900"
                                                    : "text-red-500"
                                                }`}
                                              >
                                                {`${
                                                  (item.archivedBy as T_User)
                                                    ?.firstName
                                                } ${
                                                  (item.archivedBy as T_User)
                                                    ?.lastName
                                                }`}
                                              </p>
                                            </span>
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        )
                      })}
                    {paginated?.items?.length == 1 && (
                      <>
                        <tr
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-200"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-200"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-200"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-100  "
                          data-accordion-target="#accordion-arrow-icon-body-1"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-1"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                      </>
                    )}

                    {paginated?.items?.length == 2 && (
                      <>
                        <tr
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-200"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-200"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                      </>
                    )}

                    {paginated?.items?.length == 3 && (
                      <>
                        <tr
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-200"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-200"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                      </>
                    )}

                    {paginated?.items?.length == 4 && (
                      <>
                        <tr
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-200"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                      </>
                    )}

                    {paginated?.items?.length == 5 && (
                      <>
                        <tr
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-200"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                      </>
                    )}

                    {paginated?.items?.length == 6 && (
                      <>
                        <tr
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                      </>
                    )}
                  </tbody>
                }
              </table>
            ) : (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed">
                <thead className="text-xs text-gray-700 uppercase bg-white-50 dark:bg-white-700 dark:text-gray-400 shadow-none">
                  <tr>
                    <th scope="col" className="w-[6%] text-slate-900"></th>
                    <th scope="col" className="">
                      <div className="flex items-start justify-start">
                        User
                        <button
                          onClick={(e) => handleInputChange(e, "firstName")}
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
                    <th className="">
                      <div className="flex items-center justify-start ml-6">
                        <span> City</span>
                        <button
                          onClick={(e) => handleInputChange(e, "locationId")}
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
                    {selectedRole !== "Personnel" && (
                      <th className="">
                        <div className="flex items-start justify-start ml-2">
                          <span className="flex">
                            Factory<p className="text-red-600 ml-1">*</p>
                          </span>
                          <button
                            onClick={(e) => handleInputChange(e, "factoryId")}
                          >
                            <svg
                              className="w-3 h-3 ml-1"
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
                    )}
                    {selectedRole === "Personnel" ? (
                      <>
                        <th className="">
                          <div className="flex items-start justify-start px-0 py-3 ml-9">
                            <div className="flex items-center overflow-ellipsis whitespace-nowrap">
                              Machine Class
                              <p className="text-red-600 ml-1">*</p>
                              <button
                                onClick={(e) =>
                                  handleInputChange(e, "machineClassId")
                                }
                              >
                                <svg
                                  className="w-3 h-3 ml-1"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </th>
                        <th className="">
                          <div className="flex items-start justify-start ml-12">
                            <span className="flex">
                              Factory<p className="text-red-600 ml-1">*</p>
                            </span>
                            <button
                              onClick={(e) => handleInputChange(e, "factoryId")}
                            >
                              <svg
                                className="w-3 h-3 ml-1"
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
                      </>
                    ) : (
                      <th colSpan={1} className="">
                        <div
                          className={`flex items-start justify-start px-0 py-3  ${
                            selectedRole === "Corporate" ||
                            selectedRole === "HR"
                              ? "ml-3"
                              : "ml-6"
                          }`}
                        >
                          <div
                            className={`flex items-center  ${
                              selectedRole === "Corporate" ||
                              selectedRole === "HR"
                                ? "ml-9"
                                : "ml-12"
                            }`}
                          >
                            Department
                            <p className="text-red-600 ml-1">*</p>
                            <button
                              onClick={(e) => handleInputChange(e, "role")}
                            >
                              <svg
                                className="w-3 h-3 ml-1"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>
                {
                  <tbody
                    data-accordion="open"
                    className="border-t-4 border-indigo-900"
                  >
                    {paginated?.items &&
                      paginated?.items.map((item, idx) => {
                        const rowClass =
                          idx % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                        const isAccordionOpen = openAccordion === item._id
                        return (
                          <React.Fragment key={item._id}>
                            <tr
                              key={idx}
                              className={`bg-gray text-slate-900 font-medium border-b ${rowClass}  ${
                                !item._id ? "bg-red-50" : ""
                              }`}
                              aria-colspan={6}
                            >
                              <td className="">
                                <div
                                  data-accordion-target={`#accordion-arrow-icon-body-${idx}`}
                                  aria-controls={`accordion-arrow-icon-body-${idx}`}
                                  onClick={() =>
                                    toggleAccordion(String(item._id))
                                  }
                                  aria-expanded={isAccordionOpen}
                                  className={`flex items-center ${
                                    isAccordionOpen ? "open" : ""
                                  }`}
                                >
                                  {isAccordionOpen ? (
                                    <svg
                                      height="30"
                                      viewBox="0 0 48 48"
                                      width="30"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="ml-1"
                                    >
                                      <path d="M14 20l10 10 10-10z" />
                                      <path d="M0 0h48v48h-48z" fill="none" />
                                    </svg>
                                  ) : (
                                    <svg
                                      height="16"
                                      viewBox="0 0 48 48"
                                      width="15"
                                      className="ml-2"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M-838-2232H562v3600H-838z"
                                        fill="none"
                                      />
                                      <path d="M16 10v28l22-14z" />
                                      <path d="M0 0h48v48H0z" fill="none" />
                                    </svg>
                                  )}
                                </div>
                              </td>
                              <td className="py-0 text-sm font-medium overflow-hidden whitespace-nowrap overflow-ellipsis">
                                {item.firstName + " " + item.lastName}
                              </td>
                              <td className="text-sm text-gray-500 items-center justify-center">
                                <button
                                  id="dropdownFactoryButton"
                                  data-dropdown-toggle="dropdown"
                                  className="w-56 rounded-md whitespace-nowrap overflow-ellipsis text-start space-x-1 bg-opacity-0 flex bg-gray-300 border-none focus:ring-opacity-0 ring-opacity-0 border-0 py-1  text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
                                  type="button"
                                  disabled={
                                    isLocationsLoading ||
                                    isUpdateUserLoading ||
                                    isPaginatedLoading
                                  }
                                  onClick={() => handleHideLocation(idx)}
                                >
                                  <svg
                                    className="text-black"
                                    height="25"
                                    viewBox="0 0 48 48"
                                    width="25"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M14 20l10 10 10-10z" />
                                    <path d="M0 0h48v48h-48z" fill="none" />
                                  </svg>
                                  <span>
                                    {typeof item?.locationId === "object" &&
                                    item?.locationId?._id
                                      ? item?.locationId?.name
                                      : ""}
                                  </span>
                                </button>
                                <div
                                  id="dropdownFactory"
                                  className={`z-50 fixed ${
                                    isOpenLocation == idx ? "block" : "hidden"
                                  }  bg-white divide-y overflow-visible divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700`}
                                >
                                  <ul
                                    className="py-2 text-sm text-gray-700 dark:text-gray-200 overflow-auto h-30"
                                    aria-labelledby="dropdownFactoryButton"
                                  >
                                    {locations?.items?.map(
                                      (location: any, index: any) => (
                                        <li key={index}>
                                          <a
                                            href="#"
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            onClick={() => {
                                              const value = location._id
                                              if (value !== "Global") {
                                                mutate(
                                                  {
                                                    ...item,
                                                    locationId: value ?? "",
                                                  },
                                                  callBackReq
                                                )
                                              } else {
                                                mutate(
                                                  {
                                                    ...item,
                                                    locationId: value ?? "",
                                                  },
                                                  callBackReq
                                                )
                                              }
                                              setIsOpenLocation(undefined)
                                            }}
                                          >
                                            {location.name}
                                          </a>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </td>
                              {selectedRole !== "Personnel" && (
                                <td className="text-sm text-gray-500 items-start justify-center">
                                  {item?.role === "HR_Director" ||
                                  item?.role === "Accounting_Director" ||
                                  item?.role === "Sales_Director" ||
                                  item?.role === "Corporate_Director" ? (
                                    <div></div>
                                  ) : (
                                    <button
                                      id="dropdownFactoryButton"
                                      data-dropdown-toggle="dropdown"
                                      className="w-30 rounded-md whitespace-nowrap overflow-ellipsis text-start space-x-2 bg-opacity-0 flex bg-gray-300 border-none focus:ring-opacity-0 ring-opacity-0 border-0 py-1  text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-normal"
                                      type="button"
                                      disabled={
                                        isLocationsLoading ||
                                        isUpdateUserLoading ||
                                        isPaginatedLoading
                                      }
                                      onClick={() => handleHideFactory(idx)}
                                    >
                                      <svg
                                        height="25"
                                        viewBox="0 0 48 48"
                                        width="25"
                                        xmlns="http://www.w3.org/2000/svg"
                                        // className={`${
                                        //   selectedRole === "Personnel"
                                        //     ? "hidden"
                                        //     : ""
                                        // }`}
                                      >
                                        <path d="M14 20l10 10 10-10z" />
                                        <path d="M0 0h48v48h-48z" fill="none" />
                                      </svg>
                                      <span className="truncate">
                                        {item.isGlobalFactory ?? false
                                          ? "Global"
                                          : item?.factoryId
                                          ? typeof item.factoryId === "string"
                                            ? item.factoryId
                                            : item.factoryId.name
                                          : "Select Factory"}
                                      </span>
                                    </button>
                                  )}

                                  <div
                                    id="dropdownFactory"
                                    className={`z-50 fixed ${
                                      isOpenFactory == idx ? "block" : "hidden"
                                    }  sm:top-[13.8rem] absolute  overflow-y-auto mt-2  w-85 rounded-lg bg-white border border-gray-300 z-50`}
                                  >
                                    <ul
                                      style={{ height: 145 }}
                                      className="py-2 overflow-auto text-sm text-gray-700 dark:text-gray-200 w-40"
                                      aria-labelledby="dropdownFactoryButton"
                                    >
                                      {factories?.items?.map(
                                        (factory: any, index: any) => (
                                          <li key={index}>
                                            <a
                                              href="#"
                                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                              onClick={() => {
                                                const value = factory._id
                                                if (value !== "Global") {
                                                  mutate(
                                                    {
                                                      ...item,
                                                      factoryId: value,
                                                      isGlobalFactory: false,
                                                    },
                                                    callBackReq
                                                  )
                                                } else {
                                                  mutate(
                                                    {
                                                      ...item,
                                                      factoryId: null,
                                                      isGlobalFactory: true,
                                                    },
                                                    callBackReq
                                                  )
                                                }
                                                setIsOpenFactory(undefined)
                                              }}
                                            >
                                              {factory.name}
                                            </a>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                </td>
                              )}

                              {selectedRole === "Personnel" ? (
                                <>
                                  <td
                                    className={`text-sm text-gray-500 items-center justify-center`}
                                  >
                                    <button
                                      id="dropdownFactoryButton"
                                      data-dropdown-toggle="dropdown"
                                      className="w-56 rounded-md whitespace-nowrap text-start space-x-1 bg-opacity-0 flex bg-gray-300 border-none focus:ring-opacity-0 ring-opacity-0 border-0 py-1  text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
                                      type="button"
                                      disabled={
                                        isLocationsLoading ||
                                        isUpdateUserLoading ||
                                        isPaginatedLoading
                                      }
                                      onClick={() => handleHideRole(idx)}
                                    >
                                      <svg
                                        height="25"
                                        viewBox="0 0 48 48"
                                        width="30"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M14 20l10 10 10-10z" />
                                        <path d="M0 0h48v48h-48z" fill="none" />
                                      </svg>
                                      <span>
                                        {item.machineClassId ? (
                                          machineClass.items.map(
                                            (machineClass: any) =>
                                              machineClass._id ===
                                              item.machineClassId ? (
                                                <div key={machineClass._id}>
                                                  {machineClass.name}
                                                </div>
                                              ) : null
                                          )
                                        ) : (
                                          <div>Select Machine Class</div>
                                        )}
                                      </span>
                                    </button>

                                    <div
                                      id="dropdownFactory"
                                      className={`z-50 fixed ${
                                        isOpenRole == idx ? "block" : "hidden"
                                      } bg-white divide-y overflow-y-auto h-40 divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
                                    >
                                      <ul
                                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                        aria-labelledby="dropdownFactoryButton"
                                      >
                                        {machineClass.items.map(
                                          (
                                            machineClassId: any,
                                            index: string
                                          ) => (
                                            <a
                                              key={index}
                                              className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                              onClick={() => {
                                                const value = machineClassId._id
                                                const machineClassFactoryId =
                                                  machineClassId.factoryId
                                                if (value !== "Global") {
                                                  mutate(
                                                    {
                                                      ...item,
                                                      factoryId:
                                                        machineClassFactoryId,
                                                      machineClassId: value,
                                                      isGlobalFactory: false,
                                                    },
                                                    callBackReq
                                                  )
                                                } else {
                                                  mutate(
                                                    {
                                                      ...item,
                                                      machineClassId: null,
                                                      isGlobalFactory: true,
                                                    },
                                                    callBackReq
                                                  )
                                                }
                                                setIsOpenRole(undefined)
                                              }}
                                            >
                                              <li key={index}>
                                                {machineClassId.name}
                                              </li>
                                            </a>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  </td>
                                  <td className="text-sm text-gray-500 items-start justify-center">
                                    <button
                                      id="dropdownFactoryButton"
                                      data-dropdown-toggle="dropdown"
                                      className="w-30 ml-10 rounded-md whitespace-nowrap overflow-ellipsis text-start space-x-2 bg-opacity-0 flex bg-gray-300 border-none focus:ring-opacity-0 ring-opacity-0 border-0 py-1  text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-normal"
                                      type="button"
                                      disabled={
                                        isLocationsLoading ||
                                        isUpdateUserLoading ||
                                        isPaginatedLoading ||
                                        selectedRole === "Personnel"
                                      }
                                      onClick={() => handleHideFactory(idx)}
                                    >
                                      <svg
                                        height="25"
                                        viewBox="0 0 48 48"
                                        width="25"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`${
                                          selectedRole === "Personnel"
                                            ? "hidden"
                                            : ""
                                        }`}
                                      >
                                        <path d="M14 20l10 10 10-10z" />
                                        <path d="M0 0h48v48h-48z" fill="none" />
                                      </svg>
                                      <span className="truncate">
                                        {item.isGlobalFactory ?? false
                                          ? "Global"
                                          : item?.factoryId
                                          ? typeof item.factoryId === "string"
                                            ? item.factoryId
                                            : item.factoryId.name
                                          : "Select Factory"}
                                      </span>
                                    </button>
                                    <div
                                      id="dropdownFactory"
                                      className={`z-50 fixed ${
                                        isOpenFactory == idx
                                          ? "block"
                                          : "hidden"
                                      }  sm:top-[13.8rem] absolute  overflow-y-auto mt-2  w-85 rounded-lg bg-white border border-gray-300 z-50`}
                                    >
                                      <ul
                                        style={{ height: 145 }}
                                        className="py-2 overflow-auto text-sm text-gray-700 dark:text-gray-200 w-40"
                                        aria-labelledby="dropdownFactoryButton"
                                      >
                                        {factories?.items?.map(
                                          (factory: any, index: any) => (
                                            <li key={index}>
                                              <a
                                                href="#"
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                onClick={() => {
                                                  const value = factory._id
                                                  if (value !== "Global") {
                                                    mutate(
                                                      {
                                                        ...item,
                                                        factoryId: value,
                                                        isGlobalFactory: false,
                                                      },
                                                      callBackReq
                                                    )
                                                  } else {
                                                    mutate(
                                                      {
                                                        ...item,
                                                        factoryId: null,
                                                        isGlobalFactory: true,
                                                      },
                                                      callBackReq
                                                    )
                                                  }
                                                  setIsOpenFactory(undefined)
                                                }}
                                              >
                                                {factory.name}
                                              </a>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <td
                                  className={`text-sm py-[2%] text-gray-500 items-start justify-start`}
                                >
                                  <button
                                    id="dropdownFactoryButton"
                                    data-dropdown-toggle="dropdown"
                                    className={`w-56 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed rounded-md whitespace-nowrap overflow-ellipsis text-start space-x-2 bg-opacity-0 flex bg-gray-300 border-none focus:ring-opacity-0 ring-opacity-0 border-0 py-1  ${
                                      selectedRole === "Corporate" ||
                                      selectedRole === "HR"
                                        ? "pl-3"
                                        : "pl-9"
                                    }`}
                                    type="button"
                                    disabled={
                                      isLocationsLoading ||
                                      isUpdateUserLoading ||
                                      isPaginatedLoading
                                    }
                                    onClick={() => handleHideRole(idx)}
                                  >
                                    <svg
                                      height="25"
                                      viewBox="0 0 48 48"
                                      width="30"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M14 20l10 10 10-10z" />
                                      <path d="M0 0h48v48h-48z" fill="none" />
                                    </svg>
                                    <span>
                                      {typeof item.role === "string"
                                        ? item.role
                                        : "Select Role"}
                                    </span>
                                  </button>
                                  <div
                                    id="dropdownFactory"
                                    className={`z-50 fixed ${
                                      isOpenRole == idx ? "block" : "hidden"
                                    } bg-white divide-y divide-gray-100 overflow-y-auto h-36 rounded-lg shadow w-44 dark:bg-gray-700`}
                                  >
                                    <ul
                                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                      aria-labelledby="dropdownFactoryButton"
                                    >
                                      {Object.values(ARR_USER_ROLES).map(
                                        (role, index) => (
                                          <a
                                            key={index}
                                            className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            onClick={() => {
                                              mutate(
                                                {
                                                  ...item,
                                                  role: role as T_UserRole,
                                                },
                                                callBackReq
                                              )
                                              setIsOpenRole(undefined)
                                            }}
                                          >
                                            <li key={index}>{role}</li>
                                          </a>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                </td>
                              )}
                              <td
                                className={`pl-0 w-full py-[12%] sm:mr-4 flex text-sm text-gray-500 relative`}
                              >
                                {selectedRole === "HR" && (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      paddingLeft: "30px",
                                      marginLeft: "30px",
                                    }}
                                  >
                                    <label>Director</label>
                                    <input
                                      type="checkbox"
                                      style={{ marginLeft: "3px" }}
                                      checked={
                                        item.role === "HR_Director" || false
                                      }
                                      disabled={
                                        isLocationsLoading ||
                                        isUpdateUserLoading ||
                                        isPaginatedLoading ||
                                        selectedStatus === "Pending" ||
                                        selectedStatus === "Rejected" ||
                                        selectedStatus === "Archived"
                                      }
                                      onChange={() =>
                                        handleDirectorCheck(idx, item)
                                      }
                                    />
                                  </div>
                                )}
                                {selectedRole === "Corporate" && (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      paddingLeft: "30px",
                                      marginLeft: "30px",
                                    }}
                                  >
                                    <label>Director</label>
                                    <input
                                      type="checkbox"
                                      style={{ marginLeft: "3px" }}
                                      checked={
                                        item.role === "Accounting_Director" ||
                                        item.role === "Sales_Director" ||
                                        item.role === "Corporate_Director" ||
                                        false
                                      }
                                      disabled={
                                        isLocationsLoading ||
                                        isUpdateUserLoading ||
                                        isPaginatedLoading ||
                                        selectedStatus === "Pending" ||
                                        selectedStatus === "Rejected" ||
                                        selectedStatus === "Archived"
                                      }
                                      onChange={() =>
                                        handleAccDirectorCheck(idx, item)
                                      }
                                    />
                                  </div>
                                )}
                                <Menu as="div" className="w-full text-end pr-4">
                                  <Menu.Button>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="1.5em"
                                      viewBox="0 0 128 512"
                                      onClick={() => {
                                        approveChecking(
                                          item.locationId,
                                          userProfile?.item.locationId as string
                                        )
                                      }}
                                    >
                                      <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                                    </svg>
                                  </Menu.Button>
                                  <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                  >
                                    <Menu.Items className="absolute right-24 text-end w-24 z-10 origin-top-right -top-0 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                      <div className="absolute mt-1 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                        {item.status !== "Approved" && (
                                          <Menu.Item>
                                            {({ active }) => (
                                              <button
                                                disabled={!checkedProved}
                                                className={combineClasses(
                                                  active
                                                    ? "bg-gray-100  text-gray-900"
                                                    : "text-gray-700",
                                                  `block px-4 py-2 w-[9.8rem] disabled:text-gray-400 text-sm ${`${
                                                    checkedProved
                                                      ? "cursor-pointer"
                                                      : "cursor-not-allowed"
                                                  }`} text-left`
                                                )}
                                                onClick={() => {
                                                  setSelectedRow(item)
                                                  if (
                                                    item.role === "Personnel"
                                                  ) {
                                                    if (
                                                      !item?.machineClassId &&
                                                      !item?.factoryId
                                                    ) {
                                                      setErrorMsg(
                                                        "Machine Class and Factory"
                                                      )
                                                      setAlertPrompt(true)
                                                    } else {
                                                      approveChecking(
                                                        item?.locationId,
                                                        userProfile?.item
                                                          ?.locationId as string
                                                      )
                                                      setConfirmationModal(true)
                                                    }
                                                  } else {
                                                    if (!item?.factoryId) {
                                                      setErrorMsg("Factory")
                                                      setAlertPrompt(true)
                                                    } else {
                                                      approveChecking(
                                                        item?.locationId,
                                                        userProfile?.item
                                                          ?.locationId as string
                                                      )
                                                      setConfirmationModal(true)
                                                    }
                                                  }
                                                  setAction(
                                                    USER_STATUSES.Approved as T_UserStatus
                                                  )
                                                }}
                                              >
                                                Approve
                                              </button>
                                            )}
                                          </Menu.Item>
                                        )}
                                        <Menu.Item>
                                          {({ active }) => (
                                            <button
                                              disabled={!checkedProved}
                                              className={combineClasses(
                                                active
                                                  ? "bg-gray-100 text-gray-900"
                                                  : "text-gray-700",
                                                `block px-4 py-2 text-sm w-[9.8rem] disabled:text-gray-400 text-left ${`${
                                                  checkedProved
                                                    ? "cursor-pointer"
                                                    : "cursor-not-allowed"
                                                }`}`
                                              )}
                                              onClick={() => {
                                                setSelectedRow(item)
                                                setDeleteModal(true)
                                                setAction(
                                                  USER_STATUSES.Rejected as T_UserStatus
                                                )
                                              }}
                                            >
                                              Reject
                                            </button>
                                          )}
                                        </Menu.Item>

                                        <Menu.Item>
                                          {({ active }) => (
                                            <button
                                              disabled={!checkedProved}
                                              className={combineClasses(
                                                active
                                                  ? "bg-gray-100 text-gray-900"
                                                  : "text-gray-700",
                                                `block px-4 py-2 text-sm w-[9.8rem] disabled:text-gray-400 text-left ${`${
                                                  checkedProved
                                                    ? "cursor-pointer"
                                                    : "cursor-not-allowed"
                                                }`}`
                                              )}
                                              onClick={() => {
                                                setSelectedRow(item)
                                                setDeleteModal(true)
                                                setAction(
                                                  USER_STATUSES.Archived as T_UserStatus
                                                )
                                              }}
                                            >
                                              Delete
                                            </button>
                                          )}
                                        </Menu.Item>
                                      </div>
                                    </Menu.Items>
                                  </Transition>
                                </Menu>
                              </td>
                            </tr>
                            {isAccordionOpen && (
                              <tr
                                id={`accordion-arrow-icon-body-${idx}`}
                                aria-labelledby={`accordion-arrow-icon-heading-${idx}`}
                                className={`${isAccordionOpen ? "open" : ""}`}
                              >
                                <td colSpan={6}>
                                  <div className=" border border-b-0 border-gray-100 bg-gray-100  h-13">
                                    <div className="w-[73%]">
                                      <div className="flex justify-between">
                                        <span className="flex w-[12rem] text-[14px] text-green-800 font-semibold border-r-4 border-gray-500 p-0 pb-8">
                                          <p className="w-[25rem] ml-2">
                                            ADDITIONAL INFO
                                          </p>
                                        </span>
                                        <div className="w-full">
                                          <div className="flex mt-2">
                                            <span className="w-1/2 flex px-4 text-[13px] ">
                                              <p
                                                className={`pl-3 sm:w-3/5 md:w-2/5 text-right pt-2 pb-1 text-sm text-gray-500 font-semibold ${
                                                  item.email
                                                    ? "text-gray-900"
                                                    : "text-red-500"
                                                }`}
                                              >
                                                EMAIL:
                                              </p>
                                              <p
                                                className={`pl-3 pt-2 pb-1 text-sm text-gray-500 ${
                                                  item.email
                                                    ? "text-gray-900"
                                                    : "text-red-500"
                                                }`}
                                              >
                                                {item.email || "-"}
                                              </p>
                                            </span>
                                            <span className="flex w-2/4 sm:px-0 sm: uppercase text-[13px] whitespace-nowrap  ">
                                              <p
                                                className={`pt-2 pb-1 w-[45%] text-right text-sm text-gray-500 font-semibold ${
                                                  item.createdAt &&
                                                  item.createdAt instanceof Date
                                                    ? "text-gray-900"
                                                    : "text-gray-900"
                                                }`}
                                              >
                                                CREATED AT:
                                              </p>
                                              <p
                                                className={`pl-3 pt-2 pb-1 text-sm  text-gray-500 ${
                                                  item.createdAt &&
                                                  item.createdAt instanceof Date
                                                    ? "text-gray-900"
                                                    : "text-gray-900"
                                                }`}
                                              >
                                                {item.createdAt instanceof Date
                                                  ? item.createdAt.toLocaleString()
                                                  : item.createdAt
                                                  ? new Date(
                                                      item.createdAt
                                                    ).toLocaleString()
                                                  : "No valid date provided"}
                                              </p>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        )
                      })}
                    {paginated?.items?.length == 1 && (
                      <>
                        <tr
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-200"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-100  "
                          data-accordion-target="#accordion-arrow-icon-body-1"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-1"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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

                          <td className="px-6 py-4 text-sm flex flex-col text-gray-900"></td>
                          <td className="px-6 py-4"></td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-red-500"></span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-red-500"></span>
                          </td>
                        </tr>
                      </>
                    )}

                    {paginated?.items?.length == 2 && (
                      <>
                        <tr
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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

                          <td className="px-6 py-4 text-sm  flex flex-col text-gray-900"></td>
                          <td className="px-6 py-4"></td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-red-500"></span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-red-500"></span>
                          </td>
                        </tr>
                      </>
                    )}

                    {paginated?.items?.length == 3 && (
                      <>
                        <tr
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-200"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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

                          <td className="px-6 py-4 text-sm  flex flex-col text-gray-900"></td>
                          <td className="px-6 py-4"></td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-red-500"></span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-red-500"></span>
                          </td>
                        </tr>
                      </>
                    )}

                    {paginated?.items?.length == 4 && (
                      <>
                        <tr
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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

                          <td className="px-6 py-4 text-sm  flex flex-col text-gray-900"></td>
                          <td className="px-6 py-4"></td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-red-500"></span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-red-500"></span>
                          </td>
                        </tr>
                      </>
                    )}

                    {paginated?.items?.length == 5 && (
                      <>
                        <tr
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-200"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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

                          <td className="px-6 py-4 text-sm  flex flex-col text-gray-900"></td>
                          <td className="px-6 py-4"></td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-red-500"></span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-red-500"></span>
                          </td>
                        </tr>
                      </>
                    )}

                    {paginated?.items?.length == 6 && (
                      <>
                        <tr
                          className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                          data-accordion-target="#accordion-arrow-icon-body-0"
                          aria-expanded="false"
                          aria-controls="accordion-arrow-icon-body-0"
                        >
                          <td className="pr-6 py-5 h-14">
                            <div className="flex items-center">
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

                          <td className="px-6 py-4 text-sm  flex flex-col text-gray-900"></td>
                          <td className="px-6 py-4"></td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-red-500"></span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-red-500"></span>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                }
              </table>
            )
          ) : null}

          {!isPaginatedLoading &&
          paginated?.items &&
          paginated?.items?.length === 0 ? (
            <div className="flex mb-4 w-full">
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed">
                  <thead className="text-xs text-gray-700 uppercase bg-white-50 dark:bg-white-700 dark:text-gray-400 shadow-none">
                    <tr>
                      <th scope="col" className="w-[6%] text-slate-900"></th>
                      <th scope="col" className="">
                        <div className="flex items-start justify-start">
                          {/* <a href="#" className="group inline-flex items-center"> */}
                          User
                          <button
                            onClick={(e) => handleInputChange(e, "firstName")}
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
                      {selectedRole === "Administrator" ? (
                        " "
                      ) : (
                        <>
                          <th className="">
                            <div className="flex items-center justify-center ml-8">
                              <span> City</span>
                              <button
                                onClick={(e) =>
                                  handleInputChange(e, "locationId")
                                }
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

                          {selectedRole !== "Personnel" && (
                            <th className="">
                              <div className="flex items-start justify-start ml-7">
                                <span className="flex">
                                  Factory<p className="text-red-600 ml-1">*</p>
                                </span>
                                <button
                                  onClick={(e) =>
                                    handleInputChange(e, "factoryId")
                                  }
                                >
                                  <svg
                                    className="w-3 h-3 ml-1"
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
                          )}
                          {selectedRole === "Personnel" ? (
                            <>
                              <th className="">
                                <div className="flex items-start justify-start px-0 py-3 ml-9">
                                  <div className="flex items-center overflow-ellipsis whitespace-nowrap">
                                    Machine Class
                                    <p className="text-red-600 ml-1">*</p>
                                    <button
                                      onClick={(e) =>
                                        handleInputChange(e, "machineClassId")
                                      }
                                    >
                                      <svg
                                        className="w-3 h-3 ml-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </th>
                              <th className="">
                                <div className="flex items-center justify-center ml-24">
                                  <span className="flex">
                                    Factory
                                    <p className="text-red-600 ml-1">*</p>
                                  </span>
                                  <button
                                    onClick={(e) =>
                                      handleInputChange(e, "factoryId")
                                    }
                                  >
                                    <svg
                                      className="w-3 h-3 ml-1"
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
                            </>
                          ) : (
                            <th colSpan={1} className="">
                              <div className="flex items-start justify-start px-0 py-3 ml-11">
                                <div className="flex items-center ml-12">
                                  Department
                                  <p className="text-red-600 ml-1">*</p>
                                  <button
                                    onClick={(e) =>
                                      handleInputChange(e, "role")
                                    }
                                  >
                                    <svg
                                      className="w-3 h-3 ml-1"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </th>
                          )}
                        </>
                      )}
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
                      <td className="pr-6 py-5 h-14">
                        <div className="flex items-center">
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
                      className="bg-gray text-slate-900 font-medium border-b bg-gray-200"
                      data-accordion-target="#accordion-arrow-icon-body-0"
                      aria-expanded="false"
                      aria-controls="accordion-arrow-icon-body-0"
                    >
                      <td className="pr-6 py-5 h-14">
                        <div className="flex items-center">
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
                      className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                      data-accordion-target="#accordion-arrow-icon-body-0"
                      aria-expanded="false"
                      aria-controls="accordion-arrow-icon-body-0"
                    >
                      <td className="pr-6 py-5 h-14">
                        <div className="flex items-center">
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
                      className="bg-gray text-slate-900 font-medium border-b bg-gray-200"
                      data-accordion-target="#accordion-arrow-icon-body-0"
                      aria-expanded="false"
                      aria-controls="accordion-arrow-icon-body-0"
                    >
                      <td className="pr-6 py-5 h-14">
                        <div className="flex items-center">
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
                      className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                      data-accordion-target="#accordion-arrow-icon-body-0"
                      aria-expanded="false"
                      aria-controls="accordion-arrow-icon-body-0"
                    >
                      <td className="pr-6 py-5 h-14">
                        <div className="flex items-center">
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
                      <td className="pr-6 py-5 h-14">
                        <div className="flex items-center">
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
                      className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                      data-accordion-target="#accordion-arrow-icon-body-1"
                      aria-expanded="false"
                      aria-controls="accordion-arrow-icon-body-1"
                    >
                      <td className="pr-6 py-5 h-14">
                        <div className="flex items-center">
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
                <div className="flex justify-between">
                  <p className="text-sm  text-gray-700">
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
                {(paginated as any)?.archivedUsersCount ? (
                  <div>
                    <p className="text-sm  text-gray-700">
                      {(paginated as any)?.archivedUsersCount} user archived
                    </p>
                  </div>
                ) : null}
                {/* <span className="py-1.5 text-center px-2 cursor-pointer border-1 text-[14px] uppercase bg-[#7F1D1D] border-black rounded-md text-white">
                  Create Team List
                </span> */}
                <div>
                  {isPaginatedLoading ? (
                    <div className="animate-pulse flex space-x-4">
                      <div className="h-8 w-36 bg-slate-200 rounded"></div>
                    </div>
                  ) : (
                    <nav
                      className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1 || numberOfPages === 0}
                        className="relative disabled:opacity-70 inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        {page} / {numberOfPages ? numberOfPages : 1}
                      </button>
                      <button
                        onClick={() => setPage(page + 1)}
                        className="relative disabled:opacity-70 inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        disabled={page === numberOfPages || numberOfPages === 0}
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon
                          className="h-5 w-5"
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
        <div>
          {alertPrompt ? (
            <Alert
              className={`${
                !alertPrompt
                  ? "transition duration-500 ease-out"
                  : "transition duration-500 ease-linear"
              } absolute w-[40%] md:w-[40%] lg:w-[40%] md:-bottom-[15rem] lg:bottom-[25rem] bottom-0 md:-right-0 lg:-right-[0rem] shadow-md`}
              message="Missing Information"
              description={`${errorMsg} not selected. Please select a ${errorMsg} to proceed.`}
              type="error"
              showIcon
            />
          ) : (
            ""
          )}
        </div>
        <ConfirmationModal
          isOpen={confirmationModal}
          onClose={() => setConfirmationModal(false)}
          user={selectedRow as T_User}
          status={action as T_UserStatus}
        />
        <DeleteModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          user={selectedRow as T_User}
          status={action as T_UserStatus}
        />

        <NewMemberModal isOpen={newModal} onClose={() => setNewModal(false)} />
      </div>
    </>
  )
}

export default Content
