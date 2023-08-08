import { Fragment, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Roboto } from "next/font/google"

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

interface EditModalProps {
  isOpen: boolean
  typeState: string
  onClose: () => void
}

const EditModal = ({ isOpen, typeState, onClose }: EditModalProps) => {
  const cancelButtonRef = useRef(null)

  const machineSets = [
    ["Radial Press", "Variant", "Wire Cage (BMK)"],
    ["Blizard", "Tornado", "Perfect System"],
    ["Steel"],
    ["Fittings", "Misc"],
  ]

  const [selectedFactory, setSelectedFactory] = useState("Factory")
  const [machineSet, setMachineSet] = useState(machineSets[0])

  const partForm = () => {
    return (
      <form>
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <h3 className="text-gray-800 font-semibold text-2xl">Edit Part</h3>
          <div className="md:flex items-center mt-4">
            <label
              htmlFor="name-id"
              className="uppercase font-semibold text-gray-800 md:w-[20%]"
            >
              Name ID
            </label>
            <input
              type="text"
              name="name-id"
              id="name-id"
              className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
              placeholder="Part"
            />
          </div>
          <div className="md:flex items-center mt-4">
            <label
              htmlFor="factory"
              className="uppercase font-semibold text-gray-800 md:w-[20%]"
            >
              Factory
            </label>
            <select
              id="factory"
              name="factory"
              className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
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
          </div>
          <div className="md:flex items-center mt-4">
            <label
              htmlFor="machine-class"
              className="uppercase font-semibold text-gray-800 md:w-[20%]"
            >
              Machine Class
            </label>
            <select
              id="machine-class"
              name="machine-class"
              className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
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
          <h6 className="uppercase font-semibold text-gray-400 mt-4">
            New Part Details:
          </h6>
          <div className="md:flex mt-4 md:space-x-8">
            <div className="md:w-2/4">
              <label
                htmlFor="weight"
                className="uppercase font-semibold text-gray-800"
              >
                Weight In LBS
              </label>
              <input
                type="number"
                name="weight"
                id="weight"
                className={`mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
                placeholder="Pounds"
              />
            </div>
            <div className="md:w-2/4 mt-4 md:mt-0">
              <label
                htmlFor="time"
                className="uppercase font-semibold text-gray-800"
              >
                Time In Seconds
              </label>
              <input
                type="number"
                name="time"
                id="time"
                className={`mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
                placeholder="Avg Time"
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="file-upload"
              className="uppercase font-semibold text-gray-800"
            >
              Assign Photos And Video Previews
            </label>
            <div className="text-gray-400 text-sm border-2 border-gray-300 border-dashed text-center p-5 rounded rounded-md mt-2">
              Drop files here or click to upload.
            </div>
            <p className="text-xs mt-1 text-gray-600">
              photos will be resized under 1mb and videos compressed to 1min at
              720p
            </p>
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
          <div className="mt-4 grid md:grid-cols-3 gap-x-8 gap-y-4 md:gap-y-0">
            <div>
              <label
                htmlFor="finish-good-weight"
                className="uppercase font-semibold text-gray-800"
              >
                Finish Good Weight
              </label>
              <input
                type="number"
                name="finish-good-weight"
                id="finish-good-weight"
                className={`mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
              />
            </div>
            <div>
              <label
                htmlFor="cage-weight-scrap"
                className="uppercase font-semibold text-gray-800"
              >
                Cage Weight Scrap
              </label>
              <input
                type="number"
                name="cage-weight-scrap"
                id="cage-weight-scrap"
                className={`mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
              />
            </div>
            <div>
              <label
                htmlFor="cage-weight-actuals"
                className="uppercase font-semibold text-gray-800"
              >
                Cage Weight Actuals
              </label>
              <input
                type="number"
                name="cage-weight-actuals"
                id="cage-weight-actuals"
                className={`mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
              />
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
            className="uppercase mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={onClose}
            ref={cancelButtonRef}
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }

  const machineForm = () => {
    return (
      <form>
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <h3 className="text-gray-800 font-semibold text-2xl">Edit Machine</h3>
          <div className="md:flex items-center mt-4">
            <label
              htmlFor="name-id"
              className="uppercase font-semibold text-gray-800 md:w-[20%]"
            >
              Name ID
            </label>
            <input
              type="text"
              name="name-id"
              id="name-id"
              className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
              placeholder="Machine"
            />
          </div>
          <div className="md:flex items-center mt-4">
            <label
              htmlFor="factory"
              className="uppercase font-semibold text-gray-800 md:w-[20%]"
            >
              Factory
            </label>
            <select
              id="factory"
              name="factory"
              className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
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
          </div>
          <div className="md:flex items-center mt-4">
            <label
              htmlFor="machine-class"
              className="uppercase font-semibold text-gray-800 md:w-[20%]"
            >
              Machine Class
            </label>
            <select
              id="machine-class"
              name="machine-class"
              className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
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
          <h6 className="uppercase font-semibold text-gray-400 mt-4">
            Machine/Process Details:
          </h6>
          <div className="mt-4">
            <label
              htmlFor="description"
              className="uppercase font-semibold text-gray-800"
            >
              Machine Or Process Description
            </label>
            <div className="mt-2">
              <textarea
                rows={3}
                name="description"
                id="description"
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6 ${roboto.className}`}
                placeholder="Details"
                defaultValue={""}
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="file-upload"
              className="uppercase font-semibold text-gray-800"
            >
              Assign Photos And Video Previews
            </label>
            <div className="text-gray-400 text-sm border-2 border-gray-300 border-dashed text-center p-5 rounded rounded-md mt-2">
              Drop files here or click to upload.
            </div>
            <p className="text-xs mt-1 text-gray-600">
              photos will be resized under 1mb and videos compressed to 1min at
              720p
            </p>
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
            className="uppercase mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={onClose}
            ref={cancelButtonRef}
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                {typeState === "Machine" ? machineForm : partForm}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
export default EditModal
