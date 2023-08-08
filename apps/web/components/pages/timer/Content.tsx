"use client"
import { Fragment, useState } from "react"
import { Menu, Transition } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import TimerCard from "./TimerCard"
import TimerTracker from "./TimerTracker"

const locationTabs = [
  {
    name: "Seguin",
    current: true,
  },
  {
    name: "Conroe",
    current: false,
  },
  {
    name: "Gunter",
    current: false,
  },
]

// @ts-expect-error
function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const Content = () => {
  const [openFilter, setOpenFilter] = useState(false)

  return (
    <div className={`my-20 lg:ml-64`}>
      <div className="content px-4 md:px-7 lg:px-16 2xl:px-60 2xl:max-w-7xl mx-auto mt-28 ">
        <div className="flex justify-between items-center py-2">
          <div>
            <h2 className="text-gray-800 text-[33px] font-semibold leading-none">
              Timer and Analytics
            </h2>
            <h4 className="uppercase text-sm text-gray-500 font-medium tracking-widest mt-2">
              Production<span className="text-black mx-2">&gt;</span>
              <span className="text-red-500">Texas</span>
            </h4>
          </div>
          <div>
            <button
              type="button"
              className="uppercase rounded-md bg-green-700 px-4 md:px-7 py-2 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            >
              New Timer
            </button>
          </div>
        </div>
        <div className="w-full h-0.5 bg-gray-200 mt-5"></div>
        {/* Location */}
        <div className="grid grid-cols-3 gap-x-6 md:gap-x-8 2xl:gap-x-24 mt-5">
          {locationTabs.map((tab) => (
            <div key={tab.name}>
              <button
                type="button"
                className={classNames(
                  tab.current
                    ? "bg-blue-950 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50",
                  "uppercase rounded-md py-3.5 font-extrabold shadow-sm ring-1 ring-inset ring-gray-200 w-full"
                )}
              >
                {tab.name}
              </button>
              <div className="flex mt-1">
                <div className="flex h-6 items-center">
                  <input
                    id="compare"
                    aria-describedby="compare-description"
                    name="compare"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-950"
                  />
                </div>
                <div className="ml-2 md:ml-3 text-xs md:text-sm leading-6">
                  <label
                    htmlFor="compare"
                    className="font-medium text-gray-900 uppercase"
                  >
                    Compare
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full h-[1.5px] bg-gray-200 mt-5"></div>
        <div className="flex justify-between pt-4 pb-3 items-center">
          <div>
            <h3 className="text-gray-700 font-bold uppercase">Clocks</h3>
          </div>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button
                className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => setOpenFilter((openFilter) => !openFilter)}
              >
                Show Only Filter
                <ChevronDownIcon
                  className="-mr-1 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>

            <Transition
              show={openFilter}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <div className="relative px-4 py-0.5 flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id="all"
                            aria-describedby="all-description"
                            name="all"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-950"
                            checked
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label htmlFor="all" className="text-gray-700">
                            All
                          </label>
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <div className="relative px-4 py-0.5 flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id="pipe-box"
                            aria-describedby="pipe-box-description"
                            name="pipe-box"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-950"
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label htmlFor="pipe-box" className="text-gray-700">
                            Pipe And Box
                          </label>
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <div className="relative px-4 py-0.5 flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id="precast"
                            aria-describedby="precast-description"
                            name="precast"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-950"
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label htmlFor="precast" className="text-gray-700">
                            Precast
                          </label>
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <div className="relative px-4 py-0.5 flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id="steel-box"
                            aria-describedby="steel-box-description"
                            name="steel-box"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-950"
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label htmlFor="steel-box" className="text-gray-700">
                            Steel
                          </label>
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <div className="relative px-4 py-0.5 flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id="exterior-box"
                            aria-describedby="exterior-box-description"
                            name="exterior-box"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-950"
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label
                            htmlFor="exterior-box"
                            className="text-gray-700"
                          >
                            Exterior
                          </label>
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <div className="relative px-4 py-0.5 flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id="not-assigned-box"
                            aria-describedby="not-assigned-box-description"
                            name="not-assigned-box"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-950"
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label
                            htmlFor="not-assigned-box"
                            className="text-gray-700"
                          >
                            Not Assigned
                          </label>
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 mb-4 gap-x-5 gap-y-4 md:gap-y-0">
          <div className="rounded-md bg-white shadow p-2 text-center">
            <h5 className="text-lg text-gray-700 uppercase font-bold">
              AUG 07 2023
            </h5>
            <h6 className="uppercase text-gray-400 font-medium text-sm">
              Date
            </h6>
          </div>
          <div className="rounded-md bg-white shadow p-2 text-center">
            <h5 className="text-lg text-gray-700 uppercase font-bold">
              00:00:00
            </h5>
            <h6 className="uppercase text-gray-400 font-medium text-sm">
              Local Time
            </h6>
          </div>
          <div className="rounded-md bg-white shadow p-2 text-center">
            <h5 className="text-lg text-gray-700 uppercase font-bold">
              00:00:00
            </h5>
            <h6 className="uppercase text-gray-400 font-medium text-sm">
              Last Updated
            </h6>
          </div>
          <div className="rounded-md bg-white shadow p-2 text-center">
            <h5 className="text-lg text-gray-700 uppercase font-bold">
              00:00:00
            </h5>
            <h6 className="uppercase text-gray-400 font-medium text-sm">
              In Production
            </h6>
          </div>
          <div className="rounded-md bg-white shadow p-2 text-center">
            <h5 className="text-lg text-gray-700 uppercase font-bold">
              14 Hours
            </h5>
            <h6 className="uppercase text-gray-400 font-medium text-sm">
              Production Time
            </h6>
          </div>
        </div>
        <div className="w-full h-[2.2px] bg-gray-200"></div>
        <div className="md:flex justify-between mt-7">
          <h6 className="font-bold text-lg text-gray-800 uppercase">
            Radial Press And Variants - Timers
          </h6>
          <h6 className="font-bold text-lg text-gray-500">3 Timers</h6>
        </div>
        <TimerCard />
        <h6 className="font-bold text-lg text-gray-800 uppercase mt-7">
          Timer Tracker - Radial Press And Variants
        </h6>
        <TimerTracker />
        <div className="w-full h-[2.2px] bg-gray-200 mt-10"></div>
        <h6 className="font-bold text-lg text-gray-800 uppercase mt-4">
          Wire Cage (MBK) - Timers
        </h6>
        <p className="text-gray-500 mt-4">
          No timer with Wire Cage (MBK). Please add the timer.
        </p>
        <div className="w-full h-[2.2px] bg-gray-200 mt-7"></div>
        <h6 className="font-bold text-lg text-gray-800 uppercase mt-4">
          Precast - Timers
        </h6>
        <p className="text-gray-500 mt-4">
          No timer with Precast. Please add the timer.
        </p>
        <div className="w-full h-[2.2px] bg-gray-200 mt-7"></div>
        <h6 className="font-bold text-lg text-gray-800 uppercase mt-4">
          Steel - Timers
        </h6>
        <p className="text-gray-500 mt-4">
          No timer with Steel. Please add the timer.
        </p>
        <div className="w-full h-[2.2px] bg-gray-200 mt-7"></div>
        <h6 className="font-bold text-lg text-gray-800 uppercase mt-4">
          Fittings - Timers
        </h6>
        <p className="text-gray-500 mt-4">
          No timer with Fittings. Please add the timer.
        </p>
        <div className="w-full h-[2.2px] bg-gray-200 mt-7"></div>
        <h6 className="font-bold text-lg text-gray-800 uppercase mt-4">
          Misc - Timers
        </h6>
        <p className="text-gray-500 mt-4">
          No timer with MISC. Please add the timer.
        </p>
      </div>
    </div>
  )
}

export default Content
