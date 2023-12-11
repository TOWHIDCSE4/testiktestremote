import Image from "next/image"
import React, { RefObject, useRef } from "react"
import LogoGreen from "../../../../../assets/logo/logo-green.png"
import LogoRed from "../../../../../assets/logo/logo-red.png"
import { MdClose } from "react-icons/md"
import useControllerModal from "../../../../../store/useControllerModal"
import { QueueListIcon } from "@heroicons/react/20/solid"

const Header = ({
  progress,
  isLoading,
  locationName,
  setOpenTimerLogs,
  onClose,
  onFullScreen,
}: {
  progress: number
  isLoading: boolean
  locationName: string
  setOpenTimerLogs: (val: boolean) => void
  onClose: () => void
  onFullScreen: () => void
}) => {
  const [mode, setMode] = React.useState("")
  const toggleTheme = () => {
    if (mode === "Dark") {
      document.documentElement.classList.remove("dark")
      setMode("Light")
    } else {
      document.documentElement.classList.add("dark")
      setMode("Dark")
    }
  }

  return (
    <div
      className={`flex flex-row md:flex-row justify-around bg-dark-blue md:justify-between ${
        mode === "Dark" ? "bg-dark-blue" : "bg-dark-blue"
      } py-3 md:py-0 px-4 xl:px-8 md:px-12 h-20 items-center sticky top-0 z-20`}
    >
      {progress > 100 ? (
        <div className="flex items-center h-[90px] w-[190px] xl:h-[120px] xl:w-[230px] 2xl:h-[140px] 2xl:w-[250px] relative">
          <Image src={LogoRed} alt="Logo" />
        </div>
      ) : (
        <div className="flex items-center h-[90px] w-[190px] xl:h-[120px] xl:w-[230px] 2xl:h-[140px] 2xl:w-[250px] relative">
          <Image src={LogoGreen} alt="Logo" />
        </div>
      )}

      <div className="flex mt-3 md:mt-0">
        {/* TIMER LOG BUTTON */}
        <div className="items-end px-1 py-0 pt-3 mr-5 duration-100 bg-gray-100 rounded-xl sm:mt-2 md:mt-5 2xl:mt-6 h-9">
          <button onClick={() => setOpenTimerLogs(true)}>
            <div className="flex">
              <div className="mx-1">
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      fill="#000000"
                      fill-rule="evenodd"
                      d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
                    ></path>{" "}
                  </g>
                </svg>
              </div>
            </div>
          </button>
        </div>
        {/* DARK/LIGHT BUTTON */}
        <div className="items-end px-1 py-0 pt-2 mr-5 duration-100 bg-gray-100 rounded-xl sm:mt-2 md:mt-5 2xl:mt-6 h-9">
          <button onClick={toggleTheme}>
            {mode === "Dark" ? (
              <div className="flex">
                <div className="mx-1">
                  <svg
                    width="20px"
                    height="26px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      clip-path="url(#a)"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                    >
                      <path
                        d="M5 12H1M23 12h-4M7.05 7.05 4.222 4.222M19.778 19.778 16.95 16.95M7.05 16.95l-2.828 2.828M19.778 4.222 16.95 7.05"
                        stroke-linecap="round"
                      />

                      <path
                        d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                        fill="#ffffff"
                        fill-opacity=".16"
                      />

                      <path d="M12 19v4M12 1v4" stroke-linecap="round" />
                    </g>

                    <defs>
                      <clipPath id="a">
                        <path fill="#ffffff" d="M0 0h24v24H0z" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
            ) : (
              <div className="flex">
                <div className="mx-1">
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.0174 2.80157C6.37072 3.29221 2.75 7.22328 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C16.7767 21.25 20.7078 17.6293 21.1984 12.9826C19.8717 14.6669 17.8126 15.75 15.5 15.75C11.4959 15.75 8.25 12.5041 8.25 8.5C8.25 6.18738 9.33315 4.1283 11.0174 2.80157ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C12.7166 1.25 13.0754 1.82126 13.1368 2.27627C13.196 2.71398 13.0342 3.27065 12.531 3.57467C10.8627 4.5828 9.75 6.41182 9.75 8.5C9.75 11.6756 12.3244 14.25 15.5 14.25C17.5882 14.25 19.4172 13.1373 20.4253 11.469C20.7293 10.9658 21.286 10.804 21.7237 10.8632C22.1787 10.9246 22.75 11.2834 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12Z"
                        fill="#1C274C"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>
              </div>
            )}
          </button>
        </div>
        {/* FULLSCREEN BUTTON */}
        <div className="items-end px-1 py-0 pt-2 mr-5 duration-100 bg-gray-100 rounded-xl sm:mt-2 md:mt-5 2xl:mt-6 h-9">
          <button onClick={onFullScreen}>
            <div className="flex">
              <div className="mx-1">
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M9.00002 3.99998H4.00004L4 9M20 8.99999V4L15 3.99997M15 20H20L20 15M4 15L4 20L9.00002 20"
                      stroke="#000000"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
              </div>
            </div>
          </button>
        </div>
        <div>
          <h2
            className={`uppercase text-2xl md:text-4xl xl:text-4xl 2xl:text-5xl  ${
              mode === "Dark" ? "text-white" : "text-white"
            } font-semibold text-center`}
          >
            {isLoading ? (
              <div className="flex space-x-4 animate-pulse">
                <div className="rounded h-7 w-36 bg-slate-200"></div>
              </div>
            ) : (
              <>{locationName}</>
            )}
          </h2>
          <h3
            className={`uppercase text-lg md:text-2xl xl:text-2xl 2xl:text-3xl ${
              mode === "Dark" ? "text-white" : "text-white"
            } leading-none font-medium text-center`}
          >
            Controller
          </h3>
        </div>
        <button className="mx-5" onClick={() => onClose()}>
          <MdClose onClick={() => onClose()} size={24} color="white" />
        </button>
      </div>
    </div>
  )
}

export default Header
