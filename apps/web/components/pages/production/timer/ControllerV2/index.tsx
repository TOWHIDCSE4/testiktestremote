import { useCallback, useContext, useState } from "react"
import Header from "./Header"
import { ControllerContext } from "./ControllerContext"
import EndProductionModal from "../modals/EndProductionModal"
import cn from "classnames"
import useControllerModal from "../../../../../store/useControllerModal"
import TimerLogsModal from "../modals/TimerLogsModalV2"
import { Lato } from "next/font/google"
import ResultsBoardComponent from "./Results"
import StopMenuComponent from "./StopMenu"
import EndProdMenuComponent from "./EndProdMenu"
import DetailContextComponent from "./DetailContent"
import DigitalClockComponent from "./DigitalClock"
import FancyButtonComponent from "./FancyButton"
import ConsoleComponent from "./Console"

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "optional",
  subsets: ["latin", "latin-ext"],
})
import OperatorSelectComponent from "./OperatorSelector"
import JobSelectComponent from "./JobSelector"

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
  const { variant, controllerDetailData } = useContext(ControllerContext)
  const [isTimerLogsModalOpen, setIsTimerLogsModalOpen] = useState(false)

  const [isEndProductionModalOpen, setIsEndProductionModalOpen] =
    useState(false)

  const { isMaximized } = useControllerModal()

  const [isStopMenuOpen, setIsStopMenuOpen] = useState<boolean>()
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
                intent={variant}
              >
                P
              </FancyButtonComponent>
            </div>
          </div>
          <div className="flex items-center gap-10 pl-4 mt-6 mb-24">
            <OperatorSelectComponent />
            {/* <FancyButtonComponent className="gap-4 px-4 py-2">
              <span className="text-[#7a828d] text-normal italic">
                *Job Assigning
              </span>
              <HiChevronDoubleDown className="text-[#da8d00]" />
            </FancyButtonComponent> */}
            <JobSelectComponent />
          </div>
        </div>
        <ResultsBoardComponent />

        <StopMenuComponent
          isOpen={isStopMenuOpen}
          toggleOpen={toggleIsStopMenuOpen}
        />
        <EndProdMenuComponent
          onClick={() => {
            setIsEndProductionModalOpen(true)
          }}
        />
      </div>
      <ConsoleComponent />
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
