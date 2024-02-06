"use client"
import { Card, Divider, IconButton } from "@mui/material"
import { BiRefresh } from "react-icons/bi"
import { LuMoreVertical } from "react-icons/lu"
import useAlertList from "../hooks/useAlertList"
import Alert from "./alert"

const Alerts: React.FC = () => {
  const query = useAlertList()
  const alertList = query.data
  return query.isLoading || query.isFetching ? (
    <div>Loading ...</div>
  ) : (
    <Card className="w-full flex-1">
      <div className="flex items-center justify-between space-x-2 p-2 z-50">
        <h2 className="font-semibold">Alerts Section</h2>
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
        <div className="p-4 shadow-lg flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-md">14 - </span>
            <span className="text-red-600 font-semibold">Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-md">34 - </span>
            <span className="text-yellow-600 font-semibold">In Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-md">12 - </span>
            <span className="text-green-600 font-semibold ">Success</span>
          </div>
        </div>
        <div className="p-4 shadow-lg flex items-center space-x-4">
          <div className="px-4 py-2 rounded-full bg-red-600 text-slate-100 font-semibold text-sm ">
            Pendings
          </div>
          <div className="px-4 py-2 rounded-full bg-yellow-600 text-slate-100 font-semibold text-sm ">
            Warnings
          </div>
          <div className="px-4 py-2 rounded-full bg-green-600 text-slate-100 font-semibold text-sm ">
            Success
          </div>
        </div>
        <div className="h-[25rem] overflow-y-auto">
          {alertList?.items?.length ? (
            alertList?.items?.map((alert: any) => (
              <Alert
                key={alert._id}
                description={alert.description}
                heading={alert.title}
                type={alert.severity}
              />
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-40">
              <h2 className="font-semibold text-xl">No Alerts Received</h2>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default Alerts
