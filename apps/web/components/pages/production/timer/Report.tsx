import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import { PrinterIcon } from "@heroicons/react/24/solid"
import DarkLogo from "../../../../assets/logo/logo-dark.png"
import Image from "next/image"

const Report = () => {
  return (
    <>
      <header className="flex justify-between bg-neutral-900 px-8 py-3">
        <h4 className="text-gray-400 font-bold">Powered by Iekomedia</h4>
        <div className="flex space-x-4">
          <ArrowDownTrayIcon className="h-5 w-5 text-gray-400 cursor-pointer" />
          <PrinterIcon className="h-5 w-5 text-white cursor-pointer" />
        </div>
      </header>
      <main className="px-8">
        <div className="flex justify-between mt-8">
          <div className="logo-container relative w-[200px] h-[50px]">
            <Image src={DarkLogo} fill alt="Logo" />
          </div>

          <div className="text-right">
            <div className="text-sm">
              <span className="text-gray-800 font-bold">City:</span> Seguin
            </div>
            <div className="text-sm">
              <span className="text-gray-800 font-bold">Factory:</span> Pipe And
              Box
            </div>
            <div className="text-sm">
              <span className="text-gray-800 font-bold">Machine Class:</span>{" "}
              Radial Press
            </div>
            <div className="text-sm">
              <span className="text-gray-800 font-bold">Machine:</span> RP1225
            </div>
            <div className="text-sm">
              <span className="text-gray-800 font-bold">Report:</span>{" "}
              15/08/2023
            </div>
          </div>
        </div>
        <h3 className="uppercase text-gray-800 font-bold text-3xl mt-10">
          Totals
        </h3>
        <h4 className="text-lg text-gray-800 mt-4">
          <b>Date Range:</b> 08/14/2023 - 08/15/2023
        </h4>
        <h4 className="text-lg text-gray-800">
          <b>Total Units:</b> 0
        </h4>
        <h4 className="text-lg text-gray-800">
          <b>Total Tons:</b> 0.000
        </h4>
        <h4 className="text-lg text-gray-800">
          <b>Total Time of Gain:</b>
        </h4>
        <h4 className="text-lg text-gray-800">
          <b>Total Time of Loss:</b>
        </h4>
        <h3 className="uppercase text-gray-800 font-bold text-3xl mt-8">
          Cycles
        </h3>
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                No
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Part
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Operator
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Start
              </th>
              <th
                scope="col"
                className="relative text-sm font-semibold text-gray-900 py-3.5 pl-3 pr-4 sm:pr-0"
              >
                Duration
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="relative">
              <td className="py-3 text-sm text-gray-500 absolute right-0 border-b border-gray-200 flex w-full justify-center">
                No data
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"></td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"></td>
            </tr>
          </tbody>
        </table>
      </main>
    </>
  )
}

export default Report
