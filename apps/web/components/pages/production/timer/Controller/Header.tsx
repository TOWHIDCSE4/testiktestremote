import Image from "next/image"
import React from "react"
import LogoGreen from "../../../../../assets/logo/logo-green.png"
import LogoRed from "../../../../../assets/logo/logo-red.png"

const Header = ({
  progress,
  isLoading,
  location,
  setOpenTimerLogs,
}: {
  progress: number
  isLoading: boolean
  location: string
  setOpenTimerLogs: (val: boolean) => void
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
      } py-3 md:py-0 px-4 xl:px-8 md:px-12 h-20 items-center`}
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

      <div className="mt-3 md:mt-0 flex">
        <button
          className="bg-white h-9 self-center mr-4 rounded-md px-4"
          onClick={() => setOpenTimerLogs(true)}
        >
          Production Logs
        </button>
        <div className="items-end duration-100 bg-gray-100 rounded-xl sm:mt-2 mr-5 md:mt-5 2xl:mt-6 h-9 py-0 pt-2 px-1">
          <button onClick={toggleTheme}>
            {mode === "Dark" ? (
              <div className="flex">
                <div className="mx-1">
                  <svg
                    width="20px"
                    height="20px"
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
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      id="Lager_94"
                      data-name="Lager 94"
                      transform="translate(0)"
                    >
                      <path
                        id="Path_70"
                        data-name="Path 70"
                        d="M12.516,4.509A12,12,0,0,0,22.3,19.881,12.317,12.317,0,0,0,24,20a11.984,11.984,0,0,0,3.49-.514,12.1,12.1,0,0,1-9.963,8.421A12.679,12.679,0,0,1,16,28,12,12,0,0,1,12.516,4.509M16,0a16.5,16.5,0,0,0-2.212.15A16,16,0,0,0,16,32a16.526,16.526,0,0,0,2.01-.123A16.04,16.04,0,0,0,31.85,18.212,16.516,16.516,0,0,0,32,15.944,1.957,1.957,0,0,0,30,14a2.046,2.046,0,0,0-1.23.413A7.942,7.942,0,0,1,24,16a8.35,8.35,0,0,1-1.15-.08,7.995,7.995,0,0,1-5.264-12.7A2.064,2.064,0,0,0,16.056,0Z"
                        fill="#040505"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            )}
          </button>
        </div>
        <div>
          <h2
            className={`uppercase text-2xl md:text-4xl xl:text-4xl 2xl:text-5xl  ${
              mode === "Dark" ? "text-white" : "text-white"
            } font-semibold text-center`}
          >
            {isLoading ? (
              <div className="animate-pulse flex space-x-4">
                <div className="h-7 w-36 bg-slate-200 rounded"></div>
              </div>
            ) : (
              <>{location}</>
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
      </div>
    </div>
  )
}

export default Header
