"use client"
import { Fragment, useState } from "react"
import Controller from "../pages/production/timer/ControllerV2"
import cn from "classnames"
import useControllerModal from "../../store/useControllerModal"
import { Dialog, Transition } from "@headlessui/react"

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
  const { isMaximized, setIsMaximized } = useControllerModal()
  const toggleFullscreen = () => setIsMaximized(!isMaximized)
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={"z-50 relative"}
        open
        onClose={() => {
          onClose()
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-50 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>
        {timerId && (
          <div
            className={`bg-white fixed !max-w-full !max-h-full  transition-all z-50 top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] ${
              isMaximized
                ? "top-0 left-0 w-screen h-screen"
                : "w-[1024px] h-[800px] rounded-3xl border-2 overflow-hidden"
            }`}
          >
            <Controller
              onClose={onClose}
              timerId={timerId}
              onFullScreen={toggleFullscreen}
            />
          </div>
        )}
      </Dialog>
    </Transition.Root>
  )
}

export default ControllerModal
