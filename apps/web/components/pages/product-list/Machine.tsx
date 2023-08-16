"use client"
import { Dispatch, useEffect, useState } from "react"
import Image from "next/image"
import { TrashIcon } from "@heroicons/react/24/outline"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid"
import EditModal from "./modals/EditModal"
import DeleteMachineModal from "./modals/DeleteMachineModal"
import MachineDetailsModal from "./modals/MachineDetailsModal"
import combineClasses from "../../../helpers/combineClasses"
import useFactories from "../../../hooks/factories/useFactories"
import useFactoryMachineClasses from "../../../hooks/factories/useFactoryMachineClasses"
import { T_Factory, T_Machine, T_MachineClass } from "custom-validator"
import usePaginatedMachines from "../../../hooks/machines/usePaginatedMachines"

type T_LocationTabs = {
  _id?: string
  name: string
  count?: number
}

type T_Machine_Page = {
  setCurrentLocationTab: Dispatch<string>
  currentLocationTab: string
  currentLocationTabName?: string
  locationTabs: T_LocationTabs[]
  isLocationsLoading: boolean
}

const Machine = ({
  setCurrentLocationTab,
  currentLocationTab,
  currentLocationTabName,
  locationTabs,
  isLocationsLoading,
}: T_Machine_Page) => {
  const {
    data: allMachines,
    isLoading: isGetAllMachinesLoading,
    setLocationId,
    setPage,
    setFactoryId,
    setMachineClassId,
    setName,
    page,
  } = usePaginatedMachines()
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  const {
    data: machineClasses,
    isRefetching: isMachineClassesRefetching,
    setSelectedFactoryId,
  } = useFactoryMachineClasses()
  const [openNewModal, setOpenNewModal] = useState(false)
  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [factoryIdFilter, setFactoryIdFilter] = useState("")
  const [machineClassIdFilter, setMachineClassIdFilter] = useState("")
  const [nameFilter, setNameFilter] = useState("")
  const [selectedPartId, setSelectedMachineId] = useState<string | undefined>(
    ""
  )

  useEffect(() => {
    setLocationId(currentLocationTab)
  }, [currentLocationTab, setLocationId])

  const numberOfPages = Math.ceil((allMachines?.itemCount as number) / 6)

  useEffect(() => {
    if (factoryIdFilter) {
      setSelectedFactoryId(factoryIdFilter)
    }
  }, [factoryIdFilter, setSelectedFactoryId])

  useEffect(() => {
    setFactoryId(factoryIdFilter)
    setMachineClassId(machineClassIdFilter)
    setName(nameFilter)
  }, [
    factoryIdFilter,
    machineClassIdFilter,
    nameFilter,
    setFactoryId,
    setMachineClassId,
    setName,
  ])

  return (
    <div className={`mt-6 my-10`}>
      <div>
        {/* Location */}
        <div className="grid grid-cols-3 gap-x-6 md:gap-x-8 2xl:gap-x-24 mt-5">
          {locationTabs.map((tab) => (
            <div key={tab.name}>
              <button
                type="button"
                className={combineClasses(
                  tab._id === currentLocationTab
                    ? "bg-blue-950 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50",
                  "uppercase rounded-md py-3.5 font-extrabold shadow-sm ring-1 ring-inset ring-gray-200 w-full"
                )}
                onClick={() => setCurrentLocationTab(tab?._id as string)}
              >
                {tab.name} {tab?.count ? `(${tab.count})` : null}
              </button>
              <div className="flex mt-1">
                <div className="flex h-6 items-center">
                  <input
                    id="compare"
                    aria-describedby="compare-description"
                    name="compare"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-950"
                  />
                </div>
                <div className="ml-2 md:ml-3 text-xs md:text-sm leading-6">
                  <label
                    htmlFor="compare"
                    className="font-medium text-gray-900 uppercase"
                  >
                    Compare
                  </label>
                </div>
              </div>
            </div>
          ))}
          {isLocationsLoading && (
            <>
              <div className="animate-pulse flex space-x-4">
                <div className="h-14 w-full rounded bg-slate-200"></div>
              </div>
              <div className="animate-pulse flex space-x-4">
                <div className="h-14 w-full rounded bg-slate-200"></div>
              </div>
              <div className="animate-pulse flex space-x-4">
                <div className="h-14 w-full rounded bg-slate-200"></div>
              </div>
            </>
          )}
        </div>
        <div className="w-full h-[1.5px] bg-gray-200 mt-5"></div>
        {/* Other sub items */}
        <div className="grid grid-cols-1 md:grid-cols-3 mt-5 p-4 bg-white border border-gray-200 shadow-sm rounded-md gap-x-8 gap-y-5 md:gap-y-0 2xl:gap-x-24">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-900"
            >
              Show Only Filter
            </label>
            <select
              id="location"
              name="location"
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6"
              onChange={(e) => setFactoryIdFilter(e.target.value)}
            >
              <option value={""}>All</option>
              {factories?.items.map((item: T_Factory, index: number) => {
                return (
                  <option key={index} value={item._id as string}>
                    {item.name}
                  </option>
                )
              })}
              <option>Not Assigned</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-900"
            >
              Machine Class
            </label>
            <select
              id="location"
              name="location"
              className="mt-2 disabled:opacity-70 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6"
              onChange={(e) => setMachineClassIdFilter(e.target.value)}
              disabled={
                isLocationsLoading ||
                isFactoriesLoading ||
                isMachineClassesRefetching
              }
            >
              <option value={""}>All</option>
              {machineClasses?.items?.map(
                (machine: T_MachineClass, index: number) => {
                  return (
                    <option key={index} value={machine._id as string}>
                      {machine.name}
                    </option>
                  )
                }
              )}
            </select>
          </div>
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-900"
            >
              Search Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="search"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Product card list container */}
        {isGetAllMachinesLoading ? (
          <div className="animate-pulse flex space-x-4">
            <div className="h-6 w-24 mt-10 bg-slate-200 rounded"></div>
          </div>
        ) : allMachines?.itemCount === 0 ? (
          <h6 className="font-bold mt-7 text-lg text-gray-800">
            No machines found
          </h6>
        ) : (
          <h6 className="font-bold mt-7 text-lg text-gray-800">
            {allMachines?.itemCount} Machines
          </h6>
        )}
        <div>
          <div className="mx-auto">
            <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {isGetAllMachinesLoading ? (
                <>
                  <div className="animate-pulse flex space-x-4">
                    <div className="h-80 w-full mt-7 bg-slate-200 rounded"></div>
                  </div>

                  <div className="animate-pulse flex space-x-4">
                    <div className="h-80 w-full mt-7 bg-slate-200 rounded"></div>
                  </div>

                  <div className="animate-pulse flex space-x-4">
                    <div className="h-80 w-full mt-7 bg-slate-200 rounded"></div>
                  </div>
                </>
              ) : (
                allMachines?.items?.map((product: T_Machine, index: number) => {
                  const selectedImage = product.files?.find(
                    (file) =>
                      file.toLocaleLowerCase().includes("png") ||
                      file.toLocaleLowerCase().includes("jpg")
                  )
                  return (
                    <div
                      key={index}
                      className="group relative bg-white rounded-md border border-gray-200 shadow cursor-pointer"
                      onClick={() => {
                        setOpenDetailsModal(true)
                        setSelectedMachineId(product._id as string)
                      }}
                    >
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden lg:aspect-none group-hover:opacity-75 rounded-t-md">
                        <div className="relative">
                          {!isGetAllMachinesLoading && selectedImage ? (
                            <Image
                              className="h-60"
                              src={`/files/${selectedImage}`}
                              alt={selectedImage as string}
                              width={400}
                              height={400}
                            />
                          ) : !isGetAllMachinesLoading && !selectedImage ? (
                            <Image
                              className="h-60"
                              src="/no-image.png"
                              alt="Part Image"
                              width={400}
                              height={400}
                            />
                          ) : (
                            <div className="animate-pulse flex space-x-4">
                              <div className="h-52 w-full bg-slate-200"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between px-4 py-4">
                        <div>
                          <h3 className="text-gray-700 font-bold uppercase">
                            {product.name}
                          </h3>
                        </div>
                        <p className="font-bold uppercase text-green-600">
                          {currentLocationTabName
                            ? currentLocationTabName
                            : "Loading..."}
                        </p>
                      </div>
                      <div className="flex justify-end px-4 space-x-3 my-4">
                        <button
                          className="p-1 bg-red-700 rounded-md"
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenDeleteModal(true)
                            setSelectedMachineId(product._id as string)
                          }}
                        >
                          <TrashIcon className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-10">
          <div className="flex flex-1 justify-between sm:hidden">
            <a
              href="#"
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </a>
            <a
              href="#"
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </a>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            {isGetAllMachinesLoading ? (
              <div className="animate-pulse flex space-x-4">
                <div className="h-4 w-48 mt-7 bg-slate-200 rounded"></div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {allMachines?.items?.length as number}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{allMachines?.itemCount}</span>{" "}
                  results
                </p>
              </div>
            )}
            <div>
              {isGetAllMachinesLoading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="h-8 w-36 mt-7 bg-slate-200 rounded"></div>
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
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {numberOfPages
                    ? [...Array(numberOfPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => setPage(index + 1)}
                          className={
                            page === index + 1
                              ? "relative z-10 inline-flex items-center bg-blue-950 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          }
                        >
                          {index + 1}
                        </button>
                      ))
                    : null}
                  <button
                    onClick={() => setPage(page + 1)}
                    className="relative disabled:opacity-70 inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    disabled={page === numberOfPages || numberOfPages === 0}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
      <EditModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
      />
      <DeleteMachineModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        _id={selectedPartId}
      />
      <MachineDetailsModal
        isOpen={openDetailsModal}
        locationState={
          currentLocationTabName ? currentLocationTabName : "Loading..."
        }
        onClose={() => setOpenDetailsModal(false)}
        id={selectedPartId}
      />
    </div>
  )
}

export default Machine
