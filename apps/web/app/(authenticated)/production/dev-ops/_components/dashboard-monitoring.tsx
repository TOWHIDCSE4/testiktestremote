"use client"
import { Card, Divider, IconButton } from "@mui/material"
import { BiRefresh } from "react-icons/bi"
import { LuMoreVertical } from "react-icons/lu"
import { AreaChart } from "@tremor/react"

const chartdata3 = [
  {
    date: "Jan 23",
    "Distance Running": 167,
  },
  {
    date: "Feb 23",
    "Distance Running": 125,
  },
  {
    date: "Mar 23",
    "Distance Running": 156,
  },
  {
    date: "Apr 23",
    "Distance Running": 165,
  },
  {
    date: "May 23",
    "Distance Running": 153,
  },
  {
    date: "Jun 23",
    "Distance Running": 124,
  },
  {
    date: "Jul 23",
    "Distance Running": 164,
  },
  {
    date: "Aug 23",
    "Distance Running": 123,
  },
  {
    date: "Sep 23",
    "Distance Running": 132,
  },
]

const DashboardMonitoring = () => {
  return (
    <Card className="w-full flex-1">
      <div className="flex items-center justify-between space-x-2 p-2 z-50">
        <h2 className="font-semibold">Dashboard Monitoring</h2>
        <div className="flex items-center space-x-2">
          <IconButton>
            <BiRefresh />
          </IconButton>

          <IconButton>
            <LuMoreVertical />
          </IconButton>
        </div>
      </div>
      <Divider />
      <div className="flex flex-col space-y-1 mt-2">
        <div className="">
          <AreaChart
            className="h-72 mt-4"
            data={chartdata3}
            index="date"
            categories={["Distance Running"]}
            colors={["blue"]}
            showYAxis={false}
            showLegend={false}
            // showXAxis={false}
            // yAxisWidth={30}

            //   customTooltip={customTooltip}
          />
        </div>
        <div className="h-[25rem] overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all"
                        type="checkbox"
                        className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="checkbox-all" className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Agent ID
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Agent Name
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Quota
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Reached
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Rating
                  </th>
                  <th scope="col" className="px-4 py-3">
                    More
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array.from({ length: 10 })].map((row) => (
                  <tr
                    key={`${row}`}
                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <td className="w-4 px-4 py-3">
                      <div className="flex items-center">
                        <input
                          id="checkbox-table-search-1"
                          type="checkbox"
                          className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="checkbox-table-search-1"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                        Desktop PC
                      </span>
                    </td>
                    <th
                      scope="row"
                      className="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="iMac Front Image"
                        className="mr-3 rounded-full w-8 h-8"
                      />
                      Apple iMac 27&#34;
                    </th>
                    <td className="px-4 py-2">
                      <div className="w-full p-1.5 rounded-sm bg-green-600 text-white text-center">
                        ACTIVE
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex items-center">95</div>
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      45
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      0.47
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <LuMoreVertical />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default DashboardMonitoring
