import { Fragment, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Roboto } from "next/font/google"
import useFactories from "../../../../hooks/factories/useFactories"
import { I_FACTORY } from "../../../../types/global"
import useFactoryMachineClasses from "../../../../hooks/factories/useFactoryMachineClasses"
import {
  T_BackendResponse,
  T_MachineClasses,
  T_Part,
  ZPart,
} from "custom-validator"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import useAddPart from "../../../../hooks/parts/useAddPart"

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

interface NewModalProps {
  isOpen: boolean
  locationState: string
  onClose: () => void
}

const NewPartModal = ({ isOpen, locationState, onClose }: NewModalProps) => {
  const cancelButtonRef = useRef(null)
  const { register, handleSubmit, setValue } = useForm<T_Part>()
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  const {
    data: machineClasses,
    isLoading: isMachineClassesLoading,
    isRefetching: isMachineClassesRefetching,
    setSelectedFactoryId,
  } = useFactoryMachineClasses()
  const { mutate, isLoading: isAddPartLoading } = useAddPart()

  const [selectedFactory, setSelectedFactory] = useState("")

  const onSubmit = (data: T_Part) => {
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          if (data.item) {
            toast.success("Part created successfully")
          }
        } else {
          toast.error(data.message as string)
        }
      },
      onError: (err: any) => {
        toast.error(String(err))
      },
    }
    mutate(data, callBackReq)
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
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <h3 className="text-gray-800 font-semibold text-2xl">
                      {`${locationState} > New Part`}
                    </h3>
                    <div className="md:flex items-center mt-6">
                      <label
                        htmlFor="nameId"
                        className="uppercase font-semibold text-gray-800 md:w-[20%]"
                      >
                        Name ID
                      </label>
                      <input
                        type="text"
                        id="nameId"
                        required
                        disabled={isAddPartLoading}
                        className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 ${roboto.className}`}
                        placeholder="Part"
                        {...register("name", { required: true })}
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
                        disabled={isFactoriesLoading || isAddPartLoading}
                        id="factory"
                        required
                        {...register("factoryId", { required: true })}
                        className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 ${roboto.className} disabled:opacity-70`}
                        onChange={(e) => {
                          setSelectedFactory(e.target.value)
                          setSelectedFactoryId(e.target.value)
                          setValue("machineClassId", "")
                        }}
                      >
                        <option value="">Select Factory</option>
                        {factories?.items.map(
                          (item: I_FACTORY, index: number) => {
                            return (
                              <option key={index} value={item._id}>
                                {item.name}
                              </option>
                            )
                          }
                        )}
                      </select>
                    </div>
                    <div className="md:flex items-center mt-4">
                      <label
                        htmlFor="machineClass"
                        className="uppercase font-semibold text-gray-800 md:w-[20%]"
                      >
                        Machine Class
                      </label>
                      <select
                        id="machineClass"
                        required
                        className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 ${roboto.className}`}
                        disabled={
                          selectedFactory === "" ||
                          isMachineClassesRefetching ||
                          isMachineClassesLoading ||
                          isAddPartLoading
                        }
                        defaultValue="Select Machine Class"
                        {...register("machineClassId", { required: true })}
                      >
                        <option value="">Select Machine Class</option>
                        {machineClasses?.items.map(
                          (machine: T_MachineClasses, index: number) => {
                            return (
                              <option key={index} value={machine._id}>
                                {machine.name}
                              </option>
                            )
                          }
                        )}
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
                          id="weight"
                          required
                          disabled={isAddPartLoading}
                          className={`mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 ${roboto.className}`}
                          placeholder="Pounds"
                          {...register("lbs", {
                            required: true,
                            valueAsNumber: true,
                          })}
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
                          id="time"
                          required
                          disabled={isAddPartLoading}
                          className={`mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 ${roboto.className}`}
                          placeholder="Avg Time"
                          {...register("time", {
                            required: true,
                            valueAsNumber: true,
                          })}
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
                      <div className="text-gray-400 text-sm border-2 border-gray-300 border-dashed text-center p-5 rounded mt-2">
                        Drop files here or click to upload.
                      </div>
                      <p className="text-xs mt-1 text-gray-600">
                        photos will be resized under 1mb and videos compressed
                        to 1min at 720p
                      </p>
                      <div className="border-2 border-gray-300 p-2 h-20 mt-4 rounded-md">
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
                          htmlFor="finishGoodWeight"
                          className="uppercase font-semibold text-gray-800"
                        >
                          Finish Good Weight
                        </label>
                        <input
                          type="number"
                          required
                          id="finishGoodWeight"
                          disabled={isAddPartLoading}
                          className={`mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 ${roboto.className}`}
                          {...register("finishGoodWeight", {
                            required: true,
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="cageWeightScrap"
                          className="uppercase font-semibold text-gray-800"
                        >
                          Cage Weight Scrap
                        </label>
                        <input
                          type="number"
                          required
                          id="cageWeightScrap"
                          disabled={isAddPartLoading}
                          className={`mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 ${roboto.className}`}
                          {...register("cageWeightScrap", {
                            required: true,
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="cageWeightActual"
                          className="uppercase font-semibold text-gray-800"
                        >
                          Cage Weight Actuals
                        </label>
                        <input
                          type="number"
                          required
                          id="cageWeightActual"
                          disabled={isAddPartLoading}
                          className={`mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 ${roboto.className}`}
                          {...register("cageWeightActual", {
                            required: true,
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      disabled={isAddPartLoading}
                      className="uppercase inline-flex w-full items-center justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 sm:ml-3  disabled:opacity-70 sm:w-auto"
                    >
                      {isAddPartLoading ? (
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
                      className="uppercase mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-70"
                      disabled={isAddPartLoading}
                      onClick={onClose}
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
export default NewPartModal
