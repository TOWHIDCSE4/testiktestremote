import { T_Job } from "custom-validator"
import React, { FC } from "react"
import { useCollapse } from "react-collapsed"

const TabTableDetail: FC<{ job: any; selectedJob?: T_Job }> = ({
  job,
  selectedJob,
}) => {
  const { getCollapseProps } = useCollapse({
    isExpanded: job._id === selectedJob?._id,
  })
  console.log(selectedJob?._id)
  return (
    <div
      {...getCollapseProps({})}
      className="flex flex-wrap px-2 w-full bg-gray-100"
    >
      <div className="w-3/12">
        <div className="text-sm font-semibold">ADDITIONAL INFO</div>
        <div className="flex flex-wrap space-x-1 text-sm">
          <div>DRAWING :</div>
          <div>{job.drawingNumber}</div>
        </div>
        <div className="flex flex-wrap space-x-1 text-sm">
          <div>DATE CREATED :</div>
          <div>
            {job.createdAt && new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="flex flex-wrap space-x-1 text-sm">
          <div>QA APPROVED :</div>
          <div>Pending</div>
        </div>
      </div>
      <div className="w-[5px] mr-2 mt-1 mb-1 rounded-lg bg-gray-400 flex justify-center items-center">
        <div className="w-full border-3 border-gray-400"></div>
      </div>
      <div className="w-[41rem] h-[70px]">
        <div className="max-h-full overflow-y-scroll">
          <table className="w-full text-center overflow-y-auto">
            <thead className="border-b-2 border-black  text-sm">
              <tr>
                <th></th>
                <th>DATE/TIME</th>
                <th>FACTORY</th>
                <th>MACHINE</th>
                <th>COUNT</th>
                <th>OPERATOR</th>
              </tr>
            </thead>
            <tbody className="text-xs overflow-scroll">
              {/* {job.timerLogs?.map((log, index) => ( */}
              <tr className="odd:bg-gray-100 even:bg-white">
                {/* <td>{index}.</td> */}
                <td>1.</td>
                <td>
                  12/12/2014
                  {/* {log.createdAt &&
                    new Date(log.createdAt).toLocaleDateString()} */}
                </td>
                <td>
                  Steel and Pipe
                  {/* {typeof log.factoryId === "string"
                    ? log.factoryId
                    : log.factoryId.name} */}
                </td>
                <td>
                  Tornado
                  {/* {typeof log.machineId === "string"
                    ? log.machineId
                    : log.machineId.name} */}
                </td>
                {/* <td>{job.count}</td> */}
                <td>4</td>
                <td>
                  Pat Keo
                  {/* {typeof log.operator === "string"
                    ? log.operator
                    : log.operator.firstName} */}
                </td>
              </tr>
              <tr className="odd:bg-gray-100 even:bg-white">
                {/* <td>{index}.</td> */}
                <td>2.</td>
                <td>
                  12/12/2014
                  {/* {log.createdAt &&
                    new Date(log.createdAt).toLocaleDateString()} */}
                </td>
                <td>
                  Steel and Pipe
                  {/* {typeof log.factoryId === "string"
                    ? log.factoryId
                    : log.factoryId.name} */}
                </td>
                <td>
                  Tornado
                  {/* {typeof log.machineId === "string"
                    ? log.machineId
                    : log.machineId.name} */}
                </td>
                {/* <td>{job.count}</td> */}
                <td>4</td>
                <td>
                  Pat Keo
                  {/* {typeof log.operator === "string"
                    ? log.operator
                    : log.operator.firstName} */}
                </td>
              </tr>
              <tr className="odd:bg-gray-100 even:bg-white">
                {/* <td>{index}.</td> */}
                <td>2.</td>
                <td>
                  12/12/2014
                  {/* {log.createdAt &&
                    new Date(log.createdAt).toLocaleDateString()} */}
                </td>
                <td>
                  Steel and Pipe
                  {/* {typeof log.factoryId === "string"
                    ? log.factoryId
                    : log.factoryId.name} */}
                </td>
                <td>
                  Tornado
                  {/* {typeof log.machineId === "string"
                    ? log.machineId
                    : log.machineId.name} */}
                </td>
                {/* <td>{job.count}</td> */}
                <td>4</td>
                <td>
                  Pat Keo
                  {/* {typeof log.operator === "string"
                    ? log.operator
                    : log.operator.firstName} */}
                </td>
              </tr>
              <tr className="odd:bg-gray-100 even:bg-white">
                {/* <td>{index}.</td> */}
                <td>2.</td>
                <td>
                  12/12/2014
                  {/* {log.createdAt &&
                    new Date(log.createdAt).toLocaleDateString()} */}
                </td>
                <td>
                  Steel and Pipe
                  {/* {typeof log.factoryId === "string"
                    ? log.factoryId
                    : log.factoryId.name} */}
                </td>
                <td>
                  Tornado
                  {/* {typeof log.machineId === "string"
                    ? log.machineId
                    : log.machineId.name} */}
                </td>
                {/* <td>{job.count}</td> */}
                <td>4</td>
                <td>
                  Pat Keo
                  {/* {typeof log.operator === "string"
                    ? log.operator
                    : log.operator.firstName} */}
                </td>
              </tr>
              {/* ))} */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TabTableDetail
