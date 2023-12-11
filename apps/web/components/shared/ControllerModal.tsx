"use client"
import { useState } from "react"
import Controller from "../pages/production/timer/ControllerV2"
import cn from "classnames"

interface ControllerModalProps {
  isOpen: boolean
  timerId: any
  onClose: () => void
}

const ControllerModal = ({
  onClose,
  isOpen,
  timerId,
}: ControllerModalProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const toggleFullscreen = () =>
    setIsFullScreen((isFullScreen) => !isFullScreen)
  if (!isOpen || !timerId) return null
  return (
    <div className="fixed z-[40] top-0 w-screen h-screen flex items-center left-0 justify-center">
      <div
        className={cn(
          "relative bg-white shadow-md border border-gray-400 overflow-auto",
          {
            "w-[100%] h-[100%] max-w-[1024px] max-h-[800px]": !isFullScreen,
            "w-screen h-screen": isFullScreen,
          }
        )}
      >
        <Controller
          onClose={onClose}
          timerId={timerId}
          onFullScreen={toggleFullscreen}
        />
      </div>
    </div>
  )
}

export default ControllerModal
