"use client"
import { Fragment, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Roboto } from "next/font/google"

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

interface DetailsModalProps {
  isOpen: boolean
  onClose: () => void
}

const DetailsModal = ({ isOpen, onClose }: DetailsModalProps) => {
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
                  className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 max-w-2xl lg:max-w-4xl sm:w-full sm:max-w-lg`}
                >
                  <form>
                    <div className="bg-white">
                      <div className="flex justify-between border-b border-gray-300 px-4 md:px-6 py-3">
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
                      <div className="px-4 md:px-6 mt-4">
                        <div className="lg:flex justify-between">
                          <div className="w-[350px]">
                            <div className="grid grid-cols-4 items-center gap-y-2">
                              <label
                                htmlFor="product-name"
                                className="uppercase font-semibold text-sm text-gray-800 col-span-2"
                              >
                                Part/Product Name:
                              </label>
                              <input
                                type="text"
                                name="product-name"
                                id="product-name"
                                className={`block mt-2 md:mt-0 w-full col-span-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6 ${roboto.className}`}
                                placeholder="Enter product name"
                                defaultValue={"48x8 CL3 T&G RCP"}
                              />
                              <label
                                htmlFor="weight"
                                className="uppercase font-semibold text-sm text-gray-800 col-span-2"
                              >
                                Weight (LBS):
                              </label>
                              <input
                                type="number"
                                name="weight"
                                id="weight"
                                className={`block mt-2 md:mt-0 w-full col-span-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6 ${roboto.className}`}
                                placeholder="Enter weight"
                                defaultValue={"7079"}
                              />
                              <label
                                htmlFor="production-time"
                                className="uppercase font-semibold text-sm text-gray-800 col-span-2"
                              >
                                Production Time:
                              </label>
                              <input
                                type="text"
                                name="production-time"
                                id="production-time"
                                className={`block mt-2 md:mt-0 w-full col-span-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6 ${roboto.className}`}
                                placeholder="Enter production time"
                                defaultValue={"198 s"}
                              />
                              <label
                                htmlFor="operator-name"
                                className="uppercase font-semibold text-sm text-gray-800 col-span-2"
                              >
                                Operator Name:
                              </label>
                              <input
                                type="text"
                                name="operator-name"
                                id="operator-name"
                                className={`block mt-2 md:mt-0 w-full col-span-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6 ${roboto.className}`}
                              />
                              <label
                                htmlFor="finish-good-weight"
                                className="uppercase font-semibold text-sm text-gray-800 col-span-2"
                              >
                                Finish Good Weight:
                              </label>
                              <input
                                type="number"
                                name="finish-good-weight"
                                id="finish-good-weight"
                                className={`block mt-2 md:mt-0 w-full col-span-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6 ${roboto.className}`}
                              />
                              <label
                                htmlFor="cage-weight-scrap"
                                className="uppercase font-semibold text-sm text-gray-800 col-span-2"
                              >
                                Cage Weight Scrap:
                              </label>
                              <input
                                type="number"
                                name="cage-weight-scrap"
                                id="cage-weight-scrap"
                                className={`block mt-2 md:mt-0 w-full col-span-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6 ${roboto.className}`}
                              />
                              <label
                                htmlFor="cage-weight-actuals"
                                className="uppercase font-semibold text-sm text-gray-800 col-span-2"
                              >
                                Cage Weight Actuals:
                              </label>
                              <input
                                type="number"
                                name="cage-weight-actuals"
                                id="cage-weight-actuals"
                                className={`block mt-2 md:mt-0 w-full col-span-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6 ${roboto.className}`}
                              />
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
