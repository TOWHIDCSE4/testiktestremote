import Image from "next/image"
import React from "react"
import LogoGreen from "../../../../../assets/logo/logo-green.png"
import LogoRed from "../../../../../assets/logo/logo-red.png"

const Header = ({
  progress,
  isLoading,
  location,
}: {
  progress: number
  isLoading: boolean
  location: string
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-center md:justify-between bg-dark-blue py-3 md:py-0 px-4 md:px-12 md:h-20 items-center">
      {progress > 100 ? (
        <Image src={LogoRed} alt="Logo" width={200} height={100} />
      ) : (
        <Image src={LogoGreen} alt="Logo" width={200} height={100} />
      )}
      <div className="mt-3 md:mt-0">
        <h2 className="uppercase text-2xl md:text-4xl text-white font-semibold text-center">
          {isLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-7 w-36 bg-slate-200 rounded"></div>
            </div>
          ) : (
            <>{location}</>
          )}
        </h2>
        <h3 className="uppercase text-lg md:text-2xl text-gray-300 leading-none font-medium text-center">
          Controller
        </h3>
      </div>
    </div>
  )
}

export default Header
