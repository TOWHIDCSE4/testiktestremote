import {
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
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
import { Divider } from "@mui/material"
import { HiChevronDoubleDown, HiChevronDoubleLeft } from "react-icons/hi"
import { cva, type VariantProps } from "class-variance-authority"

import { Lato } from "next/font/google"
import ResultsBoardComponent from "./Results"
import StopMenuComponent from "./StopMenu"
import EndProdMenuComponent from "./EndProdMenu"
import DetailContextComponent from "./DetailContext"
import DigitalClockComponent from "./DigitalClock"
import FancyButtonComponent from "./FancyButton"
import ConsoleComponent from "./Console"

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "optional",
  subsets: ["latin", "latin-ext"],
})

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
    unitCreated,
    setReadingsDivRef,
    readingMessages,
  } = useContext(ControllerContext)
  const [isTimerLogsModalOpen, setIsTimerLogsModalOpen] = useState(false)

  const controllerClockArray = hourMinuteSecond(controllerClockSeconds)
  const cycleClockSecondsArray = hourMinuteSecondMilli(cycleClockSeconds)

  const [isEndProductionModalOpen, setIsEndProductionModalOpen] =
    useState(false)

  const isCycleClockStarting = false
  const isAbleToStart = true
  const { isMaximized } = useControllerModal()

  // FIXME:/JAMES should consider this value
  const process = 80

  const messagesRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setReadingsDivRef(messagesRef)
  }, [setReadingsDivRef])

  const [isStopMenuOpen, setIsStopMenuOpen] = useState<boolean>(false)
  const toggleIsStopMenuOpen = useCallback(() => {
    setIsStopMenuOpen(!isStopMenuOpen)
  }, [isStopMenuOpen, setIsStopMenuOpen])

  return (
    <div
      className={cn(
        "flex flex-col w-full h-full justify-between overflow-hidden",
        lato.className,
        { "pr-5": isMaximized }
      )}
    >
      <Header
        progress={process}
        isLoading={false}
        locationName="Conroe"
        setOpenTimerLogs={() => setIsTimerLogsModalOpen(true)}
        onClose={onClose}
        onFullScreen={onFullScreen}
      />
      <div className="relative flex gap-8 px-12 py-0 mt-8">
        <div className="flex-1 py-0">
          <DigitalClockComponent />
          <div className="flex justify-between mt-6">
            <DetailContextComponent />
            <div>
              <FancyButtonComponent
                textSize={"lg"}
                className="font-bold"
                onClick={() => {
                  toggleIsStopMenuOpen()
                }}
              >
                P
              </FancyButtonComponent>
            </div>
          </div>
          <div className="flex items-center gap-10 pl-4 mt-6 mb-24">
            <FancyButtonComponent className="gap-4 px-4 py-2">
              <span className="text-[#7a828d] text-normal italic">
                *Add Operator
              </span>
              <HiChevronDoubleDown className="text-[#da8d00]" />
            </FancyButtonComponent>
            <FancyButtonComponent className="gap-4 px-4 py-2">
              <span className="text-[#7a828d] text-normal italic">
                *Job Assigning
              </span>
              <HiChevronDoubleDown className="text-[#da8d00]" />
            </FancyButtonComponent>
          </div>
        </div>
        <ResultsBoardComponent />

        <StopMenuComponent
          isOpen={isStopMenuOpen}
          toggleOpen={toggleIsStopMenuOpen}
        />
        <EndProdMenuComponent />
      </div>
      <ConsoleComponent />
    </div>
  )

  return (
    <div
      className={cn(
        "flex flex-col w-full h-full justify-between overflow-hidden timercontroller",
        lato.className,
        { "pr-5": isMaximized }
      )}
    >
      <Header
        progress={process}
        isLoading={false}
        locationName="Conroe"
        setOpenTimerLogs={() => setIsTimerLogsModalOpen(true)}
        onClose={onClose}
        onFullScreen={onFullScreen}
      />
      <div
        className={`relative flex flex-col-reverse md:flex-row md:justify-between flex-1 gap-2 px-5 overflow-auto lg:overflow-hidden`}
      >
        {/* Left Column */}
        <div className="pane pane-left">
          <div className="detail-pane">
            <h4 className="detail-heading">Details</h4>
            <div className="detail-container">
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

          <div className="detail-pane">
            <h4 className="detail-heading">Operator</h4>
            <p>{`${operator.firstName} ${operator.lastName}`}</p>
          </div>
          <div className="flex-1 detail-pane">
            <div className="flex items-center gap-3">
              <h4 className="detail-heading">READINGS</h4>
              <Divider className="flex-1 dark:border-white" />
            </div>
            <div className="reading-pane">
              <div
                className="reading-collection"
                ref={messagesRef}
                id="messages"
              >
                <h6 className="">Open the timer controller:</h6>
                <div className="">
                  ------<span className="font-medium">OPERATIONS</span>------
                </div>
                {readingMessages?.map((item, index) => {
                  return (
                    <span className="" key={index}>
                      {item}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="pane pane-right">
          <div className="productiontime-container">
            Time: {controllerClockArray[0]}: {controllerClockArray[1]}:
            {controllerClockArray[2]}
          </div>

          {/* FIXME:/James need to add process parameter exactly */}
          <div
            className={`countdown-container ${isMaximized ? "full" : "modal"} ${
              process > 100
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
            >
              {isCycleClockRunning ? (
                <span className="button-stop">Stop</span>
              ) : (
                <span className="button-start">Start</span>
              )}
            </button>
          </div>

          <div
            className={`results-container flex-1 ${
              isMaximized ? "full" : "modal"
            }`}
          >
            <div className="results-detail">
              <div className="">Units Per Hour:</div>
              <div className="">{totals.unitsPerHour.toFixed(3)}</div>
              <div className="">Tons Per Hour:</div>
              <div className="">{totals.tonsPerHour.toFixed(3)}</div>
              <div className="">Total Tons:</div>
              <div className="">{totals.totalTons.toFixed(3)}</div>
            </div>
            <div className="h-full results-count">
              <div className="title">Unit Created</div>
              <div className="results-count-number">
                {unitCreated < 100 && <div className="zero">0</div>}
                {unitCreated < 10 && <div className="zero">0</div>}
                {unitCreated == 0 ? (
                  <div className="zero">0</div>
                ) : (
                  <div className="digit">{unitCreated}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer progress={process} isLoading={false} timeZone={""} />
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
