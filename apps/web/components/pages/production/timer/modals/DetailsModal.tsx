"use client"
import { Fragment, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Roboto } from "next/font/google"
import { T_BackendResponse, T_Part } from "custom-validator"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import usePart from "../../../../../hooks/parts/useGetPart"

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

interface DetailsModalProps {
  isOpen: boolean
  onClose: () => void
  id?: string
}

const DetailsModal = ({ isOpen, onClose, id }: DetailsModalProps) => {
  const queryClient = useQueryClient()
  const closeButtonRef = useRef(null)
  const [openEditModal, setOpenEditModal] = useState(false)
  const { data: partDetailData, isLoading: isPartDetailDataLoading } =
    usePart(id)
  const { register, handleSubmit } = useForm<T_Part>({
    values: partDetailData?.item,
  })

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
                  className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full md:max-w-2xl lg:max-w-4xl sm:max-w-lg`}
                >
                  <form>
                    <div className="bg-white">
                      <div className="md:flex justify-between border-b border-gray-300 px-4 md:px-6 py-3">
                        <h3 className="text-gray-800 font-semibold text-2xl">
                          Timer Details
                        </h3>
                        <h3 className="text-gray-800 text-lg">
                          Created by{" "}
                          <span className="text-blue-900 font-semibold">
                            Dylan Lorenz
                          </span>
                        </h3>
                      </div>
                      <div className="px-4 md:px-6 mt-8">
                        <div className="lg:flex justify-between">
                          <div className="lg:w-[350px]">
                            <div className="grid md:grid-cols-4 items-center gap-y-2">
                              <label
                                htmlFor="product-name"
                                className="uppercase font-semibold text-sm text-gray-800 col-span-2"
                              >
                                Part/Product Name:
                              </label>
                              <input
                                type="text"
                                id="product-name"
                                className={`block bg-slate-100 mt-0 w-full col-span-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6 ${roboto.className}`}
                                placeholder="Enter product name"
                                disabled
                                defaultValue={partDetailData?.item?.name}
                                {...register("name", { required: true })}
                              />
                              <label
                                htmlFor="weight"
                                className="uppercase font-semibold text-sm text-gray-800 col-span-2"
                              >
                                Weight (LBS):
                              </label>
                              <input
                                type="number"
                                id="weight"
                                className={`block bg-slate-100 mt-0 w-full col-span-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6 ${roboto.className}`}
                                placeholder="Enter weight"
                                disabled
                                defaultValue={partDetailData?.item?.pounds}
                                {...register("pounds", { required: true })}
                              />
                              <label
                                htmlFor="production-time"
                                className="uppercase font-semibold text-sm text-gray-800 col-span-2"
                              >
                                Production Time:
                              </label>
                              <input
                                type="text"
                                id="production-time"
                                className={`block bg-slate-100 mt-0 w-full col-span-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6 ${roboto.className}`}
                                placeholder="Enter production time"
                                disabled
                                defaultValue={partDetailData?.item?.time}
                                {...register("time", { required: true })}
                              />
                              <label
                                htmlFor="operator-name"
                                className="uppercase font-semibold text-sm text-gray-800 col-span-2"
                              >
                                Operator Name:
                              </label>
                              <select
                                id="operator-name"
                                name="operator-name"
                                className={`block mt-0 w-full col-span-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6 ${roboto.className}`}
                                disabled={isPartDetailDataLoading}
                              >
                                <option>John Doe</option>
                                <option>Jane Doe</option>
                              </select>
                            </div>
                          </div>
                          <div className="lg:w-[400px] mt-5 lg:mt-0">
                            <div className="w-full">
                              <div className="text-gray-400 text-sm border-2 border-gray-300 text-center rounded rounded-md h-52 p-5"></div>
                              <div className="border-2 border-gray-300 rounded-md p-2 mt-2 h-28">
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
                              <button
                                disabled={isPartDetailDataLoading}
                                className="uppercase dsiabled:opacity-70 float-right mt-2 bg-blue-800 hover:bg-blue-700 text-white text-sm py-1 px-4 rounded-md"
                              >
                                Upload
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 mt-16 lg:mt-7 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          type="submit"
                          className="uppercase inline-flex w-full items-center justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 sm:ml-3  disabled:opacity-70 sm:w-auto"
                        >
                          {/* {isUpdatePartLoading ? (
                            <div
                              className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full"
                              role="status"
                              aria-label="loading"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>
                          ) : (
                            "Save"
                          )} */}
                          Save
                        </button>
                        <button
                          type="button"
                          className="uppercase mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-70"
                          onClick={onClose}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
export default DetailsModal
