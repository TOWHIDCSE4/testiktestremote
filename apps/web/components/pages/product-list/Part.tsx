"use client"
import { Dispatch, useEffect, useState } from "react"
import Image from "next/image"
import { TrashIcon } from "@heroicons/react/24/outline"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid"
import EditModal from "./modals/EditModal"
import DeleteModal from "./modals/DeleteModal"
import DetailsModal from "./modals/DetailsModal"
import combineClasses from "../../../helpers/combineClasses"
import usePaginatedParts from "../../../hooks/parts/usePaginatedParts"
import { T_Part } from "custom-validator"

const products = [
  {
    id: 1,
    name: "Product Name",
    href: "#",
    imageSrc: "/no-image.png",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "$35",
    color: "Black",
  },
  {
    id: 2,
    name: "Product Name",
    href: "#",
    imageSrc: "/no-image.png",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "$35",
    color: "Black",
  },
  {
    id: 3,
    name: "Product Name",
    href: "#",
    imageSrc: "/no-image.png",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "$35",
    color: "Black",
  },
]

type T_LocationTabs = {
  _id: string
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
  } = usePaginatedParts()
  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  useEffect(() => {
    setLocationId(currentLocationTab)
  }, [currentLocationTab, setLocationId])
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
                onClick={() => setCurrentLocationTab(tab._id)}
              >
                {tab.name}
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
            >
              <option className="uppercase">All</option>
              <option className="uppercase">Pipe and Box</option>
              <option className="uppercase">Precast</option>
              <option className="uppercase">Steel</option>
              <option className="uppercase">Exterior</option>
              <option className="uppercase">Not Assigned</option>
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
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6"
            >
              <option></option>
              <option className="uppercase">All</option>
              <option className="uppercase">Radial Press</option>
              <option className="uppercase">Variant</option>
              <option className="uppercase">Wire Cage (BMK)</option>
              <option className="uppercase">Blizzard</option>
              <option className="uppercase">Tornado</option>
              <option className="uppercase">Perfect System</option>
              <option className="uppercase">Steel</option>
              <option className="uppercase">Fittings</option>
              <option className="uppercase">Misc</option>
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
              />
            </div>
          </div>
        </div>
        {/* Product card list container */}
        <h6 className="font-bold mt-7 text-lg text-gray-800">
          {allParts?.itemCount} Parts
        </h6>
        <div>
          <div className="mx-auto">
            <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {allParts?.items.map((product: T_Part) => {
                const selectedImage = product.files?.find(
                  (file) =>
                    file.toLocaleLowerCase().includes("png") ||
                    file.toLocaleLowerCase().includes("jpg")
                )
                return (
                  <div
                    key={product._id}
                    className="group relative bg-white rounded-md border border-gray-200 drop-shadow-lg cursor-pointer"
                    onClick={() => setOpenDetailsModal(true)}
                  >
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden lg:aspect-none group-hover:opacity-75 h-72 rounded-t-md">
                      <div className="h-full w-full lg:h-full lg:w-full relative">
                        <Image
                          src={`/files/${selectedImage}`}
                          alt={selectedImage as string}
                          className="h-full w-full object-center"
                          width={400}
                          height={400}
                        />
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
                    <div className="px-4">
                      <div className="flex justify-between text-gray-900">
                        <span>Pounds:</span>
                        <span>{product.pounds}</span>
                      </div>
                      <div className="flex justify-between text-gray-900">
                        <span>Avg Time:</span>
                        <span>{product.time}</span>
                      </div>
                    </div>
                    <div className="flex justify-end px-4 space-x-3 my-4">
                      <button
                        className="p-1 bg-red-700 rounded-md"
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenDeleteModal(true)
                        }}
                      >
                        <TrashIcon className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  </div>
                )
              })}
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
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">10</span> of{" "}
                <span className="font-medium">97</span> results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </a>
                {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
                <a
                  href="#"
                  aria-current="page"
                  className="relative z-10 inline-flex items-center bg-blue-950 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  1
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  2
                </a>
                <a
                  href="#"
                  className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                >
                  3
                </a>
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                  ...
                </span>
                <a
                  href="#"
                  className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                >
                  8
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  9
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  10
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <EditModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
      />
      <DeleteModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      />
      <DetailsModal
        isOpen={openDetailsModal}
        locationState={
          currentLocationTabName ? currentLocationTabName : "Loading..."
        }
        onClose={() => setOpenDetailsModal(false)}
      />
    </div>
  )
}

export default Part
