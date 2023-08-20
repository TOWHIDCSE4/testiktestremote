import { Fragment, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import {
  T_BackendResponse,
  T_Factory,
  T_Job,
  T_Machine,
  T_Part,
} from "custom-validator"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import useFactoryMachineClasses from "../../../../../hooks/factories/useFactoryMachineClasses"
import useGetMachineByClass from "../../../../../hooks/machines/useGetMachinesByClass"
import useGetPartByMachineClass from "../../../../../hooks/parts/useGetPartByMachineClass"
import usePart from "../../../../../hooks/parts/useGetPart"
import useAddTimer from "../../../../../hooks/timers/useAddTimer"
import useFactories from "../../../../../hooks/factories/useFactories"
import useLocations from "../../../../../hooks/locations/useLocations"

interface EditModalProps {
  isOpen: boolean

  currentTab: string
  onClose: () => void
}

const EditModal = ({ isOpen, currentTab, onClose }: EditModalProps) => {
  const cancelButtonRef = useRef(null)
  const { data: locations, isLoading: isLocationsLoading } = useLocations()
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  const [selectedFactory, setSelectedFactory] = useState("")
  const [selectedMachineClass, setSelectedMachineClass] = useState("")
  const [activePart, setActivePart] = useState("")
  const {
    data: machineClasses,
    isLoading: isMachineClassesLoading,
    setSelectedFactoryId,
  } = useFactoryMachineClasses()
  const {
    data: machines,
    isLoading: isMachinesLoading,
    setSelectedMachineClassId: setMachineSelect,
  } = useGetMachineByClass()
  const {
    data: parts,
    isLoading: isPartsLoading,
    setSelectedMachineClassId: setPartSelect,
  } = useGetPartByMachineClass()
  const { data: specificPart, isLoading: isSpecificPartLoading } =
    usePart(activePart)

  const { register, handleSubmit, reset, watch } = useForm<T_Job>()
  const { mutate, isLoading: isMutateLoading } = useAddTimer()

  const onSubmit = (data: T_Job) => {
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          toast.success(String(data.message))
          closeModal()
          reset()
        } else {
          toast.error(String(data.message))
        }
      },
      onError: (err: any) => {
        toast.error(String(err))
      },
    }
    // mutate({ ...data, locationId: locationId ? locationId : "" }, callBackReq)
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
                      Edit Job
                    </h3>

                    <div className="md:flex items-center mt-6">
                      <label
                        htmlFor="average-cycle"
                        className="uppercase font-semibold text-gray-800 md:w-36"
                      >
                        Job Name
                      </label>
                      <input
                        type="text"
                        id="average-cycle"
                        {...register("name", { required: true })}
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                        required
                        defaultValue="LANGDON UNITS 6-10"
                      />
                    </div>
                    <div className="md:flex items-center mt-3">
                      <label
                        htmlFor="machine-class"
                        className="uppercase font-semibold text-gray-800 md:w-36"
                      >
                        Location
                      </label>
                      <select
                        id="location"
                        disabled={isLocationsLoading}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                        required
                        {...register("locationId", { required: true })}
                        defaultValue="Seguin"
                      >
                        <option className="uppercase" value="">
                          Select Location
                        </option>
                        {locations?.items.map((key, index) => (
                          <option
                            className="uppercase"
                            key={index}
                            value={key._id}
                          >
                            {key.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:flex items-center mt-3">
                      <label
                        htmlFor="userId"
                        className="uppercase font-semibold text-gray-800 md:w-36"
                      >
                        User
                      </label>
                      <select
                        id="user"
                        {...register("userId")}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                        defaultValue="Select User"
                        required
                      >
                        <option disabled>Select User</option>
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
                    <div className="md:flex items-center mt-3">
                      <label
                        htmlFor="factory"
                        className="uppercase font-semibold text-gray-800 md:w-36"
                      >
                        Factory
                      </label>
                      <select
                        disabled={isFactoriesLoading}
                        id="factory"
                        required
                        {...register("factoryId", { required: true })}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                      >
                        <option value="">Select Factory</option>
                        {factories?.items?.map(
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
                    <div className="md:flex items-center mt-3">
                      <label
                        htmlFor="machine-part"
                        className="uppercase font-semibold text-gray-800 md:w-36"
                      >
                        Part
                      </label>
                      <select
                        id="machine-part"
                        required
                        {...register("partId")}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                        defaultValue="Select Part"
                        disabled={
                          selectedMachineClass === "" ||
                          isMutateLoading ||
                          isPartsLoading
                        }
                        onChange={(e) => setActivePart(e.currentTarget.value)}
                      >
                        <option disabled>Select Part</option>
                        {parts?.items.map((part: T_Part, index: number) => {
                          return (
                            <option key={index} value={part._id as string}>
                              {part.name}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                    <div className="md:flex items-center mt-3">
                      <label
                        htmlFor="drawingNumber"
                        className="uppercase font-semibold text-gray-800 md:w-36"
                      >
                        Drawing Number
                      </label>
                      <input
                        type="text"
                        {...register("drawingNumber")}
                        id="drawingNumber"
                        required
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                        defaultValue="4'X2'X8' - W/ Ø24 OPENING TOP / 3'X2' REDUCER 0-2 4X2-3"
                      />
                    </div>
                    <div className="md:flex items-center mt-3">
                      <label
                        htmlFor="drawingNumber"
                        className="uppercase font-semibold text-gray-800 md:w-36"
                      >
                        Is Stock?
                      </label>
                      <select
                        id="isStock"
                        {...register("isStock", { required: true })}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                        defaultValue="No"
                        required
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                    {String(watch("isStock")) === "false" ||
                    !watch("isStock") ? (
                      <>
                        <div className="md:flex items-center mt-3">
                          <label
                            htmlFor="drawingNumber"
                            className="uppercase font-semibold text-gray-800 md:w-36"
                          >
                            Count
                          </label>
                          <input
                            type="number"
                            {...register("count", { required: true })}
                            id="drawingNumber"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                            required
                            defaultValue={0}
                          />
                        </div>
                        <div className="md:flex items-center mt-3">
                          <label
                            htmlFor="dueDate"
                            className="uppercase font-semibold text-gray-800 md:w-36"
                          >
                            Due Date
                          </label>
                          <input
                            type="date"
                            {...register("dueDate", { required: true })}
                            id="dueDate"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                            required
                          />
                        </div>
                        <div className="md:flex items-center mt-3">
                          <label
                            htmlFor="priorityStatus"
                            className="uppercase font-semibold text-gray-800 md:w-36"
                          >
                            Priority
                          </label>
                          <select
                            id="priorityStatus"
                            {...register("priorityStatus", { required: true })}
                            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                            defaultValue="High"
                            required
                          >
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                          </select>
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      className="sm:ml-3 uppercase flex items-center justify-center rounded-md bg-green-700 mt-4 w-full md:w-auto md:mt-0 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-900 disabled:opacity-70"
                    >
                      {isMutateLoading ? (
                        <div
                          className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2"
                          role="status"
                          aria-label="loading"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        "Update"
                      )}
                    </button>
                    <button
                      type="button"
                      className="uppercase mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-70"
                      onClick={() => {
                        closeModal()
                        reset()
                      }}
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
export default EditModal
