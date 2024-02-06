"use client"

import DeviceBrowserComponent from "./DeviceBrowser"
import { Lato } from "next/font/google"
import DeviceCheckoutListComponent from "./DeviceCheckoutList"
import SidebarComponent from "./Sidebar"
import { useState } from "react"
import useDevices from "../../../../hooks/device/useDevices"
import useProfile from "../../../../hooks/users/useProfile"
import { USER_ROLES } from "../../../../helpers/constants"
import NewDeviceModalComponent from "./modals/NewDeviceModal"
import { HiChevronLeft } from "react-icons/hi"
import ModalContextProvider from "./context/modalContext"
import ConfirmModalComponent from "./context/confirmModal"
const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  subsets: ["latin", "latin-ext"],
})

const Content = () => {
  const { refetch: refetchDevices } = useDevices()
  const { data: userProfile } = useProfile()
  const isAdmin = [
    USER_ROLES.Super,
    USER_ROLES.Administrator,
    USER_ROLES.HR,
    USER_ROLES.HR_Director,
  ].includes(userProfile?.item?.role ?? "")
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false)
  const toggleNewModalOpen = () => {
    setIsNewModalOpen((prev) => !prev)
  }
  const onCloseNewModal = () => {
    setIsNewModalOpen(false)
    refetchDevices()
  }
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  return (
    <ModalContextProvider>
      <div className={`my-20 pb-20`}>
        <div className="px-4 mx-auto content md:px-7 lg:px-16 2xl:px-44 2xl:max-w-7xl mt-28">
          <div className="flex items-center justify-between py-2">
            <div>
              <h2 className="text-gray-800 text-[33px] font-semibold leading-none">
                Device Checkout
              </h2>
              <h4 className="mt-2 text-sm font-medium tracking-widest text-gray-500 uppercase">
                Human Resources<span className="mx-2 text-black">&gt;</span>
                <span className="text-red-500">Device Checkout</span>
              </h4>
            </div>
            {isAdmin && (
              <div>
                <button
                  type="button"
                  className="px-4 py-2 font-semibold text-white uppercase bg-red-700 rounded-md shadow-sm disabled:bg-gray-400 md:px-7 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                  onClick={() => {
                    toggleNewModalOpen()
                  }}
                  disabled={false}
                >
                  New Device
                </button>
              </div>
            )}
          </div>
          <div className="w-full h-0.5 bg-gray-200 mt-5 mb-5"></div>
          <div
            className={`flex w-full  ${lato.className} text-primary-dark-blue`}
          >
            <div className="flex flex-col flex-1 py-4 md:pr-4 md:-ml-4">
              <DeviceBrowserComponent />
              <DeviceCheckoutListComponent />
            </div>
            <div
              data-open={isSidebarOpen}
              className={`w-[300px] transition-all h-screen xl:h-auto bg-white xl:bg-transparent xl:!translate-x-0 data-[open=true]:translate-x-0 translate-x-full fixed z-50 xl:z-auto right-0 top-0 xl:relative max-w-sm border-l border-primary-dark-blue`}
            >
              <button
                data-open={isSidebarOpen}
                onClick={() => {
                  setIsSidebarOpen((prev) => !prev)
                }}
                className="absolute xl:hidden data-[open=true]:rotate-180 top-[64px] flex items-center justify-center -translate-x-full w-12 h-12 bg-indigo-blue text-white"
              >
                <HiChevronLeft />
              </button>
              <SidebarComponent />
            </div>
          </div>
        </div>
      </div>
      <NewDeviceModalComponent
        isOpen={isNewModalOpen}
        onClose={onCloseNewModal}
      />
      <ConfirmModalComponent />
    </ModalContextProvider>
  )
}

export default Content
