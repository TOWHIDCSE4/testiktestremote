import { useContext, useRef, useState } from "react"
import Header from "./Header"
import Footer from "./Footer"
import { ControllerContext } from "./ControllerContext"
import {
  hourMinuteSecond,
  hourMinuteSecondMilli,
} from "../../../../../helpers/timeConverter"
import BottomMenu from "./BottomMenu"
import SideMenu from "./SideMenu"
import EndProductionModal from "../modals/EndProductionModal"
import useAddControllerTimer from "../../../../../hooks/timers/useAddControllerTimer"

export interface ControllerDetailData {
  factoryName: string
  machineName: string
  partName: string
  averageTime: number
  weight: number
}

interface ControllerV2Props {
  timerId: any
  onClose: () => void
  onFullScreen: () => void
}

const ControllerV2 = ({
  timerId,
  onClose,
  onFullScreen,
}: ControllerV2Props) => {
  const {
    controllerDetailData,
    controllerClockSeconds,
    cycleClockSeconds,
    operator,
    onToggleStart,
    isCycleClockRunning,
    unitCreated,
  } = useContext(ControllerContext)

  const controllerClockArray = hourMinuteSecond(controllerClockSeconds)
  const cycleClockSecondsArray = hourMinuteSecondMilli(cycleClockSeconds)
  const [isEndProductionModalOpen, setIsEndProductionModalOpen] =
    useState(false)

  return (
    <div className="absolute top-0 left-0 flex flex-col w-full h-full overflow-hidden">
      <Header
        progress={0}
        isLoading={false}
        locationName="Conroe"
        setOpenTimerLogs={() => {}}
        onClose={onClose}
        onFullScreen={onFullScreen}
      />
      <div className="flex justify-between p-5">
        {/* Left Column */}
        <div className="flex flex-col gap-4 text-lg uppercase">
          <div>
            <h4 className="font-bold text-gray-800 dark:bg-dark-blue dark:text-white">
              Details
            </h4>
            <div className="flex flex-col gap-1 ">
              <div className="flex gap-2">
                <p>factory:</p>
                <p>{controllerDetailData.factoryName}</p>
              </div>
              <div className="flex gap-2">
                <p>machine:</p>
                <p>{controllerDetailData.machineName}</p>
              </div>
              <div className="flex gap-2">
                <p>Product:</p>
                <p>{controllerDetailData.partName}</p>
              </div>
              <div className="flex gap-2">
                <p>Average Time:</p>
                <p>{controllerDetailData.averageTime} seconds</p>
              </div>
              <div className="flex gap-2">
                <p>Weight:</p>
                <p>{controllerDetailData.weight?.toFixed(3)} tons</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h4 className="font-bold text-gray-800 dark:bg-dark-blue dark:text-white">
              Operator
            </h4>
            <p>{`${operator.firstName} ${operator.lastName}`}</p>
          </div>
        </div>
        {/* Right Column */}
        <div className="flex flex-col gap-2">
          <div>
            Time: {controllerClockArray[0]}: {controllerClockArray[1]}:
            {controllerClockArray[2]}
          </div>
          <div className="countdown-container w-full ipadair:w-[385px] lg:w-[610px] xl:w-[680px] 2xl:w-[800px] rounded-md border-2 border-b-4 border-stone-500 border-b-green-500  bg-[#f1f2e1] pt-2 pb-3.5">
            <div className="text-8xl">
              {cycleClockSecondsArray[0]}:{cycleClockSecondsArray[1]}:
              {cycleClockSecondsArray[2]}:{cycleClockSecondsArray[3]}
            </div>
          </div>
          <button className="text-4xl " onClick={onToggleStart}>
            {isCycleClockRunning ? (
              <span className="text-red-500">Stop</span>
            ) : (
              <span className="text-green-600">Start</span>
            )}
          </button>
        </div>
      </div>
      <div className="self-end mx-5 mt-40">
        <p>Unit Created</p>
        <p className="text-dark-blue text-8xl">{unitCreated}</p>
      </div>
      <Footer progress={0} isLoading={false} timeZone={""} />
      <BottomMenu />
      <SideMenu
        onClick={() => {
          setIsEndProductionModalOpen(true)
        }}
      />

      {/* FIXME:/Elijah should rewrite this with proper variables */}
      <EndProductionModal
        isOpen={isEndProductionModalOpen}
        onClose={() => {
          setIsEndProductionModalOpen(false)
        }}
        stopTimer={() => {}}
        timerId={timerId}
        machineName={controllerDetailData.machineName ?? ""}
        controllerTimerId={""}
        isTimerClockRunning={false}
      />
    </div>
  )
}

export default ControllerV2
