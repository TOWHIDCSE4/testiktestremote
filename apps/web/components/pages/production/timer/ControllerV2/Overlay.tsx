import { useContext, useMemo, useState } from "react"
import { HiChevronDoubleRight, HiPlay } from "react-icons/hi"
import { RiRefreshFill } from "react-icons/ri"
import useProfile from "../../../../../hooks/users/useProfile"
import { USER_ROLES } from "../../../../../helpers/constants"
import { ControllerContext } from "./ControllerContext"
import { Combobox } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import toast from "react-hot-toast"

const buttonCV = {
  active:
    "bg-opacity-30 text-white hover:bg-opacity-100 active:bg-opacity-100 active:scale-95",
  disabled: "bg-opacity-30 text-white/30 cursor-default",
}

export default function OverlayActionComponent({
  machineName,
}: {
  machineName: string
}) {
  const { data: userProfile, isLoading: isProfileLoading } = useProfile()
  const {
    startNewControllerSession,
    onAddControllerTimerHour,
    isControllerOutOfTime,
  } = useContext(ControllerContext)

  const isAdmin = useMemo(() => {
    return [
      USER_ROLES.Super,
      USER_ROLES.Administrator,
      USER_ROLES.Production,
    ].includes(userProfile?.item.role ?? "")
  }, [userProfile?.item.role])

  const isDisabledReset = false
  const isDisabledResume = false
  const [isResetConfirmShow, setIsResetConfirmShow] = useState<boolean>()
  const [isResumeConfirmShow, setIsResumeConfirmShow] = useState<boolean>()
  const [selectedHour, setSelectedHour] = useState<number>(0)
  const onResumeClick = () => {
    setIsResumeConfirmShow(true)
  }
  const onResetClick = () => {
    setIsResetConfirmShow(true)
  }
  const onConfirm = (event: "resume" | "reset", isConfirm: boolean) => {
    if (event == "reset") {
      if (isConfirm) {
        startNewControllerSession()
        setIsResetConfirmShow(false)
      } else {
        setIsResetConfirmShow(false)
      }
    }
    if (event === "resume") {
      if (isConfirm) {
        onAddControllerTimerHour(selectedHour)
        setIsResumeConfirmShow(false)
      } else {
        setIsResumeConfirmShow(false)
      }
    }
  }

  return (
    <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full bg-black/80 backdrop-blur-sm">
      <div className="relative flex flex-col items-center justify-center w-full h-full sm:flex-row">
        {isAdmin ? (
          <div className="flex flex-col w-full h-full text-white sm:flex-row relative">
            <div className="relative flex-1 h-full">
              <button
                className={`relative flex group/button flex-col items-center justify-center w-full h-full transition-all bg-green-600 ${
                  buttonCV[isDisabledResume ? "disabled" : "active"]
                }`}
              >
                {isControllerOutOfTime && (
                  <div className="flex flex-col items-start justify-start">
                    <div className="text-xl text-center text-whit mb-2">
                      Add Hour to Controller
                    </div>
                    <Combobox
                      value={selectedHour}
                      onChange={(v) => setSelectedHour(v)}
                    >
                      <div className="text-gray-900 relative">
                        <Combobox.Input
                          displayValue={(v) => (v ? `${v} hour` : "")}
                          placeholder="Select hour"
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
                          <ChevronUpDownIcon className={`h-5 w-5`} />
                        </Combobox.Button>
                        <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          <Combobox.Option
                            className="relative cursor-pointer select-none py-1 z-50 pl-3 pr-9 text-gray-900 hover:bg-blue-600 hover:text-white"
                            value={1}
                          >
                            1 Hour
                          </Combobox.Option>
                          <Combobox.Option
                            className="relative cursor-pointer select-none py-1 z-50 pl-3 pr-9 text-gray-900 hover:bg-blue-600 hover:text-white"
                            value={2}
                          >
                            2 Hour
                          </Combobox.Option>
                          <Combobox.Option
                            className="relative cursor-pointer select-none py-1 z-50 pl-3 pr-9 text-gray-900 hover:bg-blue-600 hover:text-white"
                            value={3}
                          >
                            3 Hour
                          </Combobox.Option>
                          <Combobox.Option
                            className="relative cursor-pointer select-none py-1 z-50 pl-3 pr-9 text-gray-900 hover:bg-blue-600 hover:text-white"
                            value={4}
                          >
                            4 Hour
                          </Combobox.Option>
                          <Combobox.Option
                            className="relative cursor-pointer select-none py-1 z-50 pl-3 pr-9 text-gray-900 hover:bg-blue-600 hover:text-white"
                            value={5}
                          >
                            5 Hour
                          </Combobox.Option>
                        </Combobox.Options>
                      </div>
                    </Combobox>
                  </div>
                )}

                <div
                  onClick={onResumeClick}
                  className="flex flex-col items-center"
                >
                  <div className="sm:pt-8 text-8xl">
                    <HiPlay className="transition-all group-hover/button:scale-110" />
                  </div>
                  <div className="text-3xl sm:pt-2 sm:text-3xl">RESUME</div>
                </div>
              </button>
              {isResumeConfirmShow && (
                <div
                  onClick={() => onConfirm("resume", false)}
                  className="absolute top-0 left-0 flex items-center justify-center w-full h-full cursor-pointer bg-dark-black bg-opacity-40 backdrop-blur-sm"
                >
                  <div className="px-8 translate-y-0 border-2 sm:translate-y-full md:translate-y-0 lg:ml-[10%] lg:mr-[30%] group/dialog md:ml-auto border-dark-blue bg-gold text-dark-blue">
                    <div className="relative flex flex-col items-center justify-center gap-1 px-4 py-1 bg-gray-300 border-2 border-gray-500 rounded-md">
                      <div className="font-bold text-center uppercase">
                        To confirm resume of
                        <br /> controller, Proceed?
                      </div>
                      <div className="flex items-center gap-4 transition-all group-hover:dialog/gap-6">
                        <HiChevronDoubleRight className="text-gold" />
                        <button
                          onClick={() => onConfirm("resume", true)}
                          className="px-4 text-xl font-bold bg-gray-200 border-2 border-gray-400 rounded-md hover:scale-105 active:scale-95"
                        >
                          OK
                        </button>
                        <HiChevronDoubleRight className="rotate-180 text-gold" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="relative flex-1 h-full">
              <button
                onClick={onResetClick}
                className={`relative flex group/button flex-col items-center justify-center w-full h-full transition-all bg-gold ${
                  buttonCV[isDisabledReset ? "disabled" : "active"]
                }`}
              >
                <div className="sm:pt-8 text-8xl">
                  <RiRefreshFill className="transition-all group-hover/button:scale-110 group-active/button:rotate-180" />
                </div>
                <div className="text-3xl sm:pt-2 sm:text-3xl">RESET</div>
                <div className="relative w-full capitalize sm:pt-1 tex-sm">
                  creates a new production session
                </div>
              </button>
              <div className="absolute gap-2 top-[50%] translate-y-[1.4rem] sm:translate-y-[2.6rem] right-4 flex items-center justify-end text-xl">
                <input
                  id="checkbox-nightshift"
                  type="checkbox"
                  className="bg-transparent outline-white"
                  disabled={isDisabledReset}
                />
                <label htmlFor="checkbox-nightshift" className="select-none">
                  Nightshift
                </label>
              </div>
              {isResetConfirmShow && (
                <div
                  onClick={() => onConfirm("reset", false)}
                  className="absolute top-0 left-0 flex items-center justify-center w-full h-full cursor-pointer bg-dark-black bg-opacity-40 backdrop-blur-sm"
                >
                  <div className="px-8 translate-y-0 border-2 sm:translate-y-full md:translate-y-0 lg:mr-[10%] group/dialog md:ml-auto border-dark-blue bg-gold text-dark-blue">
                    <div className="relative flex flex-col items-center justify-center gap-1 px-4 py-1 bg-gray-300 border-2 border-gray-500 rounded-md">
                      <div className="font-bold text-center uppercase">
                        To confirm reset of
                        <br /> controller, Proceed?
                      </div>
                      <div className="flex items-center gap-4 transition-all group-hover:dialog/gap-6">
                        <HiChevronDoubleRight className="text-gold" />
                        <button
                          onClick={() => onConfirm("reset", true)}
                          className="px-4 text-xl font-bold bg-gray-200 border-2 border-gray-400 rounded-md hover:scale-105 active:scale-95"
                        >
                          OK
                        </button>
                        <HiChevronDoubleRight className="rotate-180 text-gold" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-xl text-center text-white pt-36">
            Contact production level or admin to resume or reset controller
          </div>
        )}
      </div>

      <div className="absolute top-0 hidden sm:block sm:top-[25%] left-[50%] -translate-x-[50%] text-5xl sm:text-7xl text-center text-white">
        {machineName}
      </div>
      <div className="absolute w-[80%] sm:w-fit mx-auto justify-center flex gap-2 text-center bg-dark-blue border-2 border-white rounded-xl top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] px-1 py-1 sm:px-4 sm:py-2 text-white uppercase">
        <div className="text-2xl text-center sm:text-6xl sm:pb-2 sm:hidden">
          {machineName}
        </div>
        <div className="text-2xl sm:text-6xl">OFFLINE</div>
      </div>
    </div>
  )
}
