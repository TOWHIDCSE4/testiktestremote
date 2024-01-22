"use client"
import { useEffect } from "react"
import useLocation from "../../../hooks/locations/useLocation"
import useProfile from "../../../hooks/users/useProfile"
import PinnedDashboardComponents from "./pinned-dashboard-components/PinnedDashboardComponents"
import isDev from "../../../helpers/isDev"
import ProductionEyeComponent from "./ProductionEye"
import ProductionEyeMobileComponent from "./ProductionEyeMobile"

const Content = () => {
  const { data, isLoading: basicInfoLoading } = useProfile()
  const { data: location, setSelectedLocationId } = useLocation()

  useEffect(() => {
    if (data?.item?.locationId)
      setSelectedLocationId(data?.item.locationId as string)
  }, [data, setSelectedLocationId])

  return (
    <>
      <div>
        <div className="px-4 mx-auto content md:px-7 lg:px-16 2xl:px-44 2xl:max-w-7xl mt-28">
          <h1 className="text-3xl font-bold text-gray-800">
            {!basicInfoLoading ? (
              <>
                {data?.item?.firstName} {data?.item?.lastName} Portal
              </>
            ) : (
              <div className="flex space-x-4 animate-pulse">
                <div className="rounded h-9 w-80 bg-slate-200"></div>
              </div>
            )}
          </h1>
          <h4 className="mt-2 text-sm font-medium tracking-widest text-gray-500 uppercase">
            Profile Home
            <span className="mx-2 text-black">&gt;</span>
            <span className="text-red-500">{location?.item?.name}</span>
          </h4>
          <div className="w-full h-0.5 bg-gray-200 mt-6"></div>

          <div className="hidden w-full lg:block">
            <ProductionEyeComponent />
          </div>

          <div className="block w-full lg:hidden">
            <ProductionEyeMobileComponent />
          </div>

          {/* <div className="w-full mt-6">
            <div className="flex flex-col text-lg font-bold">
              <div className="text-green-500">Timer is in Gain State</div>
              <div className="text-red-600">Timer is in Loss State</div>
              <div className="text-yellow-400">
                Timer is in Loss Time/Stop reason State
              </div>
              <div className="text-gray-400">
                Timer Inactive /not started /EndProduction State
              </div>
            </div>
          </div> */}

          {isDev && (
            <div className="w-full h-0.5 bg-gray-200 mt-6">
              <PinnedDashboardComponents />
            </div>
          )}
        </div>
      </div>

      {/* <ProductionLookup /> */}
    </>
  )
}

export default Content
