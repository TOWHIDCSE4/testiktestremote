"use client"
import {
  ChevronUpDownIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid"
import Link from "next/link"
import { usePathname } from "next/navigation"

const tabs = [
  { name: "RPP1225", current: true },
  { name: "30 Ton", current: false },
  { name: "40 Ton", current: false },
  { name: "RP1635", current: false },
]

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
]

// @ts-expect-error
function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const TimerTracker = () => {
  const pathName = usePathname()

  const openFullScreenTracker = () => {
    window.open(
      "http://localhost:3000/production/timer/tracker",
      "Timer Tracker",
      "location,status,scrollbars,resizable,width=1280, height=720"
    )
  }

  return (
    <>
      <div
        className={`drop-shadow-lg border border-gray-200 bg-white rounded-md ${
          pathName === "/production/timer/tracker" ? "mt-0 h-screen" : "mt-7"
        }`}
      >
        <div>
          <div>
            {/* Tabs */}
            <div
              className={`flex items-center px-4 md:px-0 mt-4 pb-4 md:pb-0 md:mt-0 shadow`}
            >
              <div
                className={`${
                  pathName === "/production/timer/tracker"
                    ? "w-full"
                    : "w-[90%]"
                } `}
              >
                <div className="sm:hidden">
                  <label htmlFor="tabs" className="sr-only">
                    Select a tab
                  </label>
                  {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                  <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-blue-950"
                    defaultValue={
                      // @ts-expect-error
                      tabs.find((tab) => tab.current).name
                    }
                  >
                    {tabs.map((tab) => (
                      <option key={tab.name}>{tab.name}</option>
                    ))}
                  </select>
                </div>
                <div className="hidden sm:block">
                  <nav
                    className="isolate flex divide-x divide-gray-200"
                    aria-label="Tabs"
                  >
                    {tabs.map((tab, tabIdx) => (
                      <button
                        key={tab.name}
                        className={classNames(
                          tab.current
                            ? "text-gray-900"
                            : "text-gray-500 hover:text-gray-700",
                          tabIdx === 0 ? "" : "",
                          tabIdx === tabs.length - 1 ? "" : "",
                          "group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-bold hover:bg-gray-50 focus:z-10"
                        )}
                        aria-current={tab.current ? "page" : undefined}
                      >
                        <span>{tab.name}</span>
                        <span
                          aria-hidden="true"
                          className={classNames(
                            tab.current ? "bg-blue-950" : "bg-transparent",
                            "absolute inset-x-0 bottom-0 h-1"
                          )}
                        />
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
              <div
                className={`w-[10%] bg-white flex justify-center ${
                  pathName === "/production/timer/tracker" ? "hidden" : ""
                }`}
              >
                <span
                  onClick={openFullScreenTracker}
                  className="cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                  >
                    <g
                      fill="none"
                      fillRule="evenodd"
                      stroke="none"
                      strokeWidth="1"
                    >
                      <g fill="#374151" transform="translate(-215 -257)">
                        <g transform="translate(215 257)">
                          <path d="M2 9H0v5h5v-2H2V9zM0 5h2V2h3V0H0v5zm12 7H9v2h5V9h-2v3zM9 0v2h3v3h2V0H9z"></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
              </div>
            </div>
            {/* Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 pl-4 lg:pl-8 uppercase"
                    >
                      <a href="#" className="group inline-flex">
                        Cycle
                        <span className="ml-2 flex-none rounded text-gray-400">
                          <ChevronUpDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase"
                    >
                      <a href="#" className="group inline-flex">
                        Date
                        <span className="ml-2 flex-none rounded text-gray-400">
                          <ChevronUpDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase"
                    >
                      <a href="#" className="group inline-flex">
                        Part/Product
                        <span className="ml-2 flex-none rounded text-gray-400">
                          <ChevronUpDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase"
                    >
                      <a href="#" className="group inline-flex">
                        Operator
                        <span className="ml-2 flex-none rounded text-gray-400">
                          <ChevronUpDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase"
                    >
                      <a href="#" className="group inline-flex">
                        ID
                        <span className="ml-2 flex-none rounded text-gray-400">
                          <ChevronUpDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase"
                    >
                      <a href="#" className="group inline-flex">
                        Status
                        <span className="ml-2 flex-none rounded text-gray-400">
                          <ChevronUpDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase"
                    >
                      <a href="#" className="group inline-flex">
                        Time
                        <span className="ml-2 flex-none rounded text-gray-400">
                          <ChevronUpDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase"
                    >
                      <a href="#" className="group inline-flex">
                        Stop Reason
                        <span className="ml-2 flex-none rounded text-gray-400">
                          <ChevronUpDownIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {people.map((person) => (
                    <tr key={person.email}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"></td>
                      <td className="px-3 py-4 text-sm text-gray-500"></td>
                      <td className="px-3 py-4 text-sm text-gray-500"></td>
                      <td className="px-3 py-4 text-sm text-gray-500"></td>
                      <td className="px-3 py-4 text-sm text-gray-500"></td>
                      <td className="px-3 py-4 text-sm text-gray-500"></td>
                      <td className="px-3 py-4 text-sm text-gray-500"></td>
                      <td className="px-3 py-4 text-sm text-gray-500"></td>
                      <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                        <EllipsisVerticalIcon className="h-6 w-6 text-gray-700 cursor-pointer" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="">
            <div className="md:flex justify-between border-t border-gray-300 px-4 lg:px-8 py-3">
              <div>
                <h6 className="uppercase font-semibold text-gray-700 text-sm leading-6">
                  RP1225 Total Units: 0
                </h6>
                <h6 className="uppercase font-semibold text-gray-700 text-sm leading-6">
                  RP1225 Total Tons: 0.000
                </h6>
                <h6 className="uppercase font-semibold text-gray-700 text-sm leading-6">
                  Total Gain: <span className="text-green-500">00:00:00</span>
                </h6>
                <h6 className="uppercase font-semibold text-gray-700 text-sm leading-6">
                  Total Loss: <span className="text-red-500">00:00:00</span>
                </h6>
                <h6 className="uppercase font-semibold text-gray-700 text-sm leading-6">
                  Total Float: <span className="text-amber-600">00:00:00</span>
                </h6>
              </div>
              <div>
                <button className="relative mt-3 md:mt-0 inline-flex items-center rounded-md bg-blue-950 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-offset-0">
                  View Report
                </button>
              </div>
            </div>
          </div>
          <div className="">
            <div className="flex justify-between border-t border-gray-300 px-4 lg:px-8 py-3">
              <div>
                <h6 className="uppercase font-bold text-gray-700 text-sm leading-6">
                  Overall Units: 0
                </h6>
                <h6 className="uppercase font-bold text-gray-700 text-sm leading-6">
                  Overall Tons: 0.000
                </h6>
              </div>
              <div>
                <h6 className="uppercase font-bold text-gray-700 text-sm leading-6">
                  Global Units: 0
                </h6>
                <h6 className="uppercase font-bold text-gray-700 text-sm leading-6">
                  Global Tons: 0.000
                </h6>
              </div>
            </div>
          </div>
          <div>
            <nav
              className="flex items-center justify-between border-t border-gray-300 bg-white px-4 py-3 lg:px-8"
              aria-label="Pagination"
            >
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">10</span> of{" "}
                  <span className="font-medium">20</span> results
                </p>
              </div>
              <div className="flex flex-1 justify-between sm:justify-end">
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                >
                  Previous
                </a>
                <a
                  href="#"
                  className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                >
                  Next
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default TimerTracker
