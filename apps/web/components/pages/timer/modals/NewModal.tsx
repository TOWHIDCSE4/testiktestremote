import { Fragment, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Roboto } from "next/font/google"
import useFactories from "../../../../hooks/factories/useFactories"
import {
  T_BackendResponse,
  T_Factory,
  T_Machine,
  T_MachineClass,
  T_Part,
  T_Timer,
} from "custom-validator"
import useFactoryMachineClasses from "../../../../hooks/factories/useFactoryMachineClasses"
import { useForm } from "react-hook-form"
import useGetMachineByClass from "../../../../hooks/machines/useGetMachinesByClass"
import useGetPartByMachineClass from "../../../../hooks/parts/useGetPartByMachineClass"
import usePart from "../../../../hooks/parts/useGetPart"
import toast from "react-hot-toast"
import useAddTimer from "../../../../hooks/timers/useAddTimer"

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

interface NewModalProps {
  isOpen: boolean
  locationState: string | null
  locationId: string | null
  onClose: () => void
}

const NewModal = ({
  isOpen,
  locationState,
  locationId,
  onClose,
}: NewModalProps) => {
  const cancelButtonRef = useRef(null)

  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  const [selectedFactory, setSelectedFactory] = useState("")
  const [selectedMachineClass, setSelectedMachineClass] = useState("")
  const [activePart, setActivePart] = useState("")
  const {
    data: machineClasses,
    isLoading: isMachineClassesLoading,
    isRefetching: isMachineClassesRefetching,
    setSelectedFactoryId,
  } = useFactoryMachineClasses()
  const {
    data: machines,
    isLoading: isMachinesLoading,
    isRefetching: isMachinesRefetching,
    setSelectedMachineClassId: setMachineSelect,
  } = useGetMachineByClass()
  const {
    data: parts,
    isLoading: isPartsLoading,
    isRefetching: isPartsRefetching,
    setSelectedMachineClassId: setPartSelect,
  } = useGetPartByMachineClass()
  const { data: specificPart, isLoading: isSpecificPartLoading } =
    usePart(activePart)

  const { register, handleSubmit, setValue, reset } = useForm<T_Timer>()
  const { mutate, isLoading: isMutateLoading } = useAddTimer()

  const onSubmit = (data: T_Timer) => {
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          toast.success(data.message)
          closeModal()
        } else {
          toast.error(String(data.message))
        }
      },
      onError: (err: any) => {
        toast.error(String(err))
      },
    }
    mutate({ ...data, locationId: locationId ? locationId : "" }, callBackReq)
  }

  const closeModal = () => {
    onClose()
    setSelectedFactory("")
    setSelectedMachineClass("")
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
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <h3 className="text-gray-800 font-semibold text-2xl">
                      {locationState} &gt; New Timer/Process
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
                        {...register("factoryId")}
                        className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
                        disabled={isFactoriesLoading}
                        defaultValue={""}
                        onChange={(e) => {
                          setSelectedFactory(e.target.value)
                          setSelectedFactoryId(e.target.value)
                        }}
                      >
                        <option disabled value="">
                          Select Factory
                        </option>
                        {factories?.items.map(
                          (item: T_Factory, index: number) => {
                            return (
                              <option key={index} value={item._id as string}>
                                {item.name}
                              </option>
                            )
                          }
                        )}
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
                        className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
                        defaultValue={""}
                        disabled={selectedFactory === ""}
                        onChange={(e) => {
                          setSelectedMachineClass(e.target.value)
                          setMachineSelect(e.target.value)
                          setPartSelect(e.target.value)
                        }}
                      >
                        <option disabled value="">
                          Select Machine Class
                        </option>
                        {machineClasses?.items.map(
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
                    <div className="md:flex items-center mt-4">
                      <label
                        htmlFor="machine-process"
                        className="uppercase font-semibold text-gray-800 md:w-[20%]"
                      >
                        Machine / Process
                      </label>
                      <select
                        id="machine-process"
                        {...register("machineId")}
                        className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
                        defaultValue="Machine"
                        disabled={selectedMachineClass === ""}
                      >
                        <option disabled>Machine</option>
                        {machines?.items.map(
                          (item: T_Machine, index: number) => {
                            return (
                              <option key={index} value={item._id as string}>
                                {item.name}
                              </option>
                            )
                          }
                        )}
                      </select>
                    </div>
                    <div className="md:flex items-center mt-4">
                      <label
                        htmlFor="machine-part"
                        className="uppercase font-semibold text-gray-800 md:w-[20%]"
                      >
                        Part
                      </label>
                      <select
                        id="machine-part"
                        {...register("partId")}
                        className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className}`}
                        defaultValue=""
                        disabled={selectedMachineClass === ""}
                        onChange={(e) => setActivePart(e.currentTarget.value)}
                      >
                        <option disabled></option>
                        {parts?.items.map((part: T_Part, index: number) => {
                          return (
                            <option key={index} value={part._id as string}>
                              {part.name}
                            </option>
                          )
                        })}
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
                          disabled
                          value={
                            !isSpecificPartLoading ? specificPart.item.time : ""
                          }
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
                          disabled
                          value={
                            !isSpecificPartLoading
                              ? specificPart.item.pounds
                              : ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      className="uppercase inline-flex w-full justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 sm:ml-3 sm:w-auto"
                    >
                      {isMutateLoading ? (
                        <div
                          className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full"
                          role="status"
                          aria-label="loading"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        "Add"
                      )}
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
