import {
  Card,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material"
import React from "react"
import { BiRefresh } from "react-icons/bi"
import { LuMoreVertical } from "react-icons/lu"
import { MdStackedLineChart } from "react-icons/md"
import { SlBadge } from "react-icons/sl"
import { TiChartBar } from "react-icons/ti"

const PerformaceCard: React.FC<{}> = () => {
  return (
    <Card className="w-full flex-1 h-[40rem] overflow-y-auto">
      <div className="flex items-center justify-between space-x-2 p-2 z-50">
        <h2 className="font-semibold">Performance Area</h2>
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
      <div className="py-2 px-4">
        <div className="flex items-center justify-between px-4 pt-2">
          <div className="flex flex-col space-y-1">
            <div className="w-14 h-14 bg-green-700 rounded-md text-white flex items-center justify-center">
              <SlBadge className="w-8 h-8" />
            </div>
            <div className="text-3xl">20</div>
            <div className="text-[1.2rem]/[1.50rem] text-gray-500">
              Successful Timers
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="w-14 h-14 bg-red-700 rounded-md text-white flex items-center justify-center">
              <TiChartBar className="w-8 h-8" />
            </div>
            <div className="text-3xl">40</div>
            <div className="text-[1.2rem]/[1.50rem] text-gray-500">
              Failed Timers
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="w-14 h-14 bg-teal-700 rounded-md text-white flex items-center justify-center">
              <MdStackedLineChart className="w-8 h-8" />
            </div>
            <div className="text-3xl">60</div>
            <div className="text-[1.2rem]/[1.50rem] text-gray-500">
              Total Timers
            </div>
          </div>
        </div>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="simple table"
          className="mt-6"
        >
          <TableHead>
            <TableRow sx={{ borderBottom: 2 }}>
              <TableCell
                className="font-semibold text-xl"
                sx={{ paddingBottom: 1, paddingTop: 1 }}
              >
                Date
              </TableCell>
              <TableCell
                align="center"
                className="font-semibold text-xl"
                sx={{ paddingBottom: 1, paddingTop: 1 }}
              >
                Timers
              </TableCell>
              <TableCell
                align="center"
                className="font-semibold text-xl"
                sx={{ paddingBottom: 1, paddingTop: 1 }}
              >
                Successful
              </TableCell>
              <TableCell
                align="center"
                className="font-semibold text-xl"
                sx={{ paddingBottom: 1, paddingTop: 1 }}
              >
                Failed
              </TableCell>
              <TableCell
                align="center"
                className="font-semibold text-xl"
                sx={{ paddingBottom: 1, paddingTop: 1 }}
              >
                % Failure
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array.from({ length: 8 })].map((row, i) => (
              <TableRow
                key={`row-${row}`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  className="text-[1rem]"
                  sx={{ paddingBottom: 1, paddingTop: 1 }}
                >
                  {new Date().toLocaleDateString()}
                </TableCell>
                <TableCell
                  align="center"
                  className="text-[1rem]"
                  sx={{ paddingBottom: 1, paddingTop: 1 }}
                >
                  {i * 20}
                </TableCell>
                <TableCell
                  align="center"
                  className="text-green-600 font-semibold text-[1rem]"
                  sx={{ paddingBottom: 1, paddingTop: 1 }}
                >
                  {i * 10}
                </TableCell>
                <TableCell
                  align="center"
                  className="text-red-600 font-semibold text-[1rem]"
                  sx={{ paddingBottom: 1, paddingTop: 1 }}
                >
                  {i * 5}
                </TableCell>
                <TableCell
                  align="center"
                  className="text-[1rem]"
                  sx={{ paddingBottom: 1, paddingTop: 1 }}
                >
                  {i + 20} %
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

export default PerformaceCard
