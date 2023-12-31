"use client"
import React, { useEffect, useState, useRef, use } from "react"
import SystemReport from "../Report/SystemReport"
import useGetProductionLookup from "../../../../../hooks/productionlookup/useGetProductionLookupFilter"
import useProfile from "../../../../../hooks/users/useProfile"

const ReportTable = ({}: //   locationId,
//   userRole,
//   renderData,
{
  //   locationId: string[]
  //   userRole: string | undefined
  //   renderData: boolean
}) => {
  const [isSavedTableOpen, setSavedTableOpen] = useState(false)
  const [isSharedTableOpen, setSharedTableOpen] = useState(false)
  const { data: userProfile } = useProfile()

  const handleSavedToggleTable = () => {
    setSavedTableOpen((prev) => !prev)
  }
  const handleSharedToggleTable = () => {
    setSharedTableOpen((prev) => !prev)
  }
  const {
    data: paginated,
    isLoading: filtersLoading,
    error,
  } = useGetProductionLookup()

  // const userName = userProfile?.item?.find(
  //   (item: any) => item._id === paginated?.productionLookup?.userId
  // )

  console.log("User Profile", userProfile?.item)

  // console.log("userName", userName?.name)

  return (
    <>
      <div
        className={`w-full mt-6 overflow-hidden bg-white drop-shadow-lg rounded-md`}
      >
        {/* <div className="px-1 w-full pt-4">
          <div className="flex px-2">
            <div className="flex flex-col whitespace-nowrap justify-between">
              <h3 className="text-2xl font-semibold pr-1"></h3>
            </div>
          </div>
        </div> */}
        <h2
          id="accordion-color-heading-1"
          className="cursor-pointer"
          onClick={handleSavedToggleTable}
        >
          <button
            type="button"
            className="flex items-center justify-between w-full p-5 font-[roboto] shadow-md font-semibold rtl:text-right text-black hover:bg-gray-100 gap-3"
            aria-expanded={isSavedTableOpen}
            aria-controls="accordion-color-body-1"
          >
            <span>SAVED REPORTS</span>
            <svg
              data-accordion-icon
              className={`w-3 h-3 rotate-${
                isSavedTableOpen ? "180" : "0"
              } shrink-0`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5 5 1 1 5"
              />
            </svg>
          </button>
        </h2>
        {isSavedTableOpen && (
          <div className="flex w-full mt-4">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed">
                <thead className="text-xs text-gray-700 uppercase bg-white-50 dark:bg-white-700 dark:text-gray-400 shadow-none">
                  <tr>
                    <th scope="col" className="w-[10%] text-slate-900">
                      <div className="flex items-center pl-4">Created By</div>
                    </th>
                    <th
                      scope="col"
                      className="w-[5%] md:w-[6%] md:px-2 text-slate-900"
                    >
                      <div className="flex items-center justify-center ">
                        Cities
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="w-[5%] md:w-[6%] md:px-2 text-slate-900"
                    >
                      <div className="flex items-center justify-center">
                        Machine Classes
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="w-[5%] md:w-[6%] md:px-2 text-slate-900"
                    >
                      <div className="flex items-center justify-center ">
                        Machines
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="w-[5%] md:w-[6%] md:px-2 text-slate-900"
                    >
                      <div className="flex items-center justify-center">
                        Parts
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="w-[5%] md:w-[6%] md:px-2 text-slate-900"
                    >
                      <div className="flex items-center justify-center">
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody
                  data-accordion="open"
                  className="border-t-4 border-indigo-900"
                >
                  {paginated?.productionLookup?.map((item: any, index: any) => (
                    <tr
                      key={index}
                      className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                      data-accordion-target="#accordion-arrow-icon-body-0"
                      aria-expanded="false"
                      aria-controls="accordion-arrow-icon-body-0"
                    >
                      <td className="pr-6 py-5">{item.userId}</td>
                      <td className="px-6 py-4">
                        {item.locations
                          ?.map((location: any) => location.label)
                          .join(", ")}
                      </td>
                      <td className="pr-6 py-5">
                        {item.machineClasses
                          ?.map((machineClass: any) => machineClass.label)
                          .join(", ")}
                      </td>
                      <td className="pr-6 py-5">
                        {item.machines
                          ?.map((machine: any) => machine.label)
                          .join(", ")}
                      </td>
                      <td className="pr-6 py-5">
                        {item.parts?.map((part: any) => part.label).join(", ")}
                      </td>
                      <td className="pr-6 py-5">
                        <button
                          className="flex justify-center mr-2 py-2 px-2 border rounded-lg border-1 border-black bg-blue-950 text-slate-50"
                          // onClick={handleClick}
                        >
                          REPORT
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div
        className={`w-full mt-4 overflow-hidden bg-white drop-shadow-lg rounded-md`}
      >
        {/* <div className="px-1 w-full pt-4">
          <div className="flex px-2">
            <div className="flex flex-col whitespace-nowrap justify-between">
              <h3 className="text-2xl font-semibold pr-1"></h3>
            </div>
          </div>
        </div> */}
        <h2
          id="accordion-color-heading-1"
          className="cursor-pointer"
          onClick={handleSharedToggleTable}
        >
          <button
            type="button"
            className="flex items-center justify-between w-full p-5 font-[roboto] shadow-md font-semibold rtl:text-right text-black hover:bg-gray-100 gap-3"
            aria-expanded={isSharedTableOpen}
            aria-controls="accordion-color-body-1"
          >
            <span>SHARED REPORTS</span>
            <svg
              data-accordion-icon
              className={`w-3 h-3 rotate-${
                isSharedTableOpen ? "180" : "0"
              } shrink-0`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5 5 1 1 5"
              />
            </svg>
          </button>
        </h2>
        {isSharedTableOpen && (
          <div className="flex w-full mt-4">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed">
                <thead className="text-xs text-gray-700 uppercase bg-white-50 dark:bg-white-700 dark:text-gray-400 shadow-none">
                  <tr>
                    <th scope="col" className="w-[18%] text-slate-900">
                      <div className="flex items-center pl-4 text-[14px]">
                        Reports
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="w-[5%] md:w-[6%] md:px-2 text-slate-900"
                    >
                      <div className="flex items-center justify-center text-[14px]">
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody
                  data-accordion="open"
                  className="border-t-4 border-indigo-900"
                >
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                    data-accordion-target="#accordion-arrow-icon-body-0"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-0"
                  >
                    <td className="pr-6 py-5"></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                    data-accordion-target="#accordion-arrow-icon-body-0"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-0"
                  >
                    <td className="pr-6 py-5"></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                    data-accordion-target="#accordion-arrow-icon-body-0"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-0"
                  >
                    <td className="pr-6 py-5"></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                    data-accordion-target="#accordion-arrow-icon-body-0"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-0"
                  >
                    <td className="pr-6 py-5"></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                    data-accordion-target="#accordion-arrow-icon-body-0"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-0"
                  >
                    <td className="pr-6 py-5"></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                    data-accordion-target="#accordion-arrow-icon-body-0"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-0"
                  >
                    <td className="pr-6 py-5"></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                    data-accordion-target="#accordion-arrow-icon-body-0"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-0"
                  >
                    <td className="pr-6 py-5"></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                    data-accordion-target="#accordion-arrow-icon-body-0"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-0"
                  >
                    <td className="pr-6 py-5"></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                    data-accordion-target="#accordion-arrow-icon-body-0"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-0"
                  >
                    <td className="pr-6 py-5"></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                  <tr
                    className="bg-gray text-slate-900 font-medium border-b bg-gray-100"
                    data-accordion-target="#accordion-arrow-icon-body-0"
                    aria-expanded="false"
                    aria-controls="accordion-arrow-icon-body-0"
                  >
                    <td className="pr-6 py-5"></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ReportTable
