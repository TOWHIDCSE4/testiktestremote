import { T_Job } from "custom-validator"
import dayjs from "dayjs"
import React, { FC, useState } from "react"
import { useCollapse } from "react-collapsed"

const TabTableDetail: FC<{ job: any; selected?: boolean }> = ({
  job,
  selected,
}) => {
  const { getCollapseProps } = useCollapse({
    isExpanded: selected,
  })
  return (
    <div
      {...getCollapseProps({})}
      className="flex flex-wrap px-2 w-full bg-gray-100"
    >
      <div className="w-3/12">
        <div className="text-sm font-semibold">ADDITIONAL INFO</div>
        <div className="flex flex-wrap space-x-1 text-[13px]">
          <div>DRAWING :</div>
          <div>{job.drawingNumber}</div>
        </div>
        <div className="flex flex-wrap space-x-1 text-[13px]">
          <div>FACTORY :</div>
          <div>
            {typeof job.factory === "string" ? job.factory : job.factory?.name}
          </div>
        </div>
        <div className="flex flex-wrap space-x-1 text-[13px]">
          <div>DATE CREATED :</div>
          <div>
            {job.createdAt && new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="w-[5px] mr-2 mt-1 mb-1 rounded-lg bg-gray-400 flex justify-center items-center">
        <div className="w-full border-3 border-gray-400"></div>
      </div>
      <div className="w-[70%] h-[70px]">
        <div className="max-h-full overflow-y-auto">
          <table className="w-full text-center overflow-y-auto">
            <thead className="border-b-2 border-black  text-sm">
              <tr>
                <th></th>
                <th>DATE/TIME</th>
                {/* <th>FACTORY</th> */}
                <th>MACHINE</th>
                <th>COUNT</th>
                <th>OPERATOR</th>
              </tr>
            </thead>
            <tbody className="text-xs overflow-scroll">
              {job.timerLogs?.map((log: any, index: any) => (
                <tr key={log._id} className="odd:bg-gray-100 even:bg-white">
                  <td>{index + 1}.</td>
                  {/* <td>1.</td> */}
                  <td>
                    {/* 12/12/2014 */}
                    {log.date
                      ? `${dayjs
                          .tz(log.date, "America/Chicago")
                          .format("MM/DD/YYYY")}`
                      : ""}{" "}
                    <span className="font-bold">
                      {log.date ? `${dayjs(log.date).format("HHmm")}` : ""}
                    </span>
                  </td>
                  {/* <td>
                    
                    {typeof job.factory === "string"
                      ? job.factory
                      : job.factory?.name}
                  </td> */}
                  <td>
                    {/* Tornado */}
                    {typeof log.items[0].machineId === "string"
                      ? log.items[0].machineId
                      : log.items[0].machineId?.name}
                  </td>
                  <td>{log.count}</td>
                  {/* <td>4</td> */}
                  <td>
                    {/* Pat Keo */}
                    {typeof log.items[0].operator === "string"
                      ? log.items[0].operator
                      : log.items[0].operator?.firstName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TabTableDetail
