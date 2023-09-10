import React, { Dispatch } from "react"
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid"

const SideMenu = ({
  endMenu,
  setEndMenu,
  setIsEndProductionModalOpen,
}: {
  endMenu: boolean
  setEndMenu: Dispatch<boolean>
  setIsEndProductionModalOpen: Dispatch<boolean>
}) => {
  return (
    <div
      className={`${
        endMenu
          ? "translate-x-0"
          : "translate-x-[202px] 2xl:translate-x-[345px]"
      } min-h-screen fixed z-20 top-0 right-0 whitespace-nowrap flex items-end pb-24 transition transform duration-1000`}
    >
      <div className="bg-dark-blue w-56 2xl:w-96 rounded-tl-md rounded-bl-md h-12 xl:h-16 2xl:h-20">
        <div className="flex items-center h-full ml-1 2xl:ml-2">
          {endMenu ? (
            <ChevronDoubleRightIcon
              className="text-green-500 h-4 w-4 2xl:h-8 2xl:w-8 cursor-pointer"
              onClick={() => setEndMenu(false)}
            />
          ) : (
            <ChevronDoubleLeftIcon
              className="text-green-500 h-4 w-4 2xl:h-8 2xl:w-8 cursor-pointer"
              onClick={() => setEndMenu(true)}
            />
          )}

          <button
            type="button"
            className="bg-[#274263] xl:text-xl 2xl:text-4xl rounded-md ml-1 2xl:ml-3 text-yellow-200 uppercase w-full py-2 text-center"
            // onClick={() => stopTimer()}
            onClick={() => setIsEndProductionModalOpen(true)}
          >
            End Production
          </button>
        </div>
      </div>
    </div>
  )
}

export default SideMenu
