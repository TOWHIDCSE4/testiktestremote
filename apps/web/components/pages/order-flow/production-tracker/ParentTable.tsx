import { ChevronDownIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"
import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import { T_MachineClass } from "custom-validator"
import useMachineClasses from "../../../../hooks/machineClasses/useMachineClasses"
import combineClasses from "../../../../helpers/combineClasses"
import TabTable from "./TabTable"
import { T_JobStatus } from "custom-validator"
import useProfile from "../../../../hooks/users/useProfile"
import useCountStatus from "../../../../hooks/jobs/useCountStatus"
import useStoreSession from "../../../../store/useStoreSession"

const ParentTable = ({ locationId }: { locationId: string }) => {
  const [currentTab, setCurrentTab] = useState<T_JobStatus>("Pending")
  const [selectedValue, setSelectedValue] = useState<string>("client")
  const [inputValue, setInputValue] = useState<string>("")
  const [isAllFilterSelected, setIsAllFilterSelected] = useState(true)
  const { data: machineClasses, isLoading: isMachineClassesLoading } =
    useMachineClasses()
  const { data: userProfile } = useProfile()
  const [openFilter, setOpenFilter] = useState(false)
  const [checkAll, setCheckAll] = useState(false)
  const [machineClassArray, setMachineClassArray] = useState<string[]>([])
  const [deleteModal, setDeleteModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [clickRender, setClickRender] = useState(false)

  const { data, isLoading, setJobStatuses, setJobLocation } = useCountStatus()

  const tabs = [
    { name: "Pending", count: 0, current: currentTab === "Pending" },
    { name: "Active", count: 2, current: currentTab === "Active" },
    { name: "Testing", count: 1, current: currentTab === "Testing" },
    { name: "Archived", count: 0, current: currentTab === "Archived" },
    { name: "Deleted", count: 0, current: currentTab === "Deleted" },
  ]

  const handleSelectMachineClass = (e: any, id: any) => {
    if (id === "all") {
      const isChecked = e.target.checked
      // const allMachineClassIds = machineClasses?.items.map(
      //   (machineClass: T_MachineClass) => machineClass._id || ""
      // )
      setMachineClassArray(isChecked ? ["all"] : [])
    } else {
      e.stopPropagation()
      setMachineClassArray((prevIds) => {
        const updatedIds = prevIds.includes(id)
          ? prevIds.filter((existingId) => existingId !== id)
          : [...prevIds, id]

        return updatedIds
      })
    }
  }

  useEffect(() => {
    // if (machineClasses?.items) {
    //   const allMachineClassIds = machineClasses.items.map(
    //     (machineClass: T_MachineClass) => machineClass._id || ""
    //   )
    //   setMachineClassArray(allMachineClassIds)
    //   setCheckAll(true)
    // }
    setMachineClassArray(["all"])
    setCheckAll(true)
  }, [machineClasses])

  useEffect(() => {
    if (machineClasses?.items.length === machineClassArray.length) {
      setCheckAll(true)
    } else {
      setCheckAll(false)
    }
  })

  useEffect(() => {
    if (
      !isMachineClassesLoading &&
      machineClasses?.items &&
      machineClasses?.items.length > 0
    ) {
      const updatedMachineClasses = machineClasses?.items?.map(
        (machineClass: T_MachineClass) => ({
          ...machineClass,
          isSelected: !isAllFilterSelected,
        })
      )
      setIsAllFilterSelected(!isAllFilterSelected)
    }
  }, [machineClasses])

  useEffect(() => {
    setSelectedValue("client")
  }, [currentTab])

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.currentTarget.value
    setSelectedValue(selectedOption)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value
    setInputValue(newValue)
  }
  const pageFuncRender = () => {
    setClickRender(!clickRender)
  }

  useEffect(() => {
    if (locationId) {
      setJobLocation(locationId)
    }
    setJobStatuses(tabs.map((tab) => tab.name) as string[])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId])

  const jobStatusCount = data
    ? data?.map((jobCount) => {
        if (!jobCount.error) {
          return jobCount.item
        }
      })
    : []

  const personnelMachineClass = machineClasses?.items?.find(
    (MachineName: any) => MachineName._id === userProfile?.item.machineClassId
  )

  const handleMachineClassClick = (e: any) => {
    if (openFilter) {
      if (
        !e.target.closest(".your-menu-class") &&
        !e.target.classList.contains("h-4")
      ) {
        setOpenFilter(false)
      }
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleMachineClassClick)

    return () => {
      document.removeEventListener("click", handleMachineClassClick)
    }
  }, [openFilter])

  return (
    <>
      <div
        className={`drop-shadow-lg border border-gray-200 bg-white rounded-md mt-7`}
      >
        <div>
          <div>
            {/* Tabs */}
            <div
              className={`flex items-center px-4 md:px-0 mt-4 pb-4 md:pb-0 md:mt-0 shadow`}
            >
              <div className="w-full">
                <div className="sm:hidden">
                  <label htmlFor="tabs" className="sr-only">
                    Select a tab
                  </label>
                  <select
                    id="tabs"
                    name="tabs"
                    className="block w-full border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-blue-950"
                    defaultValue={
                      // @ts-expect-error
                      tabs.find((tab) => tab.current).name
                    }
                    onChange={(e) => {
                      setCurrentTab(e.currentTarget.value as T_JobStatus)
                    }}
                  >
                    {tabs.map((tab) => (
                      <option key={tab.name} value={tab.name}>
                        {tab.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="hidden sm:block">
                  <nav
                    className="flex divide-x divide-gray-200 isolate"
                    aria-label="Tabs"
                  >
                    {tabs.map((tab, tabIdx) => (
                      <button
                        key={tab.name}
                        className={combineClasses(
                          tab.current
                            ? "bg-blue-950 text-slate-50 hover:bg-blue-900"
                            : "text-gray-500 hover:text-gray-700",
                          tabIdx === 0 ? "" : "",
                          tabIdx === tabs.length - 1 ? "" : "",
                          "group relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-center text-sm font-bold focus:z-10"
                        )}
                        aria-current={tab.current ? "page" : undefined}
                        onClick={() => {
                          pageFuncRender()
                          setCurrentTab(tab.name as T_JobStatus)
                        }}
                      >
                        <span>
                          {isLoading
                            ? "Loading..."
                            : `${tab.name} (${jobStatusCount[tabIdx]})`}
                        </span>
                        <span
                          aria-hidden="true"
                          className={combineClasses(
                            tab.current ? "bg-blue-950" : "bg-transparent",
                            "inset-x-0"
                          )}
                        />
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
            <div
              className={`flex justify-between items-center px-4 md:px-0 mt-2 pb-2 m md:mt-0 shadow`}
            >
              {currentTab === "Active" ? (
                <div className="md:flex items-center mt-2 w-[18rem]">
                  <label
                    htmlFor="JobSelector"
                    className="uppercase font-semibold text-md text-gray-800 md:w-[70%] text-right mr-3"
                  >
                    JOB SELECTOR
                  </label>
                  <select
                    className={`block mt-2  bg-white dark:bg-gray-300 font-semibold md:mt-0 w-full md:w-[60%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                    onChange={handleDropdownChange}
                  >
                    <option value="CLIENT">CLIENT</option>
                    <option value="STOCK">STOCK</option>
                  </select>
                </div>
              ) : (
                <div></div>
              )}
              <div
                className={`${
                  currentTab == "Active"
                    ? "mt-2 ml-3 flex"
                    : "block mt-2 font-semibold w-full md:w-[60%] rounded-md border-0 pl-3 pr-10 sm:text-sm"
                }`}
              >
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button
                      className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      onClick={() => {
                        setOpenFilter((openFilter) => !openFilter)
                      }}
                    >
                      Machine Class
                      <ChevronDownIcon
                        className="w-5 h-5 -mr-1 text-gray-400"
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
                      className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <div className="relative px-4 py-0.5 flex items-start">
                              {userProfile?.item.role !== "Personnel" && (
                                <div className="flex items-center h-6">
                                  <input
                                    id="all"
                                    aria-describedby="all-description"
                                    name="all"
                                    type="checkbox"
                                    className="w-4 h-4 border-gray-300 rounded text-blue-950 focus:ring-1 focus:ring-blue-950"
                                    checked={checkAll}
                                    onChange={(e) => {
                                      handleSelectMachineClass(e, "all")
                                    }}
                                  />
                                </div>
                              )}
                              {userProfile?.item.role !== "Personnel" && (
                                <div className="flex flex-col ml-3 text-sm leading-6">
                                  <label
                                    htmlFor="all"
                                    className="text-gray-700"
                                  >
                                    All
                                  </label>
                                </div>
                              )}
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          <div className="relative px-4 py-0.5">
                            {userProfile?.item.role === "Personnel" ? (
                              personnelMachineClass ? (
                                <div className="flex items-start">
                                  <div className="flex items-center h-6">
                                    <input
                                      id={personnelMachineClass._id}
                                      aria-describedby={`${personnelMachineClass._id}-description`}
                                      name={personnelMachineClass._id}
                                      type="checkbox"
                                      className="w-4 h-4 border-gray-300 rounded text-blue-950 focus:ring-1 focus:ring-blue-950"
                                      checked={machineClassArray.includes(
                                        personnelMachineClass._id
                                      )}
                                      onChange={(e) => {
                                        handleSelectMachineClass(
                                          e,
                                          personnelMachineClass._id
                                        )
                                      }}
                                    />
                                  </div>
                                  <div className="ml-3 text-sm leading-6">
                                    <label
                                      htmlFor={personnelMachineClass._id}
                                      className="text-gray-700"
                                    >
                                      {personnelMachineClass.name}
                                    </label>
                                  </div>
                                </div>
                              ) : null
                            ) : (
                              machineClasses?.items?.map(
                                (machineClassId: T_MachineClass) => (
                                  <div
                                    key={machineClassId._id}
                                    className="flex items-start"
                                  >
                                    <div className="flex items-center h-6">
                                      <input
                                        id={machineClassId._id || ""}
                                        aria-describedby={`${machineClassId._id}-description`}
                                        name={machineClassId._id || ""}
                                        type="checkbox"
                                        className="w-4 h-4 border-gray-300 rounded text-blue-950 focus:ring-1 focus:ring-blue-950"
                                        checked={machineClassArray.includes(
                                          machineClassId._id || ""
                                        )}
                                        onChange={(e) => {
                                          handleSelectMachineClass(
                                            e,
                                            machineClassId._id
                                          )
                                        }}
                                      />
                                    </div>
                                    <div className="ml-3 text-sm leading-6">
                                      <label
                                        htmlFor={machineClassId._id}
                                        className="text-gray-700"
                                      >
                                        {machineClassId.name}
                                      </label>
                                    </div>
                                  </div>
                                )
                              )
                            )}
                          </div>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
                {/* <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button
                      className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      onClick={() => {
                        setOpenFilter((openFilter) => !openFilter)
                        // filterCheckHandler();
                      }}
                    >
                      Machine Class
                      <ChevronDownIcon
                        className="w-5 h-5 -mr-1 text-gray-400"
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
                      className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <div className="relative px-4 py-0.5 flex items-start">
                              <div className="flex items-center h-6">
                                <input
                                  id="all"
                                  aria-describedby="all-description"
                                  name="all"
                                  type="checkbox"
                                  className="w-4 h-4 border-gray-300 rounded text-blue-950 focus:ring-1 focus:ring-blue-950"
                                  checked={checkAll}
                                  onChange={(e) => {
                                    handleSelectMachineClass(e, "all")
                                  }}
                                />
                              </div>
                              <div className="flex flex-col ml-3 text-sm leading-6">
                                <label htmlFor="all" className="text-gray-700">
                                  All
                                </label>
                              </div>
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          <div className="relative px-4 py-0.5">
                            {machineClasses?.items.map(
                              (machineClassId: T_MachineClass) => (
                                <div
                                  key={machineClassId._id}
                                  className="flex items-start"
                                >
                                  <div className="flex items-center h-6">
                                    <input
                                      id={machineClassId._id || ""}
                                      aria-describedby={`${machineClassId._id}-description`}
                                      name={machineClassId._id || ""}
                                      type="checkbox"
                                      className="w-4 h-4 border-gray-300 rounded text-blue-950 focus:ring-1 focus:ring-blue-950"
                                      checked={machineClassArray.includes(
                                        machineClassId._id || ""
                                      )}
                                      onChange={(e) => {
                                        handleSelectMachineClass(
                                          e,
                                          machineClassId._id
                                        )
                                      }}
                                    />
                                  </div>
                                  <div className="ml-3 text-sm leading-6">
                                    <label
                                      htmlFor={machineClassId._id}
                                      className="text-gray-700"
                                    >
                                      {machineClassId.name}
                                    </label>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu> */}
              </div>
              <div className={`mt-2 mr-5 flex`}>
                <div className="flex">
                  <button className="px-3 py-1 text-lg font-semibold text-gray-800 rounded-md">
                    SEARCH
                  </button>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
                    <input
                      id="search"
                      name="search"
                      className={`block w-56 rounded-md border-0 bg-white dark:bg-gray-300  py-1.5  pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6`}
                      placeholder="TYPE HERE"
                      type="search"
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Table */}
            <div className="relative w-full overflow-x-auto">
              <TabTable
                pageRender={clickRender}
                tab={currentTab}
                machineClassIds={machineClassArray}
                locationId={locationId}
                searchInput={inputValue}
                jobSelection={currentTab === "Active" ? selectedValue : ""}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ParentTable
