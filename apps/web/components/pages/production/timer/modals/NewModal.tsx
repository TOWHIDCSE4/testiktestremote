import { Fragment, useEffect, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import useFactories from "../../../../../hooks/factories/useFactories"
import {
  T_BackendResponse,
  T_Factory,
  T_Machine,
  T_MachineClass,
  T_Part,
  T_Timer,
} from "custom-validator"
import useFactoryMachineClasses from "../../../../../hooks/factories/useFactoryMachineClasses"
import { useForm } from "react-hook-form"
import useGetMachinesByMachineClassLocation from "../../../../../hooks/machines/useGetMachinesByLocation"
import useGetPartByMachineClassLocation from "../../../../../hooks/parts/useGetPartByMachineClassLocation"
import usePart from "../../../../../hooks/parts/useGetPart"
import toast from "react-hot-toast"
import useAddTimer from "../../../../../hooks/timers/useAddTimer"
import useProfile from "../../../../../hooks/users/useProfile"
import { useQueryClient } from "@tanstack/react-query"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { Combobox } from "@headlessui/react"

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
  const queryClient = useQueryClient()
  const cancelButtonRef = useRef(null)
  const { data: userProfile, isLoading: isProfileLoading } = useProfile()
  const [selectedMachine, setSelectedMachine] = useState<T_Machine | null>(null)
  const [partQuery, setPartQuery] = useState("")
  const [selectedPart, setSelectedPart] = useState({
    id: "",
    name: "",
  })
  const { data: machines, isLoading: isMachinesLoading } =
    useGetMachinesByMachineClassLocation(locationId as string)
  const {
    data: parts,
    isLoading: isPartsLoading,
    setSelectedMachineClassId,
    setSelectedLocationId,
  } = useGetPartByMachineClassLocation()
  const { data: specificPart, isLoading: isSpecificPartLoading } = usePart(
    selectedPart.id
  )

  const { register, handleSubmit, reset, setValue } = useForm<T_Timer>()
  const { mutate, isLoading: isMutateLoading } = useAddTimer()

  const onSubmit = (data: T_Timer) => {
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          queryClient.invalidateQueries({
            queryKey: ["timers-location"],
          })
          toast.success(String(data.message))
          closeModal()
          reset()
          setPartQuery("")
          setSelectedPart({
            id: "",
            name: "",
          })
        } else {
          toast.error(String(data.message))
        }
      },
      onError: (err: any) => {
        toast.error(String(err))
      },
    }
    mutate(
      {
        ...data,
        locationId: locationId ? locationId : "",
        createdBy: userProfile?.item._id as string,
        machineClassId: selectedMachine?.machineClassId as string,
        factoryId: selectedMachine?.factoryId as string,
      },
      callBackReq
    )
  }

  const closeModal = () => {
    onClose()
  }

  const filteredParts =
    partQuery === ""
      ? parts?.items?.slice(0, 30) || []
      : parts?.items
          ?.filter((timer) => {
            return timer.name.toLowerCase().includes(partQuery.toLowerCase())
          })
          ?.slice(0, 30) || []

  useEffect(() => {
    if (selectedPart.id) {
      setValue("partId", selectedPart.id)
    }
  }, [selectedPart])

  useEffect(() => {
    if (selectedMachine) {
      setSelectedLocationId(locationId as string)
      setSelectedMachineClassId(selectedMachine.machineClassId as string)
    }
  }, [selectedMachine])

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50" />
        </Transition.Child>

        <div className={`fixed inset-0 overflow-y-auto z-50`}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-[34rem]">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex items-center bg-[#b28c56] text-white uppercase rounded-t-lg justify-between h-28 m-[0.2rem] p-8 border-dark-blue border-b-8">
                    <h3 className="text-lg tracking-wider">
                      New Timer/Process
                    </h3>
                    <h2 className="font-bold text-7xl font-BebasNeueBold tracking-widest mt-2">
                      {locationState}
                    </h2>
                  </div>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b-4">
                    <div className="md:flex items-center">
                      <label
                        htmlFor="machine-process"
                        className="uppercase font-semibold text-lg text-gray-800 md:w-[35%] text-right mr-3"
                      >
                        Machine / Process
                      </label>
                      <select
                        id="machine-process"
                        {...register("machineId")}
                        className={`block mt-2 md:mt-0 w-full md:w-[60%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                        defaultValue="Select Machine"
                        disabled={isMutateLoading || isMachinesLoading}
                        onChange={(event) => {
                          const machine = machines?.items.find((item) => {
                            return item._id === event.target.value
                          })
                          setSelectedMachine(machine as T_Machine)
                        }}
                      >
                        <option disabled>Select Machine</option>
                        {machines?.items?.map(
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
                        className="uppercase font-semibold text-lg text-gray-800 md:w-[35%] text-right mr-3"
                      >
                        Part
                      </label>
                      <div className="block md:w-[60%] w-full">
                        <Combobox
                          as="div"
                          value={selectedPart}
                          onChange={setSelectedPart}
                        >
                          <div className="relative w-full">
                            <Combobox.Input
                              className={`w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6 ${
                                isMutateLoading
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              } ${
                                filteredParts?.length === 0 &&
                                "opacity-70 cursor-not-allowed"
                              }`}
                              displayValue={(selected: {
                                id: string
                                name: string
                              }) => {
                                return selected ? selected.name : ""
                              }}
                              required
                              onChange={(event) =>
                                setPartQuery(event.target.value)
                              }
                              placeholder="Search Part"
                              autoComplete="off"
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                              <ChevronUpDownIcon
                                className={`h-5 w-5 ${
                                  filteredParts?.length === 0
                                    ? "text-gray-300"
                                    : "text-gray-500"
                                }`}
                                aria-hidden="true"
                              />
                            </Combobox.Button>

                            {filteredParts && filteredParts.length > 0 ? (
                              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredParts.map(
                                  (item: T_Part, index: number) => (
                                    <Combobox.Option
                                      key={index}
                                      value={{ id: item._id, name: item.name }}
                                      className={`relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-blue-600 hover:text-white`}
                                    >
                                      <span className="block">{item.name}</span>
                                    </Combobox.Option>
                                  )
                                )}
                              </Combobox.Options>
                            ) : null}
                          </div>
                        </Combobox>
                      </div>
                    </div>
                    <div className="md:flex items-center mt-3">
                      <label
                        htmlFor="drawingNumber"
                        className="uppercase font-semibold text-lg text-gray-800 md:w-[35%] text-right mr-3"
                      >
                        Night Shift
                      </label>
                      <select
                        id="nightShift"
                        className={`block mt-2 md:mt-0 w-full md:w-[60%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                        defaultValue="false"
                        required
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                    <div className="flex w-full">
                      <h6 className="uppercase font-semibold text-gray-400 mt-4 ml-5 w-5/12 text-xl mr-3">
                        Timer/Auto Details
                      </h6>
                      <div className="border-gray-400 border-b-4 w-1/2 h-8"></div>
                    </div>
                    <div className="md:flex mt-4 px-10 justify-around grid md:grid-cols-2 gap-x-8 gap-y-4 md:gap-y-0 text-center">
                      <div>
                        <label
                          htmlFor="average-cycle"
                          className="uppercase font-semibold text-gray-800 text-sm"
                        >
                          Average Time Per Cycle
                        </label>
                        <input
                          type="number"
                          name="average-cycle"
                          id="average-cycle"
                          className={`mt-2 block w-full rounded-md border-0 py-[0.1em] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-xs sm:leading-6 disabled:opacity-70 cursor-not-allowed`}
                          disabled
                          value={
                            !isSpecificPartLoading ? specificPart.item.time : ""
                          }
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="weight"
                          className="uppercase font-semibold text-gray-800 text-sm"
                        >
                          Weight In Tons
                        </label>
                        <input
                          type="number"
                          name="weight"
                          id="weight"
                          className={`mt-2 block w-full rounded-md border-0 py-[0.1em] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-xs sm:leading-6 disabled:opacity-70 cursor-not-allowed`}
                          disabled
                          value={
                            !isSpecificPartLoading && specificPart.item.tons
                              ? specificPart.item.tons.toFixed(3)
                              : ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      className="uppercase inline-flex w-full h-6 items-center justify-center rounded-md bg-red-700 px-9 text-sm font-semibold text-white shadow-sm hover:bg-red-600 sm:ml-3  disabled:opacity-70 sm:w-auto"
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
                        "Add"
                      )}
                    </button>
                    <button
                      type="button"
                      className="uppercase inline-flex w-full h-6 items-center justify-center rounded-md bg-gray-400 px-6 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-300 sm:mt-0 sm:w-auto disabled:opacity-70"
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
export default NewModal
