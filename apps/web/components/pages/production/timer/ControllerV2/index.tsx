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
import cn from "classnames"
import "./styles.scss"
import useControllerModal from "../../../../../store/useControllerModal"
import TimerLogsModal from "../modals/TimerLogsModalV2"
import JobDropdwown from "./JobDropdown"

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
    totals,
    isJobsLoading,
    isControllerJobLoading,
    isChangingJob,
    unitCreated,
  } = useContext(ControllerContext)
  const [isTimerLogsModalOpen, setIsTimerLogsModalOpen] = useState(false)
  const controllerClockArray = hourMinuteSecond(controllerClockSeconds)
  const cycleClockSecondsArray = hourMinuteSecondMilli(cycleClockSeconds)
  const [isEndProductionModalOpen, setIsEndProductionModalOpen] =
    useState(false)

  const isCycleClockStarting = false
  const isAbleToStart = true

  const { isMaximized } = useControllerModal()

  return (
    <div
      className={cn(
        "absolute top-0 left-0 flex flex-col w-full h-full overflow-hidden timercontroller",
        { "pr-5": isMaximized }
      )}
    >
      <Header
        progress={0}
        isLoading={false}
        locationName="Conroe"
        setOpenTimerLogs={() => setIsTimerLogsModalOpen(true)}
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

          <div className="flex flex-col gap-1">
            <h4 className="font-bold text-gray-800 dark:bg-dark-blue dark:text-white">
              <JobDropdwown />
            </h4>
            <p>{`${operator.firstName} ${operator.lastName}`}</p>
          </div>
        </div>
        {/* Right Column */}
        <div className="flex flex-col gap-2">
          <div className="productiontime-container">
            Time: {controllerClockArray[0]}: {controllerClockArray[1]}:
            {controllerClockArray[2]}
          </div>

          {/* FIXME:/James need to add process parameter exactly */}
          <div
            className={`countdown-container ${
              150 > 100
                ? "border-red-500"
                : isCycleClockRunning
                ? "border-green-500"
                : "border-stone-500"
            }`}
          >
            <div className="countdown-container-text">
              <div className="countdown-container-digit">
                {cycleClockSecondsArray[0]}
              </div>
              <div className="countdown-container-digit digit-divider">:</div>
              <div className="countdown-container-digit">
                {cycleClockSecondsArray[1]}
              </div>
              <div className="countdown-container-digit digit-divider">:</div>
              <div className="countdown-container-digit">
                {cycleClockSecondsArray[2]}
              </div>
              <div className="countdown-container-digit digit-divider">:</div>
              <div className="countdown-container-digit">
                {cycleClockSecondsArray[3]}
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full">
            <button
              className={`button-clockaction ${
                isCycleClockStarting ? "starting" : "starting-false"
              } ${isAbleToStart ? "canstart" : "canstart-false"}`}
              onClick={onToggleStart}
              disabled={isJobsLoading || isControllerJobLoading}
            >
              {isChangingJob ? (
                <span className="text-2xl">Changing controller job</span>
              ) : isControllerJobLoading ? (
                <span className="text-2xl">Assigning Job to Controller</span>
              ) : isJobsLoading ? (
                <span className="text-2xl">Loading Controller Jobs</span>
              ) : isCycleClockRunning ? (
                <span className="button-stop">Stop</span>
              ) : (
                <span className="button-start">Start</span>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="flex uppercase text-lg items-center self-end mx-5 mt-40 gap-20">
        <div className="flex flex-col">
          <div className="flex gap-4">
            <p className="font-bold">Units Per Hour:</p>
            <p className="">{totals.unitsPerHour.toFixed(3)}</p>
          </div>
          <div className="flex gap-4">
            <p className="font-bold">Tons Per Hour:</p>
            <p className="">{totals.tonsPerHour.toFixed(3)}</p>
          </div>
          <div className="flex gap-4">
            <p className="font-bold">Total Tons:</p>
            <p className="">{totals.totalTons.toFixed(3)}</p>
          </div>
        </div>
        <div className="">
          <p>Unit Created</p>
          <p className="text-dark-blue text-8xl">{unitCreated}</p>
        </div>
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
      <TimerLogsModal
        isOpen={isTimerLogsModalOpen}
        setIsOpen={setIsTimerLogsModalOpen}
      />
    </div>
  )
}

export default ControllerV2
