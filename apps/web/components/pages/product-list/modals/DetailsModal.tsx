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

  const machineSets = [
    ["Radial Press", "Variant", "Wire Cage (BMK)"],
    ["Blizzard", "Tornado", "Perfect System"],
    ["Steel"],
    ["Fittings", "Misc"],
  ]

  const [selectedFactory, setSelectedFactory] = useState("Factory")
  const [machineSet, setMachineSet] = useState(machineSets[0])

  const partSection = () => {
    return (
      <form>
        <div className="bg-white">
          <div className="flex justify-between border-b border-gray-300 px-4 md:px-6 py-3">
            <h3 className="text-gray-800 font-semibold text-2xl">Details</h3>
            <h4 className="text-green-600 font-semibold text-2xl uppercase">
              {locationState}
            </h4>
          </div>
          <div className="flex justify-between items-center px-4 md:px-6 py-1 mt-3">
            <input
              type="text"
              className="text-gray-800 pl-0 font-bold text-xl uppercase py-1 mt-1 mb-1 rounded-md border-0 focus:ring-1 focus:ring-blue-950 focus:pl-3 cursor-pointer focus:cursor-text"
              defaultValue={"Product Name"}
            />
            <button className="uppercase bg-blue-950 hover:bg-blue-900 text-white text-sm py-1 px-4 rounded-md">
              Logs
            </button>
          </div>
          <div className="px-4 md:px-6">
            <div className="lg:flex justify-between">
              <div className="">
                <div className="grid grid-cols-4 items-center gap-y-2">
                  <label
                    htmlFor="factory"
                    className="text-gray-700 uppercase font-semibold mr-3 text-sm whitespace-nowrap col-span-2"
                  >
                    Factory:
                  </label>
                  <select
                    id="factory"
                    name="factory"
                    className={`block uppercase col-span-2 md:mt-0 w-full text-sm rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-700 font-medium ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:leading-6 ${roboto.className}`}
                    value={selectedFactory}
                    onChange={(e) => {
                      setSelectedFactory(e.currentTarget.value)

                      {
                        e.currentTarget.value === "Precast"
                          ? setMachineSet(machineSets[1])
                          : e.currentTarget.value === "Steel"
                          ? setMachineSet(machineSets[2])
                          : e.currentTarget.value === "Exterior"
                          ? setMachineSet(machineSets[3])
                          : setMachineSet(machineSets[0])
                      }
                    }}
                  >
                    <option disabled>Factory</option>
                    <option>Pipe And Box</option>
                    <option>Precast</option>
                    <option>Steel</option>
                    <option>Exterior</option>
                  </select>
                  <label
                    htmlFor="machine-class"
                    className="text-gray-700 uppercase font-semibold mr-3 text-sm whitespace-nowrap col-span-2"
                  >
                    Machine/Process:
                  </label>
                  <select
                    id="machine-class"
                    name="machine-class"
                    className={`block uppercase col-span-2 w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-700 font-medium ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 text-sm sm:leading-6 ${roboto.className}`}
                    defaultValue="Machine Class"
                    disabled={selectedFactory === "Factory"}
                  >
                    <option disabled>Machine Class</option>
                    {machineSet.map((machine) => {
                      return (
                        <option key={machine} value={machine}>
                          {machine}
                        </option>
                      )
                    })}
                  </select>
                  <label
                    htmlFor="weight"
                    className="text-gray-700 uppercase font-semibold mr-3 whitespace-nowrap text-sm col-span-2"
                  >
                    Weight In Pound:
                  </label>
                  <input
                    type="number"
                    name="weight"
                    id="weight"
                    className={`col-span-2 block w-full rounded-md border-0 py-1.5 text-gray-700 font-medium shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm ${roboto.className}`}
                    defaultValue="0"
                  />
                  <label
                    htmlFor="good-weight"
                    className="text-gray-700 uppercase font-semibold mr-3 whitespace-nowrap text-sm col-span-2"
                  >
                    Finish Good Weight:
                  </label>
                  <input
                    type="number"
                    name="good-weight"
                    id="good-weight"
                    className={`col-span-2 block w-full rounded-md border-0 py-1.5 text-gray-700 font-medium shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm ${roboto.className}`}
                    defaultValue="0"
                  />
                  <label
                    htmlFor="weight-scrap"
                    className="text-gray-700 uppercase font-semibold mr-3 whitespace-nowrap text-sm col-span-2"
                  >
                    Cage Weight Scrap:
                  </label>
                  <input
                    type="number"
                    name="weight-scrap"
                    id="weight-scrap"
                    className={`col-span-2 block w-full rounded-md border-0 py-1.5 text-gray-700 font-medium shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm ${roboto.className}`}
                    defaultValue="0"
                  />
                  <label
                    htmlFor="weight-actual"
                    className="text-gray-700 uppercase font-semibold mr-3 whitespace-nowrap text-sm col-span-2"
                  >
                    Cage Weight Actual:
                  </label>
                  <input
                    type="number"
                    name="weight-actual"
                    id="weight-actual"
                    className={`col-span-2 block w-full rounded-md border-0 py-1.5 text-gray-700 font-medium shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm ${roboto.className}`}
                    defaultValue="0"
                  />
                  <label
                    htmlFor="inventory"
                    className="text-amber-700 uppercase font-semibold mr-3 whitespace-nowrap text-sm col-span-2"
                  >
                    In Inventory:
                  </label>
                  <input
                    type="number"
                    name="inventory"
                    id="inventory"
                    className={`col-span-2 block w-full rounded-md border-0 py-1.5 text-gray-700 font-medium shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm ${roboto.className}`}
                    defaultValue="0"
                  />
                  <label
                    htmlFor="cost-to-manufacture"
                    className="text-gray-700 uppercase text-sm font-semibold whitespace-nowrap mr-3 col-span-2"
                  >
                    Cost To Manufacture:
                  </label>
                  <div className="relative w-full col-span-2">
                    <span className="absolute pl-3 text-sm mt-[4.5px]">$</span>
                    <input
                      type="number"
                      name="cost-to-manufacture"
                      id="cost-to-manufacture"
                      className={` block pl-6 mt-2 md:mt-0 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm ${roboto.className}`}
                      defaultValue="0"
                    />
                  </div>
                  <label
                    htmlFor="top-sell-price"
                    className="text-gray-700 uppercase text-sm font-semibold whitespace-nowrap mr-3 col-span-2"
                  >
                    Top Sell Price:
                  </label>
                  <div className="relative w-full col-span-2">
                    <span className="absolute pl-3 text-sm mt-[4.5px]">$</span>
                    <input
                      type="number"
                      name="top-sell-price"
                      id="top-sell-price"
                      className={` block pl-6 mt-2 md:mt-0 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm ${roboto.className}`}
                      defaultValue="0"
                    />
                  </div>
                  <label
                    htmlFor="average-time"
                    className="text-gray-700 uppercase font-semibold mr-3 whitespace-nowrap text-sm col-span-2"
                  >
                    Average Time Per Cycle:
                  </label>
                  <input
                    type="number"
                    name="average-time"
                    id="average-time"
                    className={`col-span-2 block w-full rounded-md border-0 py-1.5 text-gray-700 font-medium shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 disabled:opacity-70 text-sm ${roboto.className}`}
                    defaultValue="0"
                    disabled
                  />
                </div>
              </div>
              <div className="w-[400px]">
                <div className="w-full">
                  <div className="text-gray-400 text-sm border-2 border-gray-300 text-center rounded rounded-md h-52 p-5"></div>
                  <div className="border-2 border-gray-300 p-2 mt-2 h-28 rounded-md">
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
                  <button className="uppercase float-right mt-2 bg-blue-800 hover:bg-blue-700 text-white text-sm py-1 px-4 rounded-md">
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 mt-7 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="uppercase inline-flex w-full justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 sm:ml-3 sm:w-auto"
            >
              Save
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
        </div>
      </form>
    )
  }

  const machineSection = () => {
    return (
      <form>
        <div className="bg-white">
          <div className="flex justify-between border-b border-gray-300 px-4 md:px-6 py-3">
            <h3 className="text-gray-800 font-semibold text-2xl">Details</h3>
            <h4 className="text-green-600 font-semibold text-2xl uppercase">
              {locationState}
            </h4>
          </div>
          <div className="flex justify-between items-center px-4 md:px-6 py-1 mt-3">
            <input
              type="text"
              className="text-gray-800 pl-0 font-bold text-xl uppercase py-1 mt-1 mb-1 rounded-md border-0 focus:ring-1 focus:ring-blue-950 focus:pl-3 cursor-pointer focus:cursor-text"
              defaultValue={"Product Name"}
            />
            <button className="uppercase bg-blue-950 hover:bg-blue-900 text-white text-sm py-1 px-4 rounded-md">
              Logs
            </button>
          </div>
          <div className="px-4 md:px-6">
            <div className="lg:flex justify-between">
              <div className="w-[350px]">
                <div className="grid grid-cols-4 items-center gap-y-2">
                  <label
                    htmlFor="factory"
                    className="text-gray-700 uppercase font-semibold mr-3 text-sm whitespace-nowrap col-span-2"
                  >
                    Factory:
                  </label>
                  <select
                    id="factory"
                    name="factory"
                    className={`block uppercase col-span-2 md:mt-0 w-full text-sm rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-700 font-medium ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:leading-6 ${roboto.className}`}
                    value={selectedFactory}
                    onChange={(e) => {
                      setSelectedFactory(e.currentTarget.value)

                      {
                        e.currentTarget.value === "Precast"
                          ? setMachineSet(machineSets[1])
                          : e.currentTarget.value === "Steel"
                          ? setMachineSet(machineSets[2])
                          : e.currentTarget.value === "Exterior"
                          ? setMachineSet(machineSets[3])
                          : setMachineSet(machineSets[0])
                      }
                    }}
                  >
                    <option disabled>Factory</option>
                    <option>Pipe And Box</option>
                    <option>Precast</option>
                    <option>Steel</option>
                    <option>Exterior</option>
                  </select>
                  <label
                    htmlFor="machine-class"
                    className="text-gray-700 uppercase font-semibold mr-3 text-sm whitespace-nowrap col-span-2"
                  >
                    Machine Class:
                  </label>
                  <select
                    id="machine-class"
                    name="machine-class"
                    className={`block uppercase col-span-2 md:mt-0 w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-700 font-medium ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 text-sm sm:leading-6 ${roboto.className}`}
                    defaultValue="Machine Class"
                    disabled={selectedFactory === "Factory"}
                  >
                    <option disabled>Machine Class</option>
                    {machineSet.map((machine) => {
                      return (
                        <option key={machine} value={machine}>
                          {machine}
                        </option>
                      )
                    })}
                  </select>
                </div>
                <div className="mt-2.5">
                  <label
                    htmlFor="description"
                    className="text-gray-700 uppercase font-semibold  text-sm"
                  >
                    Description
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      rows={8}
                      name="Description"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
              <div className="w-[400px]">
                <div className="w-full">
                  <div className="text-gray-400 text-sm border-2 border-gray-300 text-center rounded rounded-md h-52 p-5"></div>
                  <div className="border-2 border-gray-300 p-2 mt-2 h-28">
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
                  <button className="uppercase float-right mt-2 bg-blue-800 hover:bg-blue-700 text-white text-sm py-1 px-4 rounded-md">
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 mt-7 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="uppercase inline-flex w-full justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 sm:ml-3 sm:w-auto"
            >
              Save
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
                  className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 max-w-2xl lg:max-w-4xl sm:w-full sm:max-w-lg
                    
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
