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
import PauseButtonComponent from "./PauseButton"

export interface ControllerDetailData {
  locationName: string
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
  const [isLogsOpen, setIsLogsOpen] = useState(false)

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
        "flex flex-col w-full h-full justify-between overflow-x-hidden overflow-y-auto",
        lato.className
      )}
    >
      <Header
        isLoading={false}
        locationName={controllerDetailData.locationName ?? ""}
        setOpenTimerLogs={() => setIsLogsOpen(true)}
        onClose={onClose}
      />
      <div className="relative w-full">
        <div className="mx-auto lg:container lg:max-w-2xl">
          <div className="relative flex justify-center gap-8 px-0 py-0 mt-8 lg:px-12">
            <div className="flex-1 py-0">
              <DigitalClockComponent />
              <div className="flex justify-between px-4 mt-6 lg:px-0">
                <div>
                  <DetailContextComponent />
                  <div className="flex flex-col items-start gap-4 pl-4 mt-6 mb-24 lg:hidden">
                    <OperatorSelectComponent />
                    <JobSelectComponent />
                  </div>
                </div>
                <div className="hidden lg:block">
                  <PauseButtonComponent onClick={toggleIsStopMenuOpen} />
                </div>
                <div className="block lg:hidden">
                  <ResultsBoardComponent />
                </div>
              </div>
              <div className="flex-row items-center hidden gap-10 pl-4 mt-6 mb-24 lg:flex">
                <OperatorSelectComponent />
                <JobSelectComponent />
              </div>
            </div>
            <div className="hidden lg:block">
              <ResultsBoardComponent />
            </div>
          </div>
        </div>
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
      <ConsoleComponent isLogsOpen={isLogsOpen} setIsLogsOpen={setIsLogsOpen} />
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
