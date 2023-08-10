import { Fragment, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Roboto } from "next/font/google"

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

interface NewModalProps {
  isOpen: boolean
  onClose: () => void
}

const NewModal = ({ isOpen, onClose }: NewModalProps) => {
  const cancelButtonRef = useRef(null)

  const machineSets = [
    ["Radial Press", "Variant", "Wire Cage (BMK)"],
    ["Blizard", "Tornado", "Perfect System"],
    ["Steel"],
    ["Fittings", "Misc"],
  ]

  const machineProcess = ["RP1225", "30 Ton", "MBK875"]

  const [selectedFactory, setSelectedFactory] = useState("Factory")
  const [selectedMachine, setSelectedMachine] = useState("Machine Class")
  const [selectedProcess, setSelectedProcess] = useState(machineProcess[0])
  const [machineSet, setMachineSet] = useState(machineSets[0])

  const closeModal = () => {
    onClose()
    setSelectedFactory("Factory")
    setMachineSet(machineSets[0])
    setSelectedMachine("Machine Class")
    setSelectedProcess(machineProcess[0])
  }

  // handle event when machine/process input is disabled or not
  const processInputState = () => {
    let value

    if (
      selectedMachine === "Radial Press" ||
      selectedMachine === "Variant" ||
      selectedMachine === "Wire Cage (BMK)"
    ) {
      value = false
    } else {
      value = true
    }

    return value
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg">
                <form>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <h3 className="text-gray-800 font-semibold text-2xl">
                      New Timer/Process
                    </h3>

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
                          setSelectedMachine("Machine Class")
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
                        value={selectedMachine}
                        onChange={(e) => {
                          setSelectedMachine(e.currentTarget.value)
                          {
                            e.currentTarget.value === "Variant"
                              ? setSelectedProcess(machineProcess[1])
                              : e.currentTarget.value === "Wire Cage (BMK)"
                              ? setSelectedProcess(machineProcess[2])
                              : setSelectedProcess(machineProcess[0])
                          }
                        }}
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
                    <div className="md:flex items-center mt-4">
                      <label
                        htmlFor="machine-process"
                        className="uppercase font-semibold text-gray-800 md:w-[20%]"
                      >
                        Machine Process
                      </label>
                      <select
                        id="machine-process"
                        name="machine-process"
                        className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
                        defaultValue="Machine"
                        disabled={processInputState()}
                      >
                        <option disabled>Machine</option>

                        <option>{selectedProcess}</option>
                      </select>
                    </div>
                    <div className="md:flex items-center mt-4">
                      <label
                        htmlFor="machine-part"
                        className="uppercase font-semibold text-gray-800 md:w-[20%]"
                      >
                        Machine Process
                      </label>
                      <select
                        id="machine-part"
                        name="machine-part"
                        className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
                        defaultValue=""
                        disabled={processInputState()}
                      >
                        <option disabled></option>
                        <option>AR36X8XCL5</option>
                        <option>AR36X8XCL4</option>
                        <option>AR36X8XCL3</option>
                      </select>
                    </div>
                    <h6 className="uppercase font-semibold text-gray-400 mt-4">
                      Timer/Auto Details:
                    </h6>
                    <div className="mt-4 grid md:grid-cols-2 gap-x-8 gap-y-4 md:gap-y-0">
                      <div>
                        <label
                          htmlFor="average-cycle"
                          className="uppercase font-semibold text-gray-800"
                        >
                          Average Time Per Cycle
                        </label>
                        <input
                          type="number"
                          name="average-cycle"
                          id="average-cycle"
                          className={`mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="weight"
                          className="uppercase font-semibold text-gray-800"
                        >
                          Weight In Tons
                        </label>
                        <input
                          type="number"
                          name="weight"
                          id="weight"
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
                      Add
                    </button>
                    <button
                      type="button"
                      className="uppercase mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={closeModal}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
export default NewModal
