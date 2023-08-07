"use client"
import { Fragment, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Roboto } from "next/font/google"
import EditModal from "./EditModal"

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

interface DetailsModalProps {
  isOpen: boolean
  locationState: string
  typeState: string
  onClose: () => void
}

const DetailsModal = ({
  isOpen,
  locationState,
  typeState,
  onClose,
}: DetailsModalProps) => {
  const closeButtonRef = useRef(null)
  const [openEditModal, setOpenEditModal] = useState(false)

  const handleOpenEdit = () => {
    onClose()
    setOpenEditModal(true)
  }

  const partSection = () => {
    return (
      <form>
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <h3 className="text-gray-800 font-semibold text-2xl">Details</h3>
          <div className="flex justify-between mt-3">
            <h4 className="text-gray-800 font-bold text-xl uppercase">
              Product Name
            </h4>
            <h4 className="text-green-600 font-semibold text-xl uppercase">
              {locationState}
            </h4>
          </div>
          <div className="lg:flex justify-between">
            <div className="">
              <h6 className="text-gray-700 uppercase font-semibold mt-2">
                Factory:
                <span className="ml-2 text-gray-400">Pipe And Box</span>
              </h6>
              <h6 className="text-gray-700 uppercase font-semibold mt-3 lg:mt-[11px]">
                Machine/Process:
                <span className="ml-2 text-gray-400">Wire Cage (MBK)</span>
              </h6>
              <h6 className="text-gray-700 uppercase font-semibold mt-3 lg:mt-[16.5px]">
                Average Time Per Cycle:
                <span className="ml-2 text-gray-400">0</span>
              </h6>
              <h6 className="text-gray-700 uppercase font-semibold mt-3">
                Weight In Pound:
                <span className="ml-2 text-gray-400">0</span>
              </h6>
              <h6 className="text-gray-700 uppercase font-semibold mt-3">
                Finish Good Weight
                <span className="ml-2 text-gray-400">0</span>
              </h6>
              <h6 className="text-gray-700 uppercase font-semibold mt-3">
                Cage Weight Scrap:
                <span className="ml-2 text-gray-400">0</span>
              </h6>
              <h6 className="text-gray-700 uppercase font-semibold mt-3">
                Cage Weight Actual:
                <span className="ml-2 text-gray-400">0</span>
              </h6>
            </div>
            <div>
              <div className="mt-1 lg:grid grid-cols-4 items-center mt-3 lg:mt-0">
                <label
                  htmlFor="inventory"
                  className="text-amber-700 uppercase font-semibold col-span-2 lg:text-right mr-3"
                >
                  In Inventory:
                </label>
                <input
                  type="number"
                  name="inventory"
                  id="inventory"
                  className={`col-span-2 block mt-2 md:mt-0 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm ${roboto.className}`}
                  defaultValue="0"
                />
              </div>
              <div className="lg:grid grid-cols-4 items-center mt-3 lg:mt-2">
                <label
                  htmlFor="cost-to-manufacture"
                  className="text-amber-700 uppercase font-semibold col-span-2 lg:text-right mr-3"
                >
                  Cost To Manufacture:
                </label>
                <div className="relative col-span-2">
                  <span className="absolute pl-3 text-sm mt-[4.5px]">$</span>
                  <input
                    type="number"
                    name="cost-to-manufacture"
                    id="cost-to-manufacture"
                    className={` block pl-6 mt-2 md:mt-0 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm ${roboto.className}`}
                    defaultValue="0"
                  />
                </div>
              </div>
              <div className="lg:grid grid-cols-4 items-center mt-3 lg:mt-2">
                <label
                  htmlFor="top-sell-price"
                  className="text-amber-700 uppercase font-semibold col-span-2 text-right mr-3"
                >
                  Top Sell Price:
                </label>
                <div className="relative col-span-2">
                  <span className="absolute pl-3 text-sm mt-[4.5px]">$</span>
                  <input
                    type="number"
                    name="top-sell-price"
                    id="top-sell-price"
                    className={` block pl-6 mt-2 md:mt-0 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm ${roboto.className}`}
                    defaultValue="0"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="lg:grid grid-cols-2 gap-x-8">
              <div className="text-gray-400 text-sm border-2 border-gray-300 text-center rounded rounded-md h-40 p-5"></div>
              <div className="border-2 border-gray-300 p-2  mt-3 lg:mt-0">
                <div className="grid grid-cols-5">
                  <div className="col-span-3 text-xs text-gray-600">
                    File Name
                  </div>
                  <div className="col-span-2 text-xs text-gray-600">
                    File Type
                  </div>
                  <div className="col-span-3 text-sm font-light text-gray-400 mt-2">
                    No Media Previews
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            className="uppercase inline-flex w-full justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 sm:ml-3 sm:w-auto"
          >
            Save
          </button>
          <button
            type="button"
            className="uppercase mt-3 sm:mt-0 inline-flex w-full justify-center rounded-md bg-blue-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto"
            onClick={handleOpenEdit}
          >
            Edit
          </button>
          <button
            type="button"
            className="uppercase mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={onClose}
            ref={closeButtonRef}
            tabIndex={-1}
          >
            Close
          </button>
        </div>
      </form>
    )
  }

  const machineSection = () => {
    return (
      <form>
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <h3 className="text-gray-800 font-semibold text-2xl">Details</h3>
          <div className="flex justify-between mt-3">
            <h4 className="text-gray-800 font-bold text-xl uppercase">
              Product Name
            </h4>
            <h4 className="text-green-600 font-semibold text-xl uppercase">
              {locationState}
            </h4>
          </div>
          <h6 className="text-gray-700 uppercase font-semibold mt-2">
            Factory:
            <span className="ml-2 text-gray-400">Pipe And Box</span>
          </h6>
          <h6 className="text-gray-700 uppercase font-semibold mt-1">
            Machine/Process:
            <span className="ml-2 text-gray-400">Wire Cage (MBK)</span>
          </h6>
          <h6 className="text-gray-800 font-semibold uppercase mt-4">
            Description:
          </h6>
          <p className="text-gray-800 mt-1">No description to show.</p>
          <div className="mt-6">
            <div className="text-gray-400 text-sm border-2 border-gray-300 text-center rounded rounded-md mt-2 h-40 p-5"></div>
            <div className="border-2 border-gray-300 p-2 h-20 mt-4">
              <div className="grid grid-cols-5">
                <div className="col-span-3 text-xs text-gray-600">
                  File Name
                </div>
                <div className="col-span-2 text-xs text-gray-600">
                  File Type
                </div>
                <div className="col-span-3 text-sm font-light text-gray-400 mt-2">
                  No Media Previews
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            className="uppercase inline-flex w-full justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 sm:ml-3 sm:w-auto"
          >
            Save
          </button>
          <button
            type="button"
            className="uppercase mt-3 sm:mt-0 inline-flex w-full justify-center rounded-md bg-blue-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto"
            onClick={handleOpenEdit}
          >
            Edit
          </button>
          <button
            type="button"
            className="uppercase mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={onClose}
            ref={closeButtonRef}
            tabIndex={-1}
          >
            Close
          </button>
        </div>
      </form>
    )
  }

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={closeButtonRef}
          onClose={() => {}}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className={`fixed inset-0 z-10 overflow-y-auto`}>
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel
                  className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full ${
                    typeState === "Part"
                      ? "max-w-md lg:max-w-3xl"
                      : "sm:max-w-lg"
                  }`}
                >
                  {typeState === "Machine" ? machineSection : partSection}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <EditModal
        isOpen={openEditModal}
        typeState={typeState}
        onClose={() => setOpenEditModal(false)}
      />
    </>
  )
}
export default DetailsModal
