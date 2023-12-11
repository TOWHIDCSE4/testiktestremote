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
    <div className="fixed z-[40] top-0 left-0 w-screen h-screen bg-slate-800/80 flex items-center justify-center">
      <div
        data-floating={!isFullScreen}
        className="w-[100%] h-[100%] max-w-screen max-h-screen data-[floating=true]:max-w-[1024px] data-[floating=true]:max-h-[800px] data-[floating=true]:mx-auto relative   data-[floating=true]:rounded-3xl bg-white data-[floating=true]:shadow-md  data-[floating=true]:border-2 border-gray-400 overflow-auto"
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
