"use client"
import { Lato } from "next/font/google"
import { useEffect } from "react"
import useLocation from "../../../hooks/locations/useLocation"
import useProfile from "../../../hooks/users/useProfile"
import PinnedDashboardComponents from "./pinned-dashboard-components/PinnedDashboardComponents"
import isDev from "../../../helpers/isDev"
import ProductionEyeComponent from "./ProductionEye"
import ProductionEyeMobileComponent from "./ProductionEyeMobile"
import ProductionEyeContextProvider from "./production-eye/productinEyeContext"

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  subsets: ["latin", "latin-ext"],
})

const Content = () => {
  const { data } = useProfile()
  const { data: location, setSelectedLocationId } = useLocation()

  useEffect(() => {
    if (data?.item?.locationId)
      setSelectedLocationId(data?.item.locationId as string)
  }, [data, setSelectedLocationId])

  return (
    <>
      <div className="px-4 mx-auto md:px-7 lg:px-16 2xl:px-44 2xl:max-w-7xl mt-28">
        <h1 className="text-3xl font-bold text-gray-800">
          {data?.item?.firstName} {data?.item?.lastName} Portal
        </h1>
        <h4 className="mt-2 text-sm font-medium tracking-widest text-gray-500 uppercase">
          Profile Home
          <span className="mx-2 text-black">&gt;</span>
          <span className="text-red-500">{location?.item?.name}</span>
        </h4>
        <div className="w-full h-0.5 bg-gray-200 mt-6"></div>

        <ProductionEyeContextProvider>
          <div className="items-center justify-center hidden w-full lg:flex">
            <ProductionEyeComponent />
            {/* <ProductionEyeMobileComponent /> */}
          </div>

          <div className="block w-full lg:hidden">
            <ProductionEyeMobileComponent />
          </div>
        </ProductionEyeContextProvider>

        {isDev && (
          <div className="w-full h-0.5 bg-gray-200 mt-6">
            <PinnedDashboardComponents />
          </div>
        )}
      </div>
    </>
  )
}

export default Content
