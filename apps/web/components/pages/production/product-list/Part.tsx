"use client"
import { Dispatch, useEffect, useState } from "react"
import Image from "next/image"
import { TrashIcon } from "@heroicons/react/24/outline"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid"
import EditModal from "./modals/EditModal"
import PartDetailsModal from "./modals/PartDetailsModal"
import combineClasses from "../../../../helpers/combineClasses"
import usePaginatedParts from "../../../../hooks/parts/usePaginatedParts"
import { T_Factory, T_MachineClass, T_Part } from "custom-validator"
import useFactories from "../../../../hooks/factories/useFactories"
import useFactoryMachineClasses from "../../../../hooks/factories/useFactoryMachineClasses"
import DeletePartModal from "./modals/DeletePartModal"
import DropDownMenu from "./DropDownMenu"
import useGetPartLocationCount from "../../../../hooks/parts/useGetPartLocationCount"
import useProfile from "../../../../hooks/users/useProfile"

type T_LocationTabs = {
  _id?: string
  name: string
}

type T_Part_Page = {
  setCurrentLocationTab: Dispatch<string>
  currentLocationTab: string
  currentLocationTabName?: string
  locationTabs: T_LocationTabs[]
  isLocationsLoading: boolean
}

const Part = ({
  setCurrentLocationTab,
  currentLocationTab,
  currentLocationTabName,
  locationTabs,
  isLocationsLoading,
}: T_Part_Page) => {
  const {
    data: allParts,
    isLoading: isGetAllPartsLoading,
    setLocationId,
    setPage,
    setFactoryId,
    setMachineClassId,
    setName,
    page,
  } = usePaginatedParts()
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  const {
    data: machineClasses,
    isRefetching: isMachineClassesRefetching,
    setSelectedFactoryId,
  } = useFactoryMachineClasses()
  const { data: partLocationCount, setPartLocationIds } =
    useGetPartLocationCount()
  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedPartId, setSelectedPartId] = useState<string | undefined>("")
  const [factoryIdFilter, setFactoryIdFilter] = useState("all")
  const { data: userProfile, isLoading: isUserProfileLoading } = useProfile()
  const [machineClassIdFilter, setMachineClassIdFilter] = useState("all")
  const [nameFilter, setNameFilter] = useState("")

  useEffect(() => {
    setLocationId(currentLocationTab)
    setPage(1)
  }, [currentLocationTab, setLocationId])

  const numberOfPages = Math.ceil((allParts?.itemCount as number) / 6) || 1

  useEffect(() => {
    if (factoryIdFilter) {
      if (factoryIdFilter === "all") {
        setMachineClassIdFilter("all")
      }
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

  useEffect(() => {
    setPartLocationIds(locationTabs.map((tab) => tab._id) as string[])
  }, [locationTabs])

  const locationsCount = partLocationCount
    ? partLocationCount?.map((partLocation) => {
        if (!partLocation.error) {
          return partLocation.item
        }
      })
    : []

  const setFactoryFilter = (value: any) => {
    setFactoryIdFilter(value)
    setPage(1)
  }

  const setMachineFilter = (value: any) => {
    setMachineClassIdFilter(value)
  }

  return (
    <div className={`mt-6 my-10 pb-16`}>
      <div>
        {/* Location */}
        <div className="grid grid-cols-3 gap-x-6 md:gap-x-8 2xl:gap-x-24 mt-5">
          {locationTabs.map((tab, index) => (
            <div key={tab.name}>
              <button
                type="button"
                className={combineClasses(
                  tab._id === currentLocationTab
                    ? "bg-blue-950 text-white"
                    : "bg-white text-gray-700 disabled:text-gray-400 hover:bg-gray-50",
                  "uppercase rounded-md py-3.5 font-extrabold shadow-sm ring-1 ring-inset ring-gray-200 w-full"
                )}
                onClick={() => setCurrentLocationTab(tab?._id as string)}
                disabled={
                  userProfile?.item.role === "Personnel" &&
                  tab._id !== userProfile?.item.locationId
                }
              >
                {tab.name}{" "}
                {locationsCount[index] ? `(${locationsCount[index]})` : null}
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
              onChange={(e) => setFactoryFilter(e.target.value)}
            >
              <option value={"all"}>All</option>
              {factories?.items?.map((item: T_Factory, index: number) => {
                return (
                  <option key={index} value={item._id as string}>
                    {item.name}
                  </option>
                )
              })}
              {/* <option>Not Assigned</option> */}
              <option>Not Verified</option>
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
              onChange={(e) => setMachineFilter(e.target.value)}
              disabled={
                isLocationsLoading ||
                isFactoriesLoading ||
                isMachineClassesRefetching
              }
            >
              <option value={"all"}>All</option>
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
        <div className="hidden mt-7 sm:flex sm:flex-1 sm:items-center sm:justify-between">
          {isGetAllPartsLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-6 w-24 mt-10 bg-slate-200 rounded"></div>
            </div>
          ) : allParts?.itemCount === 0 ? (
            <h6 className="font-bold mt-7 text-lg text-gray-800">
              No parts found
            </h6>
          ) : (
            <h6 className="font-bold text-lg text-gray-800">
              {allParts?.itemCount} Parts
            </h6>
          )}
          <div>
            {isGetAllPartsLoading ? (
              <div className="animate-pulse flex space-x-4">
                <div className="h-8 w-36 mt-7 bg-slate-200 rounded"></div>
              </div>
            ) : (
              <nav
                className="isolate inline-flex rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1 || numberOfPages === 0}
                  className={`relative disabled:opacity-70 inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    page > 1 && "font-bold"
                  }`}
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
                  {page} / {numberOfPages}
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  className={`relative disabled:opacity-70 inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
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

        <div>
          <div className="mx-auto">
            <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {isGetAllPartsLoading ? (
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
                allParts?.items?.map((product: T_Part, index: number) => {
                  const selectedImage = product.files?.find(
                    (file) =>
                      file.toLocaleLowerCase().includes("png") ||
                      file.toLocaleLowerCase().includes("jpg")
                  )
                  return (
                    <div
                      key={index}
                      className="group bg-white rounded-md border border-gray-200 shadow cursor-pointer relative"
                      onClick={() => {
                        setOpenDetailsModal(true)
                        setSelectedPartId(product._id as string)
                      }}
                    >
                      <div className="absolute z-10 right-1 top-1">
                        <DropDownMenu
                          setOpenEditModal={(
                            e: React.MouseEvent<HTMLElement>
                          ) => {
                            e.stopPropagation()
                            if (userProfile?.item.role !== "Personnel") {
                              setOpenDetailsModal(true)
                            }
                            setSelectedPartId(product._id as string)
                          }}
                          setOpenDeleteModal={(
                            e: React.MouseEvent<HTMLElement>
                          ) => {
                            e.stopPropagation()
                            if (userProfile?.item.role !== "Personnel") {
                              setOpenDeleteModal(true)
                            }
                            setSelectedPartId(product._id as string)
                          }}
                        />
                      </div>
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden lg:aspect-none group-hover:opacity-75 rounded-t-md">
                        <div className="relative">
                          {!isGetAllPartsLoading && selectedImage ? (
                            <Image
                              className="h-60 object-none object-center"
                              src={`/files/${selectedImage}`}
                              alt={selectedImage as string}
                              width={400}
                              height={400}
                            />
                          ) : !isGetAllPartsLoading && !selectedImage ? (
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
                      <div className="px-4 pb-4">
                        <div className="flex justify-between text-gray-900">
                          <span>Tons:</span>
                          <span>{product.tons.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between text-gray-900">
                          <span>Avg Time:</span>
                          <span>{product.time}</span>
                        </div>
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
            {isGetAllPartsLoading ? (
              <div className="animate-pulse flex space-x-4">
                <div className="h-4 w-48 mt-7 bg-slate-200 rounded"></div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-bold">
                    {allParts?.items?.length as number}
                  </span>{" "}
                  items
                </p>
              </div>
            )}
            <div>
              {isGetAllPartsLoading ? (
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
                    <ChevronLeftIcon
                      className={`h-5 w-5 ${
                        page > 1 && "stroke-1 stroke-blue-950"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    {page} / {numberOfPages}
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
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
      <EditModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
      />
      <DeletePartModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        _id={selectedPartId}
      />
      {openDetailsModal && (
        <PartDetailsModal
          isOpen={openDetailsModal}
          locationState={
            currentLocationTabName ? currentLocationTabName : "Loading..."
          }
          onClose={() => setOpenDetailsModal(false)}
          id={selectedPartId}
        />
      )}
    </div>
  )
}

export default Part
