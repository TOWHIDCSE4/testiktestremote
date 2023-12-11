import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/20/solid"
import { useState } from "react"

export default function SideMenu({ onClick }: { onClick: () => void }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <div className="absolute bottom-0 right-0">
      <div
        data-open={isOpen}
        className="relative transition-transform -translate-y-[100px] translate-x-[calc(100%-30px)] data-[open=true]:translate-x-0 bg-dark-blue h-62 py-1 pl-2 rounded-l-lg"
      >
        <div className="flex items-center justify-center w-48">
          {isOpen ? (
            <ChevronDoubleRightIcon
              className="w-4 h-4 text-green-500 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          ) : (
            <ChevronDoubleLeftIcon
              className="w-4 h-4 text-green-500 cursor-pointer"
              onClick={() => setIsOpen(true)}
            />
          )}
          <button
            type="button"
            className="bg-[#274263] xl:text-xl 2xl:text-4xl rounded-l-md ml-1 2xl:ml-3 text-yellow-200 uppercase w-full py-2 text-center"
            // onClick={() => stopTimer()}
            onClick={onClick}
          >
            End Production
          </button>
        </div>
      </div>
    </div>
  )
}
