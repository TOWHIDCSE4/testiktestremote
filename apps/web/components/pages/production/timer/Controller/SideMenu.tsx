import React, { Dispatch } from "react"
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid"

const SideMenu = ({
  endMenu,
  setEndMenu,
  setIsEndProductionModalOpen,
  endTimer,
}: {
  endMenu: boolean
  setEndMenu: Dispatch<boolean>
  setIsEndProductionModalOpen: Dispatch<boolean>
  endTimer: Dispatch<boolean>
}) => {
  return (
    <div
      className={`${
        endMenu
          ? "translate-x-0"
          : "translate-x-[202px] 2xl:translate-x-[345px]"
      } absolute z-20 bottom-24 right-0 whitespace-nowrap flex items-end transition transform duration-1000`}
    >
      <div className="w-56 h-12 bg-dark-blue 2xl:w-96 rounded-tl-md dark:outline dark:outline-2 dark:outline-white rounded-bl-md xl:h-16 2xl:h-20">
        <div className="flex items-center h-full ml-1 2xl:ml-2">
          {endMenu ? (
            <ChevronDoubleRightIcon
              className="w-4 h-4 text-green-500 cursor-pointer dark:text-white 2xl:h-8 2xl:w-8"
              onClick={() => setEndMenu(false)}
            />
          ) : (
            <ChevronDoubleLeftIcon
              className="w-4 h-4 text-green-500 cursor-pointer dark:text-white 2xl:h-8 2xl:w-8"
              onClick={() => setEndMenu(true)}
            />
          )}

          <button
            type="button"
            className="bg-[#274263] xl:text-xl 2xl:text-4xl rounded-md ml-1 2xl:ml-3 text-yellow-200 uppercase w-full py-2 text-center"
            // onClick={() => stopTimer()}
            onClick={() => {
              setIsEndProductionModalOpen(true)
              endTimer(true)
            }}
          >
            End Production
          </button>
        </div>
      </div>
    </div>
  )
}

export default SideMenu
